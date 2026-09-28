import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class CurrentUserService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  async getId(): Promise<string> {
    const configuredId = process.env.DEV_USER_ID?.trim();
    const user = configuredId
      ? await this.users.findOneBy({ id: configuredId })
      : await this.users.findOne({ where: { email: process.env.SEED_USER_EMAIL?.trim().toLowerCase() } });
    if (!user) throw new NotFoundException('Development user is not seeded');
    return user.id;
  }
}

