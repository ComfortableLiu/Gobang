export interface IUserDao {
  useId?: number
  nickName?: string
  deviceId?: string
}

// 注册接口入参
export interface IRegisterReq {
  deviceId: string
}

// 注册接口返回值
export interface IRegisterRes {

}

export interface CreateUserDto extends IUserDao{
}
