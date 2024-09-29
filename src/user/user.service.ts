import { Get, Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getProfile() {
    return { message: 'This is a protected route' };
  }
}
