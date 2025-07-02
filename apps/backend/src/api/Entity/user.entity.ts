import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IUserDao } from "../User/type";

@Entity({
  name: 'user'
})
export class UserEntity extends BaseEntity implements IUserDao{
  @PrimaryGeneratedColumn({
    name: 'user_id'
  })
  useId?: number

  @Column({
    name: 'nick_name',
  })
  nickName?: string

  @Column({
    name: 'device_id',
  })
  deviceId?: string
}
