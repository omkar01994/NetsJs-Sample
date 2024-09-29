import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptor/response.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
/**
 * The url endpoint for open api ui
 * @type {string}
 */
export const SWAGGER_API_ROOT = 'api/docs';
/**
 * The name of the api
 * @type {string}
 */
export const SWAGGER_API_NAME = 'Nest-Js Sample API';
/**
 * A short description of the api
 * @type {string}
 */
export const SWAGGER_API_DESCRIPTION =
  'This is a sample API description for the Nest-JS module';
/**
 * Current version of the api
 * @type {string}
 */
export const SWAGGER_API_CURRENT_VERSION = '1.0';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.prettyPrint(),
            winston.format.colorize({ all: true }),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `${timestamp} [${context || 'Application'}] ${level}: ${message}`;
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'combined.log',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  });
  // Apply Response Interceptor globally
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle(SWAGGER_API_NAME)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_CURRENT_VERSION)
    .addBearerAuth() // Adding JWT Bearer authentication
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // API docs at /api

  await app.listen(3000);
}
bootstrap();
