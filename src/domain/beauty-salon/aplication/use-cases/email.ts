// email.service.ts

import { Injectable } from "@nestjs/common"
import * as nodemailer from "nodemailer"
import { SentMessageInfo } from "nodemailer/lib/smtp-transport"

@Injectable()
export class EmailUseCase {
  private transporter: nodemailer.Transporter<SentMessageInfo>

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "gregoryrag@gmail.com",
        pass: "K@daj4112",
      },
    })
  }

  async sendMagicLink(email: string, magicLink: string) {
    const mailOptions = {
      from: "seuemail@gmail.com",
      to: email,
      subject: "Magic Link para Login",
      text: `Use este link para fazer login: ${magicLink}`,
    }

    await this.transporter.sendMail(mailOptions)
  }
}
