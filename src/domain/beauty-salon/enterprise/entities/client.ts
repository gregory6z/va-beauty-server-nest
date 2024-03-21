import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Appointment } from "./appointment"

export interface ClientProps {
  email: string
  name: string
  password: string
  telephone?: string | null
  appointments?: Appointment[]
}

export class Client extends Entity<ClientProps> {
  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }

  get name() {
    return this.props.name
  }

  get telephone() {
    return this.props.telephone
  }

  get appointments() {
    return this.props.appointments
  }

  static create(props: ClientProps, id?: UniqueEntityID) {
    const client = new Client(props, id)

    return client
  }
}
