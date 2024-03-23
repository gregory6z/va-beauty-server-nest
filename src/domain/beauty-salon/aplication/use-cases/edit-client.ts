import { ClientsRepository } from "@/domain/beauty-salon/repositories/client-repository"
import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { Client } from "../../enterprise/entities/client"

interface EditClientUseCaseRequest {
  clientId: string
  name?: string
  telephone?: string
  password?: string
  email?: string
}

type EditClientUseCaseResponse = Either<
  NotAllowedError,
  {
    client: Client
  }
>

@Injectable()
export class EditClientUseCase {
  constructor(private clientRepository: ClientsRepository) {}

  async execute(
    request: EditClientUseCaseRequest,
  ): Promise<EditClientUseCaseResponse> {
    const client = await this.clientRepository.findById(request.clientId)

    if (!client) {
      return left(new NotAllowedError())
    }

    Object.assign(client, request)

    console.log(client)

    await this.clientRepository.update(client)

    return right({
      client,
    })
  }
}
