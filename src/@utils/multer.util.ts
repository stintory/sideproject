import * as multer from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { FileFilterCallback } from 'multer';
import { v4 } from 'uuid';
import { Request } from 'express';
import * as fs from 'fs';

// /** Multer 스토리지 설정 **/
const diskStorage: multer.StorageEngine = multer.diskStorage({
  // 파일 업로드 폴더
  destination(req, file, cb) {
    const uploadDir = '_upload';

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, '_upload');
  },

  // 파일 이름 규칙
  filename(req, file, cb) {
    const hash = v4().replace(/-/g, '').slice(0, 24);
    const fileName = `${Date.now()}_${hash}_${file.originalname}`;
    cb(null, fileName);
  },
});
//
const storage = multer.memoryStorage();

export const postMulterOptions: MulterOptions = {
  storage: diskStorage,
  limits: { fileSize: 1024 * 1024 * 1000 },
};

export const petMulterOptions: MulterOptions = {
  storage: diskStorage,
};

export const imageMulterOptions: MulterOptions = {
  storage: diskStorage,
  limits: { fileSize: 1024 * 1024 * 1000 },
};

export const diaryMulterOptions: MulterOptions = {
  storage: diskStorage,
  limits: { fileSize: 1024 * 1024 * 1000 },
};

export const glbMulterOptions: MulterOptions = {
  storage: diskStorage,
};
