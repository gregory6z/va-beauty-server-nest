import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"

export interface ClientProps {
  name: string
  email: string
  phone: string
}

export class Client extends Entity<ClientProps> {
  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get phone() {
    return this.props.phone
  }

  static create(props: ClientProps, id?: UniqueEntityID) {
    const client = new Client(props, id)

    return client
  }
}
