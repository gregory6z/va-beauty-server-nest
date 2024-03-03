import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { User as PrismaClient, Prisma } from "@prisma/client"

import { Client } from "@/domain/beauty-salon/enterprise/entities/client"

export class PrismaClientsMapper {
  static toDomain(raw: PrismaClient): Client {
    return Client.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
        telephone: raw.telephone,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(client: Client): Prisma.UserUncheckedCreateInput {
    return {
      id: client.id.toString(),
      name: client.name,
      telephone: client.telephone,
      email: client.email,
      password: client.password,
    }
  }
}
