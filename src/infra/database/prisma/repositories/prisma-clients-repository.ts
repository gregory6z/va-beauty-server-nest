import { PrismaService } from "../prisma.service"
import { Injectable } from "@nestjs/common"
import { Client } from "@/domain/beauty-salon/enterprise/entities/client"

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
      include: {
        appointments: true,
      },
    })

    if (!client) {
      return null
    }

    return PrismaClientsMapper.toDomain(client)
  }

  async findById(id: string): Promise<Client | null> {
    const client = await this.prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        appointments: true,
      },
    })

    if (!client) {
      return null
    }

    return PrismaClientsMapper.toDomain(client)
  }

  async create(client: Client): Promise<void> {
    const data = PrismaClientsMapper.toPrisma(client)
    await this.prisma.user.create({
      data,
    })
  }
}
