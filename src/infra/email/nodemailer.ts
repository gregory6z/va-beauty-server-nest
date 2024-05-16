import { z } from "zod"
import { Injectable } from "@nestjs/common"

import * as nodemailer from "nodemailer"
import { EmailProvider } from "./email.provider"

const sendEmailSchema = z.object({
  to: z.string().email(),
  subject: z.string(),
  html: z.string(),
})

@Injectable()
export class NodemailerEmailProvider implements EmailProvider {
  private transporter: nodemailer.Transporter | undefined

  constructor() {
    nodemailer.createTestAccount((err, account) => {
      if (err) {
        console.error("Failed to create a test account", err)
        return
      }

      if (!account) {
        throw new Error("A conta não foi criada")
      }

      this.transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      })
    })
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
    const validatedInput = sendEmailSchema.parse({ to, subject, html })

    if (!this.transporter) {
      throw new Error("Transporter não está inicializado")
    }

    const info = await this.transporter.sendMail({
      from: '"Suporte" <suport@gregorypraxedes.com>',
      to: validatedInput.to,
      subject: validatedInput.subject,
      html: validatedInput.html,
    })

    console.log("Message sent: %s", info.messageId)
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))

    return info
  }
}
