import { UseCaseError } from "@/core/errors/use-case-error"

export class ClientAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`Le client "${identifier}" existe déjà.`)
  }
}

export class FetchClientError extends Error implements UseCaseError {
  constructor() {
    super(`client not exist`)
  }
}
