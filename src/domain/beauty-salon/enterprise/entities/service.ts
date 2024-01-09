import { Entity } from "@/core/entities/entity"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Slug } from "./value-objects/slug"
import dayjs from "dayjs"
import { Optional } from "@/core/types/optional"

export interface ServiceProps {
  name: string
  description: string
  slug: Slug
  category: string
  price: number
  duration: number
  img_url: string

  createdAt: Date
  updatedAt?: Date | null
}

export class Service extends Entity<ServiceProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.props.slug = Slug.createFromText(name)

    this.touch()
  }

  get description() {
    return this.props.description
  }

  get category() {
    return this.props.category
  }

  get price() {
    return this.props.price
  }

  get img_url() {
    return this.props.img_url
  }

  get duration() {
    return this.props.duration
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

  get excerpt() {
    return this.name.substring(0, 20).trimEnd().concat("...")
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<ServiceProps, "createdAt" | "slug">,
    id?: UniqueEntityID,
  ) {
    const service = new Service(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.name),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return service
  }
}
