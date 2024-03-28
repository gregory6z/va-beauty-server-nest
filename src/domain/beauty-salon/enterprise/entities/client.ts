/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Appointment } from "./appointment"

export interface ClientProps {
  email: string
  name: string
  password: string
  telephone?: string | null
  appointments?: Appointment[]
  customerId?: string | null
}

export class Client extends Entity<ClientProps> {
  get email() {
    return this.props.email
  }

  get customerId() {
    return this.props.customerId
  }

  set email(value: string) {
    this.props.email = value
  }

  get password() {
    return this.props.password
  }

  set password(value: string) {
    this.props.password = value
  }

  get name() {
    return this.props.name
  }

  set name(value: string) {
    this.props.name = value
  }

  get telephone() {
    return this.props.telephone ?? ""
  }

  set telephone(value: string) {
    this.props.telephone = value
  }

  get appointments() {
    return this.props.appointments
  }

  static create(props: ClientProps, id?: UniqueEntityID) {
    const client = new Client(props, id)

    return client
  }
}
