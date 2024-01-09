import { Client } from "../enterprise/entities/client"

export abstract class ClientsRepository {
  abstract findById(id: string): Promise<Client | null>
  abstract create(client: Client): Promise<void>
}
