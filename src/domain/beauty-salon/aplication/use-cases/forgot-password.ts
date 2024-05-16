import { Either, left, right } from "@/core/either"
import { ClientsRepository } from "../../repositories/client-repository"
import { BadRequestException, Injectable } from "@nestjs/common"
import { Encrypter } from "../cryptography/encrypter"
import { EnvService } from "@/infra/env/env.service"
import { EmailService } from "@/infra/email/emailService"

interface ForgotPasswordUseCaseRequest {
  email: string
}

type FetchClientUseCaseResponse = Either<
  BadRequestException,
  { message: string }
>

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private emailService: EmailService,

    private encrypter: Encrypter,
    private envService: EnvService,
  ) {}

  async execute({
    email,
  }: ForgotPasswordUseCaseRequest): Promise<FetchClientUseCaseResponse> {
    const url = this.envService.get("URL_FRONTEND")
    const client = await this.clientsRepository.findByEmail(email)

    if (!client) {
      return left(new BadRequestException())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: client.id.toString(),
      email: client.email,
      name: client.name,
      telephone: client.telephone,
      customerId: client.customerId,
    })

    const send = this.emailService.sendEmail({
      to: client.email,
      subject: "Reset your password",
      html: `<p>Click <a href="${url}/reset-password?token=${accessToken}">here</a> to reset your password</p>`,
    })

    console.log(send)

    return right({
      message: "email sent with success!",
    })
  }
}
