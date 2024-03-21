import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Client } from "@/domain/beauty-salon/enterprise/entities/client"
import { ClientsRepository } from "@/domain/beauty-salon/repositories/client-repository"

export class InMemoryClientsRepository implements ClientsRepository {
  public clients: Client[] = []

  async findById(id: string): Promise<Client | null> {
    const client = this.clients.find(
      (client) => client.id === new UniqueEntityID(id),
    )

    if (!client) {
      return null
    }

    return client
  }

  async findByEmail(email: string) {
    const client = this.clients.find((client) => client.email === email)

    if (!client) {
      return null
    }

    return client
  }

  async create(client: Client) {
    this.clients.push(client)
  }
}
