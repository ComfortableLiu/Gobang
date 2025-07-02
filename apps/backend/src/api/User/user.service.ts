import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../Entity/user.entity";
import { CreateUserDto } from "./type";

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepository: Repository<UserEntity>) {
  }

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    const user = this.userRepository.create(createUserDto)
    return this.userRepository.save(user)
  }

  async findOneByDeviceId(deviceId: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({ deviceId })
  }
}
