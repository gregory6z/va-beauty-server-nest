import { z } from "zod"
import { Resend } from "resend"

import { EnvService } from "../env/env.service"
import { EmailProvider } from "./email.provider"
import { Injectable } from "@nestjs/common"

const sendEmailSchema = z.object({
  to: z.array(z.string().email()),
  subject: z.string(),
  html: z.string(),
})

@Injectable()
export class ResendEmailProvider implements EmailProvider {
  private resend: Resend

  constructor(config: EnvService) {
    const resendKey = config.get("RESEND_KEY")

    this.resend = new Resend(resendKey)
  }

  async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string
    subject: string
    html: string
  }): Promise<any> {
    const validatedInput = sendEmailSchema.parse({ to: [to], subject, html })

    const { data, error } = await this.resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: validatedInput.to,
      subject: validatedInput.subject,
      html: validatedInput.html,
    })

    if (error) {
      throw new Error(`Failed to send email: ${error.message}`)
    }

    return data
  }
}
