import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Controller('users')
export class UsersController {
  constructor(private prisma: PrismaService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  profile(@Req() req: { user: { id: number } }) {
    return this.prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true },
    });
  }
}
