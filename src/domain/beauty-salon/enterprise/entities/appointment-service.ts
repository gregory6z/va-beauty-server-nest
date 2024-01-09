import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Service, ServiceProps } from "./service"
import { Entity } from "@/core/entities/entity"

export interface AppointmentServiceProps extends ServiceProps {
  services: Service[]
}

export class AppointmentService extends Entity<AppointmentServiceProps> {
  get services() {
    return this.services
  }

  static create(props: AppointmentServiceProps, id?: UniqueEntityID) {
    const appointments = new AppointmentService(props, id)

    return appointments
  }
}
