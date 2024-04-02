import { ValueObject } from "@/core/entities/value-object"

export interface AppointmentWithServicesDetailsProps {
  appointmentId: string
  services: string[]
  isSubscription: boolean
  duration: number
  dateTime: Date
  time: string
  date: string
  createdAt: Date
  updatedAt?: Date | null
}

export class AppointmentWithServicesDetails extends ValueObject<AppointmentWithServicesDetailsProps> {
  get appointmentId() {
    return this.props.appointmentId
  }

  get duration() {
    return this.props.duration
  }

  get dateTime() {
    return this.props.dateTime
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
