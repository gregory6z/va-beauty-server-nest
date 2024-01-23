import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import dayjs from "dayjs"

export interface AppointmentProps {
  clientId: string
  date: Date

  servicesIds: string[]

  createdAt: Date
  updatedAt?: Date | null
}

export class Appointment extends Entity<AppointmentProps> {
  get clientId() {
    return this.props.clientId
  }

  get services() {
    return this.props.servicesIds
  }

  get date() {
    return this.props.date
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, "days") <= 3
  }

  static create(
    props: Optional<AppointmentProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const appointment = new Appointment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return appointment
  }
}
