import * as fs from 'fs';
import moment from 'moment-timezone';
import convert from 'heic-convert';

/** 폴더 생성 **/
export function makeFolder(dir: string): void {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
}

/** 폴더 하위 순회 및 파일 삭제 **/
export function deleteFolderRecursive(path: string) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      const curPath = path + '/' + file;

      if (fs.lstatSync(curPath).isDirectory()) {
        this.deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
}

function renameFile(oldPath, newPath) {
  return new Promise((resolve, reject) => {
    fs.rename(oldPath, newPath, (err) => {
      if (err) {
        reject(`Error renaming file: ${err.message}`);
      } else {
        resolve('File renamed successfully.');
      }
    });
  });
}

/** 현재 날짜 추출 (ex: 2023-08-24) **/
export function getDateKo(date?: Date) {
  if (!date) date = new Date();
  return moment(date).tz('Asia/Seoul').format('YYYY-MM-DD');
}

/** 파일 삭제 **/
export function deleteFile(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(`삭제 실패: ${filePath}`);
  }
}

/** 여러개 파일 삭제 **/
export function deleteFiles(filePaths) {
  for (const filePath of filePaths) {
    deleteFile(filePath);
  }
}

/** Heic 확장자 이미지를 JPEG 포멧으로 변경 및 output 경로에 저장 **/
export async function convertHeicToJpg(inputFilePath: string, outputFilePath: string) {
  const inputBuffer = fs.readFileSync(inputFilePath);
  const buffer = await convert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 1,
  });

  if (inputFilePath === outputFilePath) {
    fs.writeFileSync(`${outputFilePath}.tmp`, Buffer.from(buffer));
  } else {
    fs.writeFileSync(outputFilePath, Buffer.from(buffer));
  }
}

/** 문자열 형식에서 숫자 형식으로 변환하고, 천단위 쉼표를 만들어주는 함수. **/
export const toNumber = function (number) {
  if (number === undefined || number === '' || isNaN(number)) number = 0;
  number += '';
  number = number.replace(/,/g, '');
  const nArr = String(number).split('').join(',').split('');
  for (let i = nArr.length - 1, j = 1; i >= 0; i--, j++) {
    if (j % 6 !== 0 && j % 2 === 0) nArr[i] = '';
  }
  return nArr.join('');
};

/** 오늘의 날짜를 객체로 출력 **/
export const getToday = function () {
  const date: Date = new Date();
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
};

/** 월(m)과 연도(y)를 기반으로 해당 월의 일수(날짜 수)를 계산하는 함수 **/
export const getDaysInMonth = (m, y) =>
  m === 2 ? (y & 3 || (!(y % 25) && y & 15) ? 28 : 29) : 30 + ((m + (m >> 3)) & 1);

/** {1: 0, 2: 0, 3: 0} 형태의 로그를 만들어주는 함수  **/
export const getLogObject = (lastIndex) => {
  const logCount = {};
  for (let i = 1; i <= lastIndex; i++) {
    logCount[i.toString()] = 0;
  }
  return logCount;
};

export const copyWithoutNullOrUndefined = (obj) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (obj[key] !== undefined && obj[key] !== null) {
      acc[key] = obj[key];
    }
    return acc;
  }, {});
};

/** file 이름의 확장자를 변경하는 함수 **/
export function changeFileNameExt(filename: string, ext: string) {
  const fileNameSplit = filename.split('.'); // multer가 생성한 파일 name split

  let result = '';
  for (let i = 0, len = fileNameSplit.length; i < len; i++) {
    if (i === len - 1) {
      result += `.${ext}`;
      continue;
    }
    if (i === 0) {
      result += fileNameSplit[i];
      continue;
    }
    result = result + '.' + fileNameSplit[i];
  }

  return result;
}

/** file 이름의 확장자가 이미지 형식일 경우 확장자 제거 **/
export function removeImageExtFromFilename(filename: string) {
  const filenameSplit = filename.split('.'); // 원본 파일 이름

  let result = '';
  for (let i = 0, len = filenameSplit.length; i < len; i++) {
    const fileExtension = filenameSplit[filenameSplit.length - 1];
    const imageExtensions = ['gif', 'jpg', 'jpeg', 'png', 'tif', 'webp', 'heic'];
    if (i === len - 1 && imageExtensions.includes(fileExtension.toLowerCase())) {
      break;
    }
    if (i === 0) {
      result += filenameSplit[i];
      continue;
    }
    result = result + '.' + filenameSplit[i];
  }

  return result;
}
