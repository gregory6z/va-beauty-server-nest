import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { ValueObject } from "@/core/entities/value-object"
import dayjs from "dayjs"

export interface AppointmentWithServicesDetailsProps {
  appointmentId: string
  services: string[]
  isSubscription: boolean
  time: string
  date: string
  createdAt: Date
  updatedAt?: Date | null
}

export class AppointmentWithServicesDetails extends ValueObject<AppointmentWithServicesDetailsProps> {
  get appointmentId() {
    return this.props.appointmentId
  }

  get isSubscription() {
    return this.props.isSubscription
  }

  get services() {
    return this.props.services
  }

  get time() {
    return this.props.time
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

  static create(props: AppointmentWithServicesDetailsProps) {
    return new AppointmentWithServicesDetails(props)
  }
}
