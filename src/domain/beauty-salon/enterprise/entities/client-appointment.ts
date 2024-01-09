import { Entity } from "@/core/entities/entity"
import { Appointment } from "./appointment"
import { ClientProps } from "./client"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface ClientAppointmentProps extends ClientProps {
  appointments: Appointment[]
}

export class ClientAppointment extends Entity<ClientAppointmentProps> {
  get appointments() {
    return this.appointments
  }

  static create(props: ClientAppointmentProps, id?: UniqueEntityID) {
    const appointments = new ClientAppointment(props, id)

    return appointments
  }
}
