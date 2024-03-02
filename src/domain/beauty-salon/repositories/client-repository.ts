import { Client } from "../enterprise/entities/client"

export abstract class ClientsRepository {
  abstract findByEmail(email: string): Promise<Client | null>
  abstract create(email: string): Promise<void>
}
