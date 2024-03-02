import { PrismaService } from "../prisma.service"
import { Injectable } from "@nestjs/common"
import { Client } from "@/domain/beauty-salon/enterprise/entities/client"

import { DomainEvents } from "@/core/events/domain-events"
import { ClientsRepository } from "@/domain/beauty-salon/repositories/client-repository"
import { PrismaClientsMapper } from "../mappers/prisma-client-mapper"

@Injectable()
export class PrismaClientsRepository implements ClientsRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string): Promise<Client | null> {
    const client = await this.prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!client) {
      return null
    }
    console.log(client)

    return PrismaClientsMapper.toDomain(client)
  }

  async create(user: Client): Promise<void> {
    const data = PrismaClientsMapper.toPrisma(user)
    await this.prisma.user.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(user.id)
  }
}
