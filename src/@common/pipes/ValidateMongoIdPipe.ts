import { ArgumentMetadata, BadRequestException, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

/** MongoDB ID 타입 검출을 위한 커스텀 validation pipe **/
export class ValidateMongoIdPipe implements PipeTransform<string> {
  transform(value: string, metadata: ArgumentMetadata) {
    if (!value) return value;
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(`${metadata.data} must be a valid MongoDB ObjectId`);
    }
    return value;
  }
}
