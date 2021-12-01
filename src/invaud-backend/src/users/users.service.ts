import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ErrorType, InstanceType, Paginated, UserRole } from 'core';
import {
  getPasswordErrorMessage,
  validatePassword,
} from '../auth/validate-password';
import { DatabaseService } from '../database/database.service';
import { BusinessError } from '../errors/business.error';
import { UserEnriched } from '../models/request.models';
import { UserCreateRequestDto } from './dto/userCreateRequest.dto';
import { UserEditPasswordRequestDto } from './dto/userEditPasswordRequest.dto';
import { UserEditRequestDto } from './dto/userEditRequest.dto';
import { UserResponseDto } from './dto/userResponse.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    private prisma: DatabaseService,
    private configService: ConfigService,
  ) {}
  private instanceType: InstanceType;
  private readonly logger = new Logger(this.constructor.name);
  private readonly saltOrRounds = 10;
  private readonly genericUserSelect = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    role: true,
    locked: true,
    archived: false,
    failedLoginAttempts: false,
    passwordChangeRequired: false,
    createdAt: false,
    updatedAt: false,
    archivedAt: false,
    password: false,
  };

  async onModuleInit(): Promise<void> {
    const instanceTypeConfiguration = this.configService.get('INSTANCE_TYPE');
    this.logger.log('InstanceType is ' + instanceTypeConfiguration);
    if (
      !instanceTypeConfiguration ||
      !Object.values(InstanceType).includes(instanceTypeConfiguration)
    ) {
      throw new BusinessError(
        ErrorType.Conflict,
        'instance type not correctly set. Make sure it is set in the docker compose. Should be either shipper or forwarder. Currently:' +
          instanceTypeConfiguration,
      );
    }
    this.instanceType = instanceTypeConfiguration as InstanceType;

    const superAdminEmail = this.configService.get('SUPERADMIN_EMAIL');
    const superAdminHashedPassword = this.configService.get(
      'SUPERADMIN_HASHED_PASSWORD',
    );

    await this.createSuperAdminUser(superAdminEmail, superAdminHashedPassword);
  }

  async findAllUnarchived(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByInput | Prisma.UserOrderByInput[];
  }): Promise<Paginated<UserResponseDto>> {
    const { skip, take, cursor, where, orderBy } = params;
    const whereQuery = {
      ...where,
      archived: false,
      role: {
        not: UserRole.super_admin,
      },
    };

    const transactionData = await this.prisma.$transaction([
      this.prisma.user.count({ where: whereQuery }),
      this.prisma.user.findMany({
        skip,
        take,
        cursor,
        where: whereQuery,
        orderBy,
        select: this.genericUserSelect,
      }),
    ]);
    return {
      data: transactionData[1],
      numberOfRecords: transactionData[0],
    };
  }

  async findOneById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id },
    });
  }

  async findOneUnarchived(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email: email, archived: false },
    });
  }

  async findOneValid(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { email: email, locked: false, archived: false },
    });
  }

  async findOneValidById(userId: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { id: userId, locked: false, archived: false },
    });
  }

  async findOneSuperAdmin(): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: { role: UserRole.super_admin },
    });
  }

  async createUser(
    userToCreate: UserCreateRequestDto,
    requester: UserEnriched,
  ): Promise<UserResponseDto> {
    if (requester.passwordChangeRequired) {
      throw new BusinessError(
        ErrorType.Conflict,
        `Password of user needs to be changed`,
      );
    }
    if (userToCreate.role === UserRole.super_admin) {
      throw new BusinessError(
        ErrorType.Conflict,
        `Super admin cannot be created`,
      );
    }
    if (
      requester.role === UserRole.super_admin &&
      userToCreate.role !== UserRole.admin
    ) {
      throw new BusinessError(
        ErrorType.Conflict,
        `Super admin can only create admins`,
      );
    }
    const exist = await this.findOneUnarchived(userToCreate.email);
    if (exist)
      throw new BusinessError(
        ErrorType.Conflict,
        `User already exists with email ${userToCreate.email}`,
      );
    if (
      userToCreate.role != UserRole.admin &&
      userToCreate.role != this.instanceType
    ) {
      throw new BusinessError(
        ErrorType.Conflict,
        `${this.instanceType} instance type cannot create ${userToCreate.role} user role`,
      );
    }

    userToCreate.password = await bcrypt.hash(
      userToCreate.password,
      this.saltOrRounds,
    );
    return this.prisma.user.create({
      data: userToCreate,
      select: this.genericUserSelect,
    });
  }

  async editUser(
    userEditRequestDto: UserEditRequestDto,
  ): Promise<UserResponseDto> {
    const currentUser = await this.findOneValidById(userEditRequestDto.id);
    if (!currentUser) {
      throw new BusinessError(ErrorType.Conflict, 'User does not exist');
    }

    if (currentUser.role === UserRole.super_admin) {
      throw new BusinessError(
        ErrorType.Conflict,
        'Super admin cannot be edited',
      );
    }

    if (userEditRequestDto.email !== currentUser.email) {
      const existingUserWithNewEmail = await this.findOneUnarchived(
        userEditRequestDto.email,
      );

      if (existingUserWithNewEmail) {
        throw new BusinessError(
          ErrorType.Conflict,
          `User already exists with email ${userEditRequestDto.email}`,
        );
      }
    }

    if (currentUser.role !== userEditRequestDto.role) {
      throw new BusinessError(
        ErrorType.Conflict,
        'User role cannot be changed',
      );
    }

    return this.prisma.user.update({
      where: {
        id: userEditRequestDto.id,
      },
      data: {
        ...userEditRequestDto,
      },
      select: this.genericUserSelect,
    });
  }

  async editPassword(
    userEditPasswordRequestDto: UserEditPasswordRequestDto,
  ): Promise<UserResponseDto> {
    const currentUser = await this.findOneValidById(
      userEditPasswordRequestDto.id,
    );
    if (!currentUser) {
      throw new BusinessError(ErrorType.Conflict, 'User does not exist');
    }

    if (
      !validatePassword(userEditPasswordRequestDto.password, currentUser.role)
    ) {
      throw new BusinessError(
        ErrorType.Conflict,
        getPasswordErrorMessage(currentUser.role),
      );
    }

    const newPassword = await bcrypt.hash(
      userEditPasswordRequestDto.password,
      this.saltOrRounds,
    );

    return this.prisma.user.update({
      where: {
        id: userEditPasswordRequestDto.id,
      },
      data: {
        password: newPassword,
        passwordChangeRequired: false,
      },
      select: this.genericUserSelect,
    });
  }

  async archiveUser(id: string, requesterId: string): Promise<UserResponseDto> {
    if (requesterId === id) {
      throw new BusinessError(ErrorType.Conflict, 'User cannot delete itself');
    }

    const user = await this.findOneById(id);

    if (user?.role === UserRole.super_admin) {
      throw new BusinessError(
        ErrorType.Conflict,
        'Super admin cannot be archived',
      );
    }

    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        archived: true,
        archivedAt: new Date(),
      },
      select: this.genericUserSelect,
    });
  }

  async deleteUser(id: string): Promise<UserResponseDto> {
    const user = await this.findOneById(id);

    if (user?.role === UserRole.super_admin) {
      throw new BusinessError(
        ErrorType.Conflict,
        'Super admin cannot be deleted',
      );
    }

    return this.prisma.user.delete({
      where: {
        id,
      },
      select: this.genericUserSelect,
    });
  }

  async resetFailedLoginAttempts(user: User): Promise<UserResponseDto> {
    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        failedLoginAttempts: 0,
      },
      select: this.genericUserSelect,
    });
  }

  async handleFailedLoginAttempt(user: User): Promise<UserResponseDto> {
    let newLockedStatus = user.locked;
    let maxAllowedFailedLoginAttempts = 5;
    if (
      user.role === UserRole.shipper ||
      user.role === UserRole.forwarder ||
      user.role === UserRole.fba
    ) {
      maxAllowedFailedLoginAttempts = 10;
    }

    if (user.failedLoginAttempts >= maxAllowedFailedLoginAttempts - 1) {
      newLockedStatus = true;
    }

    if (user.role === UserRole.super_admin) {
      this.logger.log('Failed login attempt for super admin user detected');
      newLockedStatus = false;
    }

    return this.prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        failedLoginAttempts: {
          increment: 1,
        },
        locked: newLockedStatus,
      },
      select: this.genericUserSelect,
    });
  }

  async lockUser(id: string): Promise<UserResponseDto> {
    const user = await this.findOneById(id);

    if (user?.role === UserRole.super_admin) {
      throw new BusinessError(
        ErrorType.Conflict,
        'Super admin cannot be locked',
      );
    }
    return this.prisma.user.update({
      where: {
        id,
      },
      data: {
        locked: true,
      },
      select: this.genericUserSelect,
    });
  }

  private async createSuperAdminUser(email: string, hashedPassword: string) {
    const superAdminExists = await this.findOneSuperAdmin();

    if (superAdminExists) {
      this.logger.log(
        `Super admin is already present in the database (${superAdminExists.email})`,
      );
      return;
    }

    this.logger.log(`Creating super admin...`);

    if (!email || !hashedPassword) {
      const errorMessage =
        'SUPERADMIN_EMAIL and/or SUPERADMIN_HASHED_PASSWORD are undefined. No super admin can be created.';
      this.logger.error(errorMessage);
      throw Error(errorMessage);
    }

    const regularUserExists = await this.findOneUnarchived(email);

    if (regularUserExists) {
      const errorMessage = `User already exists with email ${email}. No super admin can be created.`;
      this.logger.error(errorMessage);
      throw Error(errorMessage);
    }

    try {
      await this.prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName: 'Super',
          lastName: 'Admin',
          role: UserRole.super_admin,
          passwordChangeRequired: true,
        },
      });
      this.logger.log(`Super admin was created (${email})`);
    } catch (e) {
      this.logger.error(
        `Super admin failed to create. No super admin present in database`,
      );
    }
  }
}
