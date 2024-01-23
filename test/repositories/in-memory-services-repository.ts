import { Service } from "@/domain/beauty-salon/enterprise/entities/service"
import { ServicesRepository } from "@/domain/beauty-salon/repositories/services-repository"

export class InMemoryServiceRepository implements ServicesRepository {
  public items: Service[] = []

  async findManyServicesAndCalculateDuration(
    servicesIds: string[],
  ): Promise<number> {
    const matchingServices = this.items.filter((service) =>
      servicesIds.includes(service.id.toString()),
    )

    const totalDuration = matchingServices.reduce((sum, service) => {
      return sum + service.duration
    }, 0)

    return totalDuration
  }

  async findManyServices(): Promise<Service[]> {
    return this.items
  }

  async findManyByServiceId(servicesIds: string[]): Promise<string[]> {
    // this.items.map((service) => service.id.toString())

    const matchingIds = servicesIds.filter((id) =>
      this.items.some((service) => id === service.id.toString()),
    )

    return matchingIds
  }

  async findByName(name: string) {
    const service = this.items.find((item) => item.name === name)

    if (!service) {
      return null
    }

    return service
  }

  async create(service: Service) {
    this.items.push(service)
  }
}
