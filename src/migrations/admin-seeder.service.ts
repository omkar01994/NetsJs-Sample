import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AdminSeederService {
  private readonly logger = new Logger(AdminSeederService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async createAdmin() {
    // Check if admin exists
    const adminExists = await this.userModel.findOne({
      email: 'admin@gmail.com',
    });

    if (adminExists) {
      this.logger.log('Admin user already exists');
      return;
    }

    // Hash admin password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const admin = new this.userModel({
      email: 'admin@gmail.com',
      password: hashedPassword,
      firstName: 'admin',
      lastName: 'User',
      isActive: true,
      role: 'admin',
    });

    await admin.save();
    this.logger.log('Admin user created');
  }
}
