import { ServicesRepository } from "@/domain/beauty-salon/repositories/services-repository"
import { PrismaService } from "../prisma.service"
import { Service } from "@/domain/beauty-salon/enterprise/entities/service"
import { Injectable } from "@nestjs/common"
import { PrismaServicesMapper } from "../mappers/prisma-services-mapper"
import { DomainEvents } from "@/core/events/domain-events"

@Injectable()
export class PrismaServicesRepository implements ServicesRepository {
  constructor(private prisma: PrismaService) {}

  async findByName(name: string): Promise<Service | null> {
    const service = await this.prisma.service.findUnique({
      where: {
        name,
      },
    })

    if (!service) {
      return null
    }

    return PrismaServicesMapper.toDomain(service)
  }

  async create(service: Service): Promise<void> {
    const data = PrismaServicesMapper.toPrisma(service)
    await this.prisma.service.create({
      data,
    })

    DomainEvents.dispatchEventsForAggregate(service.id)
  }

  async findManyByServiceId(servicesIds: string[]): Promise<Service[]> {
    const matchingServices = await this.prisma.service.findMany({
      where: {
        stripeId: {
          in: servicesIds,
        },
      },
    })

    return matchingServices.map(PrismaServicesMapper.toDomain)
  }

  async findManyServices(): Promise<Service[]> {
    const services = await this.prisma.service.findMany()

    return services.map(PrismaServicesMapper.toDomain)
  }

  async findManyServicesAndCalculateDuration(
    servicesIds: string[],
  ): Promise<number> {
    const matchingServices = await this.prisma.service.findMany({
      where: {
        stripeId: { in: servicesIds },
      },
    })

    const totalDuration = matchingServices.reduce(
      (sum, service) => sum + service.duration,
      0,
    )

    return totalDuration
  }
}
