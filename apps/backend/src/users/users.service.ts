import { Injectable, ForbiddenException, NotFoundException } from "@nestjs/common";
import { db, GoogleUser, Role } from "@store/shared";

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

  async findAll(skip = 0, take = 20) {
    return db.user.findMany({ orderBy: { createdAt: "desc" }, skip, take });
  }

  async findOrThrow(id: string) {
    const user = await this.findById(id);
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async updateRole(id: string, role: Role, currentUserId: string) {
    if (id === currentUserId) {
      throw new ForbiddenException('Cannot change your own role');
    }
    await this.findOrThrow(id);
    return db.user.update({ where: { id }, data: { role } });
  }

  async setBanned(id: string, isBanned: boolean, currentUserId: string) {
    if (id === currentUserId) {
      throw new ForbiddenException('Cannot ban yourself');
    }
    const user = await this.findOrThrow(id);
    if (user.role === Role.ADMIN) {
      throw new ForbiddenException('Cannot ban an admin');
    }
    return db.user.update({ where: { id }, data: { isBanned } });
  }
}
