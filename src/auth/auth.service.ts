import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './dto';
import { FirebaseService } from 'src/firebase/firebase.service';
import * as argon from 'argon2';
@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private readonly config: ConfigService,
    private readonly firebaseService: FirebaseService,
  ) {}
  async register(dto: RegisterDto) {
    const userRef = this.firebaseService
      .getFireStoreInstance()
      .collection('users')
      .doc(dto.email);

    const docRef = await userRef.get();

    if (docRef.exists) {
      throw new ForbiddenException('Credentials already taken');
    }

    const hash = await argon.hash(dto.password);
    await userRef.set({
      fistName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: hash,
    });
    const payload = {
      sub: docRef.id,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, { secret: secret });
    return { accessToken: token };
  }

  
  async login(dto: LoginDto) {
    const userRef = this.firebaseService
      .getFireStoreInstance()
      .collection('users')
      .doc(dto.email);

    const docRef = await userRef.get();

    if (!docRef.exists) {
      throw new ForbiddenException('Credentials Incorrect');
    }

    const pwMatches = await argon.verify(docRef.data().password, dto.password);
    if (!pwMatches) {
      throw new ForbiddenException('Credentials Incorrect');
    }

    const payload = {
      sub: docRef.id,
    };
    const secret = this.config.get('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, { secret: secret });
    return { accessToken: token };
  }
}
