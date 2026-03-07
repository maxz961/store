import { Injectable, NotFoundException } from "@nestjs/common";
import { db, GoogleUser } from "@store/shared";

@Injectable()
export class UsersService {
  async findById(id: string) {
    return db.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  }

  async findByGoogleId(googleId: string) {
    return db.user.findUnique({ where: { googleId } });
  }

  async createFromGoogle(googleUser: GoogleUser) {
    return db.user.create({
      data: {
        email: googleUser.email,
        name: googleUser.name,
        image: googleUser.image,
        googleId: googleUser.googleId,
      },
    });
  }

  async linkGoogleId(userId: string, googleId: string) {
    return db.user.update({
      where: { id: userId },
      data: { googleId },
    });
  }

  async findAll() {
    return db.user.findMany({ orderBy: { createdAt: "desc" } });
  }

  async findOrThrow(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }
}
