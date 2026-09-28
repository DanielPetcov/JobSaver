import bcrypt from 'bcryptjs';
import type { DataSource } from 'typeorm';
import { User } from '../users/user.entity';

export async function seedDevelopmentUser(dataSource: DataSource): Promise<User> {
  const email = process.env.SEED_USER_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_USER_PASSWORD;
  if (!email || !password) throw new Error('SEED_USER_EMAIL and SEED_USER_PASSWORD are required');
  const users = dataSource.getRepository(User);
  const existing = await users.findOneBy({ email });
  if (existing) return existing;
  return users.save(users.create({ email, passwordHash: await bcrypt.hash(password, 12) }));
}

