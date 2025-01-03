import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller()
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('health-check')
  getHealthCheck(): string {
    return this.apiService.healthCheck();
  }
}
