import { Module } from "@nestjs/common"
import { EnvService } from "../env/env.service"
import { ResendEmailProvider } from "./resend"
import { NodemailerEmailProvider } from "./nodemailer"
import { EmailService } from "./emailService"

@Module({
  providers: [
    {
      provide: "EmailProvider",
      useFactory: (config: EnvService) => {
        if (config.get("NODE_ENV") === "production") {
          return new ResendEmailProvider(config)
        } else {
          return new NodemailerEmailProvider()
        }
      },
      inject: [EnvService],
    },
    EnvService,
    EmailService,
  ],
  exports: ["EmailProvider"],
})
export class EmailModule {}
