import { Client } from "@/domain/beauty-salon/enterprise/entities/client"
import { AppointmentPresenter } from "./appointment-presenter"

export class CLientPresenter {
  static toHTTP(client: Client) {
    return {
      id: client.id.toString(),
      email: client.email,
      name: client.name,
      telephone: client.telephone,
      appointments: client.appointments
        ? client.appointments.map(AppointmentPresenter.toHTTP)
        : [],
    }
  }
}
