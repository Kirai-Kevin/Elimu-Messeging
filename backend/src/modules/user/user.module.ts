import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SendbirdService } from './sendbird.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [UserService, SendbirdService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
