import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { FirebaseModule } from 'src/api/firebase/firebase.module';
import { SendgridModule } from 'src/api/sendgrid/sendgrid.module';

@Module({
  imports: [JwtModule.register({}), FirebaseModule,SendgridModule],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
