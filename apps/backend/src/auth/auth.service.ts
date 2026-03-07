import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { GoogleUser } from "@store/shared";
import { JwtPayload } from "./strategies/jwt.strategy";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async findOrCreateGoogleUser(googleUser: GoogleUser) {
    let user = await this.usersService.findByGoogleId(googleUser.googleId);

    if (!user) {
      user = await this.usersService.findByEmail(googleUser.email);
    }

    if (!user) {
      user = await this.usersService.createFromGoogle(googleUser);
    } else if (!user.googleId) {
      user = await this.usersService.linkGoogleId(user.id, googleUser.googleId);
    }

    return user;
  }

  generateJwt(userId: string, email: string, role: string): string {
    const payload: JwtPayload = { sub: userId, email, role };
    return this.jwtService.sign(payload);
  }
}
