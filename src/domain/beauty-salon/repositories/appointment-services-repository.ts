import { AppointmentService } from "../enterprise/entities/appointment-service"

export abstract class AppointmentsServicesRepository {
  abstract create(service: AppointmentService): Promise<void>
}
