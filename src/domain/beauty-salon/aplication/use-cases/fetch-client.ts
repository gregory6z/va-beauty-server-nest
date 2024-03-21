import { Either, left, right } from "@/core/either"
import { Client } from "../../enterprise/entities/client"
import { ClientsRepository } from "../../repositories/client-repository"
import { Injectable } from "@nestjs/common"
import { FetchClientError as ExternalFetchClientError } from "./errors/client"

interface FetchClientUseCaseRequest {
  id: string
}

interface FetchClientError {
  message: string
}

type FetchClientUseCaseResponse = Either<FetchClientError, { client: Client }>

@Injectable()
export class FetchClientUseCase {
  constructor(private clientsRepository: ClientsRepository) {}

  async execute({
    id,
  }: FetchClientUseCaseRequest): Promise<FetchClientUseCaseResponse> {
    const client = await this.clientsRepository.findById(id)

    if (!client) {
      return left(new ExternalFetchClientError())
    }

    return right({
      client,
    })
  }
}
