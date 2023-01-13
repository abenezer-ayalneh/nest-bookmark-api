import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { JwtGuard } from 'src/auth/guards';

@Controller('users')
export class UserController {
    @UseGuards(JwtGuard)
    @Get('me')
    me(@Req() request: Request) {
        return request.user;
    }
}
