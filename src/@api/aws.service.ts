import { BadRequestException, Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { InvokeCommand, LambdaClient } from '@aws-sdk/client-lambda';

@Injectable()
export class AwsService {
  private readonly s3: S3Client;
  private readonly lambda: LambdaClient;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    this.lambda = new LambdaClient({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  /** Lambda 함수 실행 **/
  async lambdaInvoke(functionName: string, event: any): Promise<any> {
    const client = this.lambda;
    const input = {
      FunctionName: functionName,
      Payload: new TextEncoder().encode(JSON.stringify(event, null, 2)),
    };
    const command = new InvokeCommand(input);
    return await client.send(command);
  }

  /** S3 local 파일 업로드 **/
  // async uploadFileToS3(
  //   localFilePath: string,
  //   s3FilePath: string,
  //   bucket: string,
  // ): Promise<any> {
  //   try {
  //     const fileType = mime.lookup(localFilePath);
  //     await fs.readFileSync(localFilePath);
  //     const param: any = {
  //       Bucket: bucket,
  //       Key: s3FilePath,
  //       Body: fs.createReadStream(localFilePath),
  //       ACL: 'private',
  //     };
  //     if (fileType) {
  //       param.ContentType = fileType;
  //     }
  //     const command = new PutObjectCommand(param);
  //     return await this.s3.send(command);
  //   } catch (error) {
  //     throw new BadRequestException({ message: error.message, cause: error });
  //   }
  // }
  //** ---------------------------------memory storage Buffer image upload -----------------------------------------------*/
  async uploadFileToS3(localFilePath: Buffer | string, s3FilePath: string, bucket: string): Promise<any> {
    try {
      const fileData = localFilePath;

      if (!fileData) {
        throw new Error('Failed to read file data');
      }

      const fileType = getMimeTypeFromBuffer(localFilePath);

      const param: any = {
        Bucket: bucket,
        Key: s3FilePath,
        Body: fileData,
        ACL: 'private',
      };
      if (fileType) {
        param.ContentType = fileType;
      }
      const command = new PutObjectCommand(param);
      return await this.s3.send(command);
    } catch (error) {
      throw new BadRequestException({ message: error.message, cause: error });
    }

    function getMimeTypeFromBuffer(buffer) {
      const magicNumber = buffer.toString('hex', 0, 4);

      if (magicNumber === 'ffd8ffe0' || 'ffd8ffdb') {
        return 'image/jpeg';
      } else if (magicNumber === '89504e47') {
        return 'image/png';
      } else if (magicNumber === '47494638') {
        return 'image/gif';
      } else {
        return '';
      }
    }
  }

  /** ---------------------------------------------------------------------------------- */

  /** S3 Object 삭제 **/
  async deleteS3Object(param) {
    const command = new DeleteObjectCommand(param);
    return await this.s3.send(command);
  }

  /** S3 Json 파일 업로드 **/
  async uploadJsonToS3(object: Record<string, unknown>, s3FilePath: string, bucket: string): Promise<unknown> {
    try {
      const buffer = Buffer.from(JSON.stringify(object));
      const data = {
        Bucket: bucket,
        Key: s3FilePath,
        Body: buffer,
        ContentEncoding: 'base64',
        ContentType: 'application/json',
      };

      const command = new PutObjectCommand(data);
      const response = await this.s3.send(command);
      return response;
    } catch (error) {
      throw new BadRequestException({ message: error.message, cause: error });
    }
  }

  /** S3 Object 조회 **/
  async getS3Object(data: any): Promise<any> {
    try {
      const input = {
        Bucket: data.Bucket,
        Key: data.Key,
      };
      const command = new GetObjectCommand(input);
      const response = await this.s3.send(command);
      return response;
    } catch (error) {
      throw new BadRequestException({ message: error.message, cause: error });
    }
  }

  /** S3 Object Head 조회 **/
  async getS3ObjectHead(data: any): Promise<any> {
    try {
      const input = {
        Bucket: data.Bucket,
        Key: data.Key,
      };
      const command = new HeadObjectCommand(input);
      const response = await this.s3.send(command);
      return response;
    } catch (error) {
      throw new BadRequestException('S3object not found');
    }
  }

  async getFileFromS3(data: any): Promise<any> {
    const input = {
      Bucket: data.Bucket,
      Key: data.Key,
    };
    const command = new GetObjectCommand(input);
    const result = await this.s3.send(command);
    return Buffer.from(await result.Body.transformToByteArray());
    // return await result.Body.transformToString('utf-8');
  }

  /** S3 Object 용량 계산 **/
  async fetchS3ObjectVolume(bucket: string, items: any[]): Promise<number> {
    const fetchPromises = items.map(async (item) => {
      const param = {
        Bucket: bucket,
        Key: item.key,
      };
      try {
        const dataResult = await this.getS3ObjectHead(param);
        return dataResult.ContentLength;
      } catch (error) {
        console.warn(error);
        return 0;
      }
    });

    const volumes = await Promise.all(fetchPromises);
    return volumes.reduce((sum, volume) => sum + Number(volume), 0);
  }
}
