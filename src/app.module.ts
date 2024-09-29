import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { LoggerModule } from './logger/logger.module';
import { AdminSeederService } from './migrations/admin-seeder.service';
import { User, UserSchema } from './schemas/user.schema';
@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB_URL'),
      }),
    }),
    AuthModule,
    LoggerModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService, AdminSeederService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly adminSeederService: AdminSeederService) {}

  // Automatically create the admin on app startup
  async onModuleInit() {
    await this.adminSeederService.createAdmin();
  }
}
