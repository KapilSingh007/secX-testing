import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
  healthCheck(): string {
    return 'Server Running fine';
  }
}
