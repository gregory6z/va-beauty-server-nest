import { ClientsRepository } from "@/domain/beauty-salon/repositories/client-repository"
import { Either, left } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { Client } from "../../enterprise/entities/client"

interface EditClientUseCaseRequest {
  clientId: string
  name: string
  telephone: string
  password: string
  email: string
}

type EditClientUseCaseResponse = Either<NotAllowedError, void>

@Injectable()
export class EditClientUseCase {
  constructor(private clientRepository: ClientsRepository) {}

  async execute({
    clientId,
    name,
    telephone,
    password,
    email,
  }: EditClientUseCaseRequest): Promise<EditClientUseCaseResponse | void> {
    const client = await this.clientRepository.findById(clientId)

    if (!client) {
      console.log("Client not found")
      return
    }

    client.name = name
    client.telephone = telephone
    client.password = password
    client.email = email

    console.log(client)

    await this.clientRepository.update(client)
  }
}
