import { BadRequestException, Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';

@Injectable()
export class EmailService {
  private readonly transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string) {
    if (!to || !subject || !html) {
      throw new BadRequestException('이메일 전송에 실패하였습니다.');
    }
    const sendSuccess = await this.transporter.sendMail({
      from: {
        name: 'letsee',
        address: 'help@letsee.io',
      },
      to,
      subject,
      html,
    });

    if (!sendSuccess) {
      throw new BadRequestException('send email error');
    }

    return {
      message: 'Sign up mail send success',
    };
  }

  async sendEmailByTemplate(toEmail, subject, templateName, variables) {}

  private async loadTemplate(templateName) {
    const _path = path.join(__dirname, '../resources/template/' + templateName + '.html');
    const template = fs.readFileSync(_path, 'utf-8');
    return new Promise((resolve, reject) => {
      resolve(template);
    });
  }
}
