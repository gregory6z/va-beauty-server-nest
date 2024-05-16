import { Either, right } from "@/core/either"
import { BadRequestException, Injectable } from "@nestjs/common"

import { ClientsRepository } from "@/domain/beauty-salon/repositories/client-repository"
import { Encrypter } from "../cryptography/encrypter"
import { HashGenerator } from "../cryptography/hash-generator"

interface ResetPasswordUseCaseRequest {
  token: string
  password: string
}

type ResetPasswordUseCaseResponse = Either<
  BadRequestException,
  { accessToken: string }
>

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private encrypter: Encrypter,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    password,
    token,
  }: ResetPasswordUseCaseRequest): Promise<ResetPasswordUseCaseResponse> {
    const payload = await this.encrypter.decrypt(token)

    const client = await this.clientsRepository.findById(payload.sub as string)
    if (!client) {
      throw new BadRequestException("Cliente não encontrado.")
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    client.password = hashedPassword

    await this.clientsRepository.update(client)

    const accessToken = await this.encrypter.encrypt({
      sub: client.id.toString(),
      email: client.email,
      name: client.name,
      telephone: client.telephone,
      customerId: client.customerId,
    })

    return right({
      accessToken,
    })
  }
}
