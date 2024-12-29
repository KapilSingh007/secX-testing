import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FirebaseModule } from './firebase/firebase.module';
import { SendgridModule } from './sendgrid/sendgrid.module';
import { LoggerMiddleware } from 'src/middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, expandVariables: true }),
    AuthModule,
    UsersModule,
    FirebaseModule,
    SendgridModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
