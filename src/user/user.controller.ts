import { Controller, Get, UseGuards, SetMetadata } from '@nestjs/common';
import { RolesGuard } from '../common/guards/role-guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
@ApiTags('profile')
@ApiBearerAuth() // Protects all endpoints in this controller with JWT
@Controller('user')
@UseGuards(RolesGuard)
export class UserController {
  @Get('admin')
  @SetMetadata('roles', ['admin'])
  getAdminData() {
    return { message: 'Admin data' };
  }

  @Get('user')
  @SetMetadata('roles', ['user', 'admin'])
  getUserData() {
    return { message: 'User data' };
  }
}
