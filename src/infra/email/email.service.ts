import { Injectable } from "@nestjs/common"
import * as nodemailer from "nodemailer"

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    // Configuração do Nodemailer para enviar e-mails
    this.transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: "f0bd2a8c8fd712",
        pass: "88afbf5911b470",
      },
    })
  }

  async sendEmail({
    to,
    subject,
    body,
  }: {
    to: string
    subject: string
    body: string
  }): Promise<void> {
    // Envie o e-mail
    await this.transporter.sendMail({
      from: "gregoryrag@gmail.com",
      to,
      subject,
      text: body,
    })
  }
}
