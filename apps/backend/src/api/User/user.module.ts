import { Module } from '@nestjs/common';
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../Entity/user.entity";

/**
 * 这里虽然看起来有用户的相关信息，但是实际上也只是存一个前端来的deviceId和ip，用户没有任何登录操作
 * 毕竟这不是一个什么信息敏感项目，而且一切都是以网络对战五子棋为主，别的就往后稍稍
 * 未来某一天，我可能心血来潮给他整上身份认证这一说也说不定，至少现在是没有的:)
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {
}
