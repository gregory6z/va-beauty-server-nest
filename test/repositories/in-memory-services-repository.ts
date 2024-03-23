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

  // async findManyServicesAndCalculateDuration(
  //   servicesIds: string[],
  // ): Promise<{ totalSubscriptionDuration: number, totalNormalServiceDuration: number }> {
  //   const matchingServices = this.items.filter((service) =>
  //     servicesIds.includes(service.id.toString()),
  //   )

  //   let totalSubscriptionDuration = 0;
  //   let totalNormalServiceDuration = 0;

  //   for (const service of matchingServices) {
  //     if (service.isSubscription) {
  //       // Se o serviço for uma inscrição, adicione a duração à duração total de inscrições
  //       totalSubscriptionDuration += service.duration;
  //     } else {
  //       // Se o serviço for um serviço normal, adicione a duração à duração total de serviços normais
  //       totalNormalServiceDuration += service.duration;
  //     }
  //   }

  //   return { totalSubscriptionDuration, totalNormalServiceDuration };
  // }

  async findManyServices(): Promise<Service[]> {
    return this.items
  }

  async findManyByServiceId(servicesIds: string[]): Promise<Service[]> {
    const matchingServices = this.items.filter((service) =>
      servicesIds.includes(service.id.toString()),
    )

    return matchingServices
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
