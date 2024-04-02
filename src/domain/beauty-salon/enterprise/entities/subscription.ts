/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface SubscriptionProps {
  status: boolean
  subscriptionServiceId: string
  clientId: string
  nextAppointmentDate: string
  nextAppointmentTime: string
}

export class Subscription extends Entity<SubscriptionProps> {
  get status() {
    return this.props.status
  }

  get clientId() {
    return this.props.clientId
  }

  get nextAppointment() {
    return this.props.nextAppointmentDate
  }

  get nextAppointmentTime() {
    return this.props.nextAppointmentTime
  }

  get subscriptionServiceId() {
    return this.props.subscriptionServiceId
  }

  set status(value: boolean) {
    this.props.status = value
  }

  static create(props: SubscriptionProps, id?: UniqueEntityID) {
    const subscription = new Subscription(props, id)

    return subscription
  }
}
