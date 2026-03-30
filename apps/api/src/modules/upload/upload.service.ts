import { PrismaService } from '@message-management/db';
import { Injectable } from '@nestjs/common';
import { createWriteStream } from 'fs';
import { mkdir } from 'fs/promises';
import { extname, join } from 'path';
import type { Readable } from 'stream';
import { pipeline } from 'stream/promises';

@Injectable()
export class UploadService {
  constructor(private readonly prismaService: PrismaService) {}

  handleUpload(file: Express.Multer.File) {
    const host = process.env['VITE_API_BASE_URL'];
    return {
      originalName: file.originalname,
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
      url: `${host}/upload/${file.filename}`,
    };
  }

  async saveFileFromStream(stream: Readable, originalName: string) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(originalName);
    const filename = `${uniqueSuffix}${ext}`;
    const dir = join(process.cwd(), 'apps', 'api', 'files');
    const filePath = join(dir, filename);

    await mkdir(dir, { recursive: true });

    const writeStream = createWriteStream(filePath);

    await pipeline(stream, writeStream);

    const host = process.env['VITE_API_BASE_URL'];
    return `${host}/upload/${filename}`;
  }
}
