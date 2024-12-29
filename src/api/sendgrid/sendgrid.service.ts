import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgmail from '@sendgrid/mail';
@Injectable()
export class SendgridService {
  constructor(config: ConfigService) {
    sgmail.setApiKey(config.get('SENDGRID_KEY'));
  }

  sendMail(data) {
    const msg = {
      to: '',
      from: '',
      templateId: '',
      dynamicTemplateData: {
        otp: data.otp,
      },
    };

    return sgmail.send(msg);
  }
}
