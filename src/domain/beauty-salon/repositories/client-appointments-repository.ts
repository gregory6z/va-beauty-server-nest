import { ClientAppointment } from "../enterprise/entities/client-appointment"

export abstract class ClientAppointmentsRepository {
  abstract findManyByClientId(clientId: string): Promise<ClientAppointment[]>

  abstract create(clientAppointment: ClientAppointment): Promise<void>
}
