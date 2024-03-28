import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Prisma } from "@prisma/client"

import { Client } from "@/domain/beauty-salon/enterprise/entities/client"
import { PrismaAppointmentsMapper } from "./prisma-appointments-mapper"

type PrismaClient = Prisma.UserGetPayload<{
  include: {
    appointments: true
  }
}>

export class PrismaClientsMapper {
  static toDomain(raw: PrismaClient): Client {
    const appointments = raw.appointments?.map((appointment) =>
      PrismaAppointmentsMapper.toDomain(appointment),
    )

    return Client.create(
      {
        email: raw.email,
        name: raw.name,
        password: raw.password,
        telephone: raw.telephone,
        appointments,
        customerId: raw.customerId,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(client: Client): Prisma.UserUncheckedCreateInput {
    return {
      id: client.id.toString(),
      name: client.name,
      telephone: client.telephone,
      email: client.email,
      password: client.password,
      customerId: client.customerId,
      appointments: {
        create: client.appointments
          ? client.appointments.map((appointment) =>
              PrismaAppointmentsMapper.toPrisma(appointment),
            )
          : [],
      },
    }
  }
}
