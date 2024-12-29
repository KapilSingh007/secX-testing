import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, UpdatePasswordDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  signup(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  userLogin(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('forget-password')
  forgetPassword(){
    return this.authService.forgetpassword()
  }

  @Post('update-password')
  updatePassword(@Body() dto:UpdatePasswordDto){
    return this.authService.updatePassword(dto)
  }
  
}
