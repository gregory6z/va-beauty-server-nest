import { Client } from "@/domain/beauty-salon/enterprise/entities/client"
import { ClientsRepository } from "@/domain/beauty-salon/repositories/client-repository"

export class InMemoryClientsRepository implements ClientsRepository {
  public items: Client[] = []

  async update(client: Client): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.id === client.id)

    if (itemIndex === -1) {
      return
    }

    this.items[itemIndex] = client
  }

  async findById(id: string): Promise<Client | null> {
    const client = this.items.find((client) => client.id.toString() === id)
    if (!client) {
      return null
    }

    return client
  }

  async findByEmail(email: string) {
    const client = this.items.find((client) => client.email === email)

    if (!client) {
      return null
    }

    return client
  }

  async create(client: Client) {
    this.items.push(client)
  }
}
