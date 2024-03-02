import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { User as PrismaClient, Prisma } from "@prisma/client"

import { Client } from "@/domain/beauty-salon/enterprise/entities/client"

export class PrismaClientsMapper {
  static toDomain(raw: PrismaClient): Client {
    return Client.create(
      {
        email: raw.email,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(client: Client): Prisma.UserUncheckedCreateInput {
    return {
      id: client.id.toString(),
      email: client.email,

      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }
  }
}
