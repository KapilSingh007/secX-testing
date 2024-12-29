import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('LoggerMiddleware');
  private readonly maxBodySize = 1024 * 1024; // 1MB
  private readonly excludedRoutes = [
    // /^\/health-check$/, // Exact match
  ];

  use(req: Request, res: Response, next: NextFunction) {
    const clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Generate a unique identifier for the request
    const requestId = uuidv4();
    res.setHeader('X-Request-ID', requestId);

    // Check if the current request's URL matches any excluded patterns
    if (!this.shouldLog(req.originalUrl)) {
      return next();
    }

    this.logger.log(`Request received: ${req.originalUrl}`, {
      requestId, // Include the unique request identifier in the log
      ip: clientIp, // Log IP address with request details
      headers: req.headers,
      body: this.filterLargeContent(req.body),
    });

    this.setupResponseLogging(res, requestId);
    next();
  }

  private shouldLog(url: string): boolean {
    // Check if URL matches any of the excluded route patterns
    return !this.excludedRoutes.some((pattern) => pattern.test(url));
  }
  private filterLargeContent(content: any): string | object {
    console.log(content)
    const contentString = JSON.stringify(content);
    const contentLength = Buffer.byteLength(contentString, 'utf8');
    if (contentLength > this.maxBodySize) {
      return `Content too large to log: ${contentLength} bytes`;
    }
    return contentString; // Log as string to prevent JSON format issues in the logger
  }

  private setupResponseLogging(res: Response, requestId: string) {
    const originalWrite = res.write;
    const originalEnd = res.end;
    let responseChunks = [];

    res.write = (chunk, encoding?, callback?) => {
      if (responseChunks.length < this.maxBodySize) {
        responseChunks.push(Buffer.from(chunk));
      }
      return originalWrite.call(res, chunk, encoding, callback);
    };

    res.end = (chunk?, encoding?, callback?) => {
      if (chunk) {
        responseChunks.push(Buffer.from(chunk));
      }

      const bodySize = Buffer.concat(responseChunks).length;
      if (bodySize > this.maxBodySize) {
        this.logger.log(`Response being sent: Content too large to log: ${bodySize} bytes`, {
          requestId, // Include the unique request identifier in the log
          statusCode: res.statusCode,
        });
      } else {
        const body = Buffer.concat(responseChunks).toString('utf8');
        this.logger.log(`Response being sent:`, {
          requestId, // Include the unique request identifier in the log
          statusCode: res.statusCode,
          body: body,
        });
      }

      responseChunks = []; // Clear the buffer to prevent memory leak
      return originalEnd.call(res, chunk, encoding, callback);
    };
  }
}
