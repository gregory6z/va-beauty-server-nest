import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import {
  Service,
  ServiceProps,
} from "@/domain/beauty-salon/enterprise/entities/service"
import { PrismaServicesMapper } from "@/infra/database/prisma/mappers/prisma-services-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { faker } from "@faker-js/faker"
import { Injectable } from "@nestjs/common"

export function makeService(
  override: Partial<ServiceProps> = {},
  id?: UniqueEntityID,
) {
  const service = Service.create(
    {
      name: faker.person.fullName(),
      category: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      duration: 30,
      price: 20,
      stripeId: new UniqueEntityID().toString(),
      imgUrl: [faker.lorem.sentence()],
      ...override,
    },
    id,
  )

  return service
}

@Injectable()
export class ServiceFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaService(data: Partial<ServiceProps> = {}): Promise<Service> {
    const service = makeService(data)

    await this.prisma.service.create({
      data: PrismaServicesMapper.toPrisma(service),
    })

    return service
  }
}
