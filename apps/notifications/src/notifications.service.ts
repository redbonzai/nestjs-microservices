import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { NotifyEmailDto } from './dto';

@Injectable()
export class NotificationsService {
  constructor(private readonly configService: ConfigService) {
    console.log(
      'INSIDE THE NOTIFICATION SERVICE CLASS: ',
      this.configService.get('SMTP_USER'),
    );
  }

  private readonly transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: this.configService.get('SMTP_USER'),
      clientId: this.configService.get('GOOGLE_OAUTH_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET'),
      refreshToken: this.configService.get('GOOGLE_OAUTH_REFRESH_TOKEN'),
    },
  });

  async notifyEmail({ email, subject, text }: NotifyEmailDto) {
    console.log('NOTIFICATION EMAIL: ', email);
    await this.transporter.sendMail({
      from: this.configService.get('SMTP_USER'),
      to: email,
      subject,
      text,
    });
  }
}
