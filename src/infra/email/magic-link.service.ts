import { Injectable } from "@nestjs/common"
import { EmailService } from "./email.service"

@Injectable()
export class MagicLinkService {
  constructor(private readonly emailService: EmailService) {}

  async sendMagicLink(email: string, magicLink: string): Promise<void> {
    // Envie o link mágico por e-mail
    await this.emailService.sendEmail({
      to: email,
      subject: "Link Mágico de Autenticação",
      body: `Clique no seguinte link para fazer login: ${magicLink}`,
    })
  }

  generateMagicLink(temporaryToken: string): string {
    // Gere um link mágico exclusivo com o token temporário incluso
    const magicLink = `http://localhost:3333/auth/magiclink?token=${temporaryToken}`
    return magicLink
  }
}
