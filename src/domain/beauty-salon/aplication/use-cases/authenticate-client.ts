import { Either, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { Encrypter } from "../cryptography/encrypter"
import { WrongCredentialsError } from "./errors/wrong-credentials-error"
import { ClientsRepository } from "../../repositories/client-repository"

interface AuthenticateClientUseCaseRequest {
  email: string
}

type AuthenticateClientUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string
  }
>

@Injectable()
export class AuthenticateClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private encrypter: Encrypter,
  ) {}

  async execute({
    email,
  }: AuthenticateClientUseCaseRequest): Promise<AuthenticateClientUseCaseResponse> {
    const client = await this.clientsRepository.findByEmail(email)

    const accessToken = await this.encrypter.encrypt({
      sub: "ola",
    })

    return right({
      accessToken,
    })
  }
}
