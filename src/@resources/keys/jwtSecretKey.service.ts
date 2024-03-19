import * as fs from 'fs';
import * as path from 'app-root-path';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtSecretKey {
  private readonly rootPath: string;

  constructor() {
    this.rootPath = path.toString();
  }

  secretKey(): string {
    const jwtSecretKeyRead = fs.readFileSync(`${this.rootPath}/src/resources/keys/jwt_secret.key`, 'utf8');
    const jwtSecretKey = jwtSecretKeyRead.replace(/\s/g, '');
    return jwtSecretKey;
  }
}
