import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ParseTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Authorization: Bearer <token>
    req['token_secret'] = req.headers.authorization?.split(' ')[1];
    next();
  }
}
