import {
  BadGatewayException,
  Injectable,
  UnprocessableEntityException,
} from "@nestjs/common";
import { lookup } from "node:dns/promises";
import * as cheerio from "cheerio";
import { isPublicIp, normalizeHttpUrl } from "./public-url";

export interface CleanJobPage {
  sourceUrl: string;
  title: string | null;
  canonicalUrl: string | null;
  description: string | null;
  text: string;
}

@Injectable()
export class JobPageFetcherService {
  async fetch(input: string): Promise<CleanJobPage> {
    let url = normalizeHttpUrl(input);
    for (let redirects = 0; redirects <= 4; redirects += 1) {
      await this.assertPublicDns(new URL(url).hostname);
      const response = await fetch(url, {
        redirect: "manual",
        signal: AbortSignal.timeout(10_000),
        headers: { accept: "text/html,application/xhtml+xml" },
      }).catch(() => {
        throw new BadGatewayException("Could not fetch the job page");
      });
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location)
          throw new BadGatewayException(
            "Job page returned an invalid redirect",
          );
        url = normalizeHttpUrl(new URL(location, url).toString());
        continue;
      }
      if (!response.ok)
        throw new BadGatewayException(
          `Job page returned HTTP ${response.status}`,
        );
      if (
        !response.headers
          .get("content-type")
          ?.toLowerCase()
          .includes("text/html")
      )
        throw new UnprocessableEntityException(
          "The URL did not return an HTML page",
        );
      const html = await this.readBounded(response);
      return this.clean(url, html);
    }
    throw new BadGatewayException("Job page redirected too many times");
  }

  private async assertPublicDns(hostname: string): Promise<void> {
    const records = await lookup(hostname, { all: true, verbatim: true }).catch(
      () => {
        throw new BadGatewayException("Could not resolve the job page host");
      },
    );
    if (!records.length || records.some(({ address }) => !isPublicIp(address)))
      throw new UnprocessableEntityException(
        "The URL must resolve only to public internet addresses",
      );
  }

  private async readBounded(response: Response): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader)
      throw new UnprocessableEntityException(
        "The job page had no readable content",
      );
    const maxBytes = 1_500_000;
    let size = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (value) {
        size += value.byteLength;
        if (size > maxBytes) {
          await reader.cancel();
          throw new UnprocessableEntityException(
            "The job page is too large to extract",
          );
        }
        chunks.push(value);
      }
    }
    return new TextDecoder().decode(Buffer.concat(chunks));
  }

  private clean(sourceUrl: string, html: string): CleanJobPage {
    const $ = cheerio.load(html);
    $("script,style,noscript,svg,nav,footer,header,aside,form,iframe").remove();
    const text =
      $('main,article,[role="main"]').first().text() || $("body").text();
    const compact = text.replace(/\s+/g, " ").trim().slice(0, 24_000);
    if (compact.length < 80)
      throw new UnprocessableEntityException(
        "The job page does not expose enough readable content",
      );
    const title = $("title").first().text().trim() || null;
    const canonicalUrl = $('link[rel="canonical"]').attr("href") ?? null;
    const description =
      $('meta[name="description"],meta[property="og:description"]')
        .first()
        .attr("content")
        ?.trim() ?? null;
    return { sourceUrl, title, canonicalUrl, description, text: compact };
  }
}
