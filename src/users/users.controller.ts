import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from 'src/auth/decorator';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtGuard)
  @Get('me')
  getUserDetail(@GetUser() user: any) {
    return this.userService.getUserDetail(user.sub);
  }

  @Get('get-all')
  getAllUser(){
    return this.userService.getAllUser()
  }
}
