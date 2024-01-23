import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Service as PrismaService, Prisma } from "@prisma/client"

import { Service } from "@/domain/beauty-salon/enterprise/entities/service"
import { Slug } from "@/domain/beauty-salon/enterprise/entities/value-objects/slug"

export class PrismaServicesMapper {
  static toDomain(raw: PrismaService): Service {
    return Service.create(
      {
        name: raw.name,
        category: raw.category,
        slug: Slug.create(raw.slug),
        price: raw.price,

        duration: raw.duration,
        description: raw.description,

        imgUrl: raw.imgUrl,
        stripeId: raw.stripeId,

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(service: Service): Prisma.ServiceUncheckedCreateInput {
    return {
      id: service.id.toString(),
      name: service.name,
      category: service.category,
      slug: service.slug,
      price: service.price,
      imgUrl: service.imgUrl,
      stripeId: service.stripeId,

      duration: service.duration,
      description: service.description,

      createdAt: service.createdAt,
      updatedAt: service.updatedAt,
    }
  }
}
