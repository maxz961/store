import {
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Response, Request } from "express";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";
import { GetUser } from "./decorators/get-user.decorator";
import type { User } from "@store/shared";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Get("google")
  @UseGuards(AuthGuard("google"))
  googleAuth() {
    // Passport redirects to Google — no body needed
  }

  @Get("google/callback")
  @UseGuards(AuthGuard("google"))
  async googleCallback(@Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const token = this.authService.generateJwt(user.id, user.email, user.role);

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("access_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    const frontendUrl =
      this.configService.get("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000";
    res.redirect(frontendUrl);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get("logout")
  @UseGuards(JwtAuthGuard)
  logout(@Res() res: Response) {
    const isProduction = process.env.NODE_ENV === "production";
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
    });
    const frontendUrl =
      this.configService.get("NEXT_PUBLIC_APP_URL") ?? "http://localhost:3000";
    res.redirect(frontendUrl);
  }
}
