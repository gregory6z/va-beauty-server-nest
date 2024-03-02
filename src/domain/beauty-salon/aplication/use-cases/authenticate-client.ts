import { Injectable } from "@nestjs/common"
import { Encrypter } from "../cryptography/encrypter"
import { WrongCredentialsError } from "./errors/wrong-credentials-error"
import { ClientsRepository } from "../../repositories/client-repository"
import { MagicLinkService } from "@/infra/email/magic-link.service"
import { Either, right } from "@/core/either"

interface AuthenticateClientUseCaseRequest {
  email: string
}

type AuthenticateClientUseCaseResponse = Either<
  WrongCredentialsError,
  {
    magicLink: string
  }
>

@Injectable()
export class AuthenticateClientUseCase {
  constructor(
    private clientsRepository: ClientsRepository,
    private encrypter: Encrypter,
    private magicLinkService: MagicLinkService,
  ) {}

  async execute({
    email,
  }: AuthenticateClientUseCaseRequest): Promise<AuthenticateClientUseCaseResponse> {
    // authenticate user
    let client = await this.clientsRepository.findByEmail(email)

    // If new client or existing client
    if (!client) {
      // Create new client
      await this.clientsRepository.create(email)
      client = await this.clientsRepository.findByEmail(email)
    }

    // Generate temporary token for identifying user
    const temporaryToken = await this.encrypter.encrypt({
      sub: client?.id.toString(),
      // Add any other necessary claims
    })

    // Generate magic link with the temporary token
    const magicLink = this.magicLinkService.generateMagicLink(temporaryToken)

    // Send Magic Link to user's email
    await this.magicLinkService.sendMagicLink(email, magicLink)

    // Return response with magic link sent
    return right({
      magicLink,
    })
  }
}
