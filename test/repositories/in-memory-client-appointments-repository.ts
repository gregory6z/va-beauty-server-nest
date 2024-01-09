import { ServicesRepository } from "@/domain/beauty-salon/repositories/services-repository"
import { ClientAppointment } from "@/domain/beauty-salon/enterprise/entities/client-appointment"
import { ClientAppointmentsRepository } from "@/domain/beauty-salon/repositories/client-appointments-repository"
import { InMemoryClientsRepository } from "./in-memory-clients-repository"
import { InMemoryServiceRepository } from "./in-memory-services-repository"
import { Appointment } from "@/domain/beauty-salon/enterprise/entities/appointment"

export class InMemoryClientAppointmentsRepository
  implements ClientAppointmentsRepository
{
  public items: ClientAppointment[] = []

  constructor(
    private clientRepository: InMemoryClientsRepository,
    private ServicesRepository: InMemoryServiceRepository,
  ) {}

  async findManyByClientId(clientId: string): Promise<ClientAppointment[]> {
    const appointments = this.items.filter(
      (item) => item.id.toString() === clientId,
    )

    return appointments
  }

  async create(clientAppointment: ClientAppointment) {
    this.items.push(clientAppointment)

    // await this.questionAttachmentsRepository.createMany(
    //   question.attachments.getItems(),
    // )
  }

  // delete(clientAppointment: ClientAppointment): Promise<void> {
  //   throw new Error("Method not implemented.")
  // }
}
