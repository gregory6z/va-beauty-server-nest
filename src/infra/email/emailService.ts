import { Injectable, Inject } from "@nestjs/common"
import { EmailProvider } from "./email.provider"

@Injectable()
export class EmailService implements EmailProvider {
  constructor(@Inject("EmailProvider") private emailProvider: EmailProvider) {}

  async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string
    subject: string
    html: string
  }): Promise<any> {
    return this.emailProvider.sendEmail({ to, subject, html })
  }
}
