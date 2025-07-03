import { Controller, Get, Post, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { IRegisterReq, IUserDao } from "./type";
import { BusinessException } from "../../interceptors/business.exception";

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  /**
   * 注册一个用户，默认昵称是设备ID的前8位
   * @param req
   */
  @Post('/register')
  async register(@Query() req: IRegisterReq): Promise<IUserDao> {
    const deviceId = req.deviceId
    if (!deviceId) throw new BusinessException('设备ID不能为空')
    // 拿一下，如果这个did已经有了，那就直接返回就好
    const user = await this.userService.findOneByDeviceId(deviceId)
    if (user) {
      return user
    }
    // 没有的话就注册一个新的
    return await this.userService.create({
      deviceId,
      nickName: `棋手_${deviceId.slice(0, 8)}`
    })
  }

  @Get('/userInfo')
  async userInfo(@Query() req: IRegisterReq): Promise<IUserDao> {
    const deviceId = req.deviceId
    if (!deviceId) throw new BusinessException('设备ID不能为空')
    // 拿一下，如果这个did已经有了，那就直接返回就好
    const user = await this.userService.findOneByDeviceId(deviceId)
    if (!user) {
      throw new BusinessException('用户不存在')
    }
    return user
  }
}
