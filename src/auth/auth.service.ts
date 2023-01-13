import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as argon from "argon2";
import { SignUpDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { SignInDto } from "./dto/sign-in.dto";

@Injectable({})
export class AuthService {
  constructor(private prisma: PrismaService) {}

  async signUp(signUpRequest: SignUpDto) {
    // generate has for the password
    const hash = await argon.hash(signUpRequest.password);

    // create the user on DB
    try {
      const user = await this.prisma.user.create({
        data: {
          email: signUpRequest.email,
          hash,
        },
      });
      delete user.hash;
      return user;
    } catch (exception) {
      if (exception instanceof PrismaClientKnownRequestError) {
        switch (exception.code) {
          case "P2002":
            throw new ForbiddenException("Credential taken");
          default:
            throw exception;
        }
      }
    }
  }

  async signIn(signInRequest: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: signInRequest.email,
      },
    });

    if (!user) {
      throw new ForbiddenException("Credentials incorrect");
    }

    const passwordMatches = await argon.verify(user.hash, signInRequest.password);

    if (!passwordMatches) {
      throw new ForbiddenException("Credentials incorrect");
    }

    delete user.hash;
    return user;
  }
}
