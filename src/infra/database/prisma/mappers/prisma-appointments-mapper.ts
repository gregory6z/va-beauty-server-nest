import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { Appointment as PrismaAppointment, Prisma } from "@prisma/client"

import { Appointment } from "@/domain/beauty-salon/enterprise/entities/appointment"

export class PrismaAppointmentsMapper {
  static toDomain(raw: PrismaAppointment): Appointment {
    return Appointment.create(
      {
        clientId: raw.clientId,
        date: raw.date,
        servicesIds: raw.servicesIds,

        isSubscription: raw.isSubscription,

        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(
    appointment: Appointment,
  ): Prisma.AppointmentUncheckedCreateInput {
    return {
      id: appointment.id.toString(),

      date: appointment.date,
      clientId: appointment.clientId,
      servicesIds: appointment.servicesIds,

      isSubscription: appointment.isSubscription,

      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    }
  }
}
