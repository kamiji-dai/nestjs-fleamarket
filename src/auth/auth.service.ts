import { Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { CredentialsDto } from './dto/credentials.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from 'src/types/jwtPayload';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { name, email, password, status } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prismaService.user.create({
      data: { name, email, password: hashedPassword, status },
    });
  }

  async signIn(credentialsDto: CredentialsDto): Promise<{ token: string }> {
    const { email, password } = credentialsDto;
    const user = await this.prismaService.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = {
        sub: user.id,
        username: user.name,
        status: user.status,
      };
      const token = this.jwtService.sign(payload);
      return { token };
    }

    throw new UnauthorizedException();
  }
}
