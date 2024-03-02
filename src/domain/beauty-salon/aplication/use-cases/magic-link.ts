// auth.usecase.ts

import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { EmailUseCase } from "./email"

@Injectable()
export class AuthUseCase {
  constructor(
    private jwtService: JwtService,
    private emailUseCase: EmailUseCase,
  ) {}

  async sendMagicLink(email: string) {
    const magicLink = this.generateMagicLink(email)
    await this.emailUseCase.sendMagicLink(email, magicLink)
  }

  private generateMagicLink(email: string) {
    // Implemente a lógica para gerar um token JWT que contém o e-mail do usuário
    const payload = { email }
    return this.jwtService.sign(payload)
  }
}
