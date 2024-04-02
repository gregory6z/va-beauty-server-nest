import { Client } from "../enterprise/entities/client"

export interface EditClientProps {
  clientId: string
  name?: string
  email?: string
  telephone?: string
  password?: string
  customerId?: string
}

export abstract class ClientsRepository {
  abstract update(client: Client): Promise<void>

  abstract findByEmail(email: string): Promise<Client | null>
  abstract findById(id: string): Promise<Client | null>
  abstract create(client: Client): Promise<void>
}
