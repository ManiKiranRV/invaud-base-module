import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { Paginated } from 'core';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { ErrorFilter } from '../errors/error.filter';
import { UserRequest } from '../models/request.models';
import { UserCreateRequestDto } from './dto/userCreateRequest.dto';
import { UserEditPasswordRequestDto } from './dto/userEditPasswordRequest.dto';
import { UserEditRequestDto } from './dto/userEditRequest.dto';
import { UserQueryRequestDto } from './dto/userQueryRequest.dto';
import { UserResponseDto } from './dto/userResponse.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@UseFilters(new ErrorFilter())
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiQuery({ name: 'skip', required: false })
  @ApiQuery({ name: 'take', required: false })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(200)
  @Post()
  async getUsers(
    @Body() query?: UserQueryRequestDto,
    @Query('skip') from?: string,
    @Query('take') to?: string,
  ): Promise<Paginated<UserResponseDto>> {
    const skip = from ? Number(from) : 0;
    const take = to ? Number(to) : 10;
    return this.usersService.findAllUnarchived({
      skip,
      take,
      orderBy: query?.sortParams,
      where: query?.searchParams,
    });
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Post('register')
  async registerUser(
    @Body() userCreateRequestDto: UserCreateRequestDto,
    @Request() req: UserRequest,
  ): Promise<UserResponseDto> {
    return this.usersService.createUser(userCreateRequestDto, req.user);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put()
  async editUser(
    @Body() userEditRequestDto: UserEditRequestDto,
  ): Promise<UserResponseDto> {
    return this.usersService.editUser(userEditRequestDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @Put('password')
  async editPassword(
    @Body() userEditPasswordRequestDto: UserEditPasswordRequestDto,
  ): Promise<UserResponseDto> {
    return this.usersService.editPassword(userEditPasswordRequestDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete('/:id')
  async archiveUser(
    @Param('id') id: string,
    @Request() req: UserRequest,
  ): Promise<UserResponseDto> {
    return this.usersService.archiveUser(id, req.user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('shipper', 'forwarder', 'admin', 'super_admin')
  @Get('current')
  getCurrentUser(@Request() req: UserRequest): UserResponseDto {
    const { passwordChangeRequired, ...rest } = req.user;
    return rest;
  }
}
