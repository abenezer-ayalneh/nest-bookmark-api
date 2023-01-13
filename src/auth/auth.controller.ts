import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignUpDto } from "./dto";
import { SignInDto } from "./dto/sign-in.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("signup")
  async signUp(@Body() signUpRequest: SignUpDto) {
    return this.authService.signUp(signUpRequest);
  }

  @Post("signin")
  signIn(@Body() signInRequest: SignInDto) {
    return this.authService.signIn(signInRequest);
  }
}
