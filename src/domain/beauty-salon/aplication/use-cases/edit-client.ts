import { ClientsRepository } from "@/domain/beauty-salon/repositories/client-repository"
import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { Encrypter } from "../cryptography/encrypter"
import { HashGenerator } from "../cryptography/hash-generator"

interface EditClientUseCaseRequest {
  clientId: string
  name?: string
  telephone?: string
  password?: string
  email?: string
  customerId?: string
}

type EditClientUseCaseResponse = Either<
  NotAllowedError,
  {
    accessToken: string
  }
>

@Injectable()
export class EditClientUseCase {
  constructor(
    private clientRepository: ClientsRepository,
    private encrypter: Encrypter,
    private hashGenerator: HashGenerator,
  ) {}

  async execute(
    request: EditClientUseCaseRequest,
  ): Promise<EditClientUseCaseResponse> {
    const client = await this.clientRepository.findById(request.clientId)

    if (!client) {
      return left(new NotAllowedError())
    }

    if (request.password) {
      const hashedPassword = await this.hashGenerator.hash(request.password)
      request.password = hashedPassword
    }

    if (request.email) {
      client.email = request.email
    }

    if (request.name) {
      client.name = request.name
    }

    if (request.telephone) {
      client.telephone = request.telephone
    }

    if (request.customerId) {
      client.customerId = request.customerId
    }

    await this.clientRepository.update(client)

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
