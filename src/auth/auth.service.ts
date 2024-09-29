import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';

import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import ResponseMessage from 'src/common/enums/ResponseMessages';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, password } = createUserDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new this.userModel({ email, password: hashedPassword });
      return user.save();
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const { email, password } = loginUserDto;
    const user = await this.userModel.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload = { email: user.email, sub: user._id };
      return {
        token: this.jwtService.sign(payload),
      };
    } else {
      throw new Error(ResponseMessage.INVALID_CREDENTIALS);
    }
  }
}
