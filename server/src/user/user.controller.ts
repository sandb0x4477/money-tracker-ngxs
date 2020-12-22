import { Controller, Post, Body } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('auth')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('login')
  // @UsePipes(new ValidationPipe())
  login(@Body() data: { email: string; password: string }) {
    return this.userService.login(data);
  }

  // @Post('register')
  // // @UsePipes(new ValidationPipe())
  // register(@Body() data: { email: string; password: string; username: string }) {
  //   return this.userService.register(data);
  // }
}
