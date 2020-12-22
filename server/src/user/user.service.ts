import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
  ) {}

  // ! LOGIN
  async login(data: { email: string; password: string }) {
    const { email, password } = data;
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user || !(await user.comparePassword(password))) {
      throw new HttpException('Invalid username/password', HttpStatus.BAD_REQUEST);
    }

    return user.userToReturn();
  }

  // ! REGISTER
  async register(data: { email: string; password: string; username: string }) {
    const { email } = data;
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (user) {
      throw new HttpException('User with this name already exists', HttpStatus.BAD_REQUEST);
    }

    if (!data.username) {
      data.username = data.email;
    }

    const result = this.userRepo.create(data);
    await this.userRepo.save(result);

    return HttpStatus.CREATED;
  }
}
