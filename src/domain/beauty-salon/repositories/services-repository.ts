import { Service } from "../enterprise/entities/service"

export abstract class ServicesRepository {
  abstract findByName(name: string): Promise<Service | null>
  abstract create(service: Service): Promise<void>

  abstract findManyByServiceId(services: string[]): Promise<Service[]>
  abstract findManyServices(): Promise<Service[]>
  abstract findManyServicesAndCalculateDuration(
    services: string[],
  ): Promise<number>
}
