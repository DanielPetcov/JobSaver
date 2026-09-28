import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CurrentUserService } from './current-user.service';
@Module({ imports: [TypeOrmModule.forFeature([User])], providers: [CurrentUserService], exports: [CurrentUserService] })
export class CurrentUserModule {}
