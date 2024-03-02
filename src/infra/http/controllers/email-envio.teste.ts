// meu-controller.ts
import { EmailService } from "@/infra/email/email.service"
import { Controller, Get } from "@nestjs/common"

@Controller()
export class MeuController {
  constructor(private readonly emailService: EmailService) {}

  @Get("enviar-email")
  async enviarEmailTeste(): Promise<string> {
    try {
      await this.emailService.sendEmail({
        to: "gregorypraxedes@gmail.com",
        subject: "Teste de e-mail",
        body: "Este é um e-mail de teste enviado pelo NestJS.",
      })
      return "E-mail enviado com sucesso!"
    } catch (error) {
      console.error("Erro ao enviar e-mail:", error)
      return "Erro ao enviar e-mail. Verifique o console para mais detalhes."
    }
  }
}
