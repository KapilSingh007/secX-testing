import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { FirebaseModule } from 'src/api/firebase/firebase.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports:[FirebaseModule]
})
export class UsersModule {}
