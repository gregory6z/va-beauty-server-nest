import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Optional } from "@/core/types/optional"
import dayjs from "dayjs"

export interface ClientProps {
  email: string
  name?: string
  telephone?: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Client extends Entity<ClientProps> {
  get email() {
    return this.props.email
  }

  get name() {
    return this.props.name
  }

  get telephone() {
    return this.props.telephone
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
    props: Optional<ClientProps, "createdAt">,
    id?: UniqueEntityID,
  ) {
    const client = new Client(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return client
  }
}
