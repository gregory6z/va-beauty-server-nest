import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
  Appointment,
  AppointmentProps,
} from "@/domain/beauty-salon/enterprise/entities/appointment"
import { PrismaAppointmentsMapper } from "@/infra/database/prisma/mappers/prisma-appointments-mapper"
import { PrismaService } from "@/infra/database/prisma/prisma.service"
import { Injectable } from "@nestjs/common"

export function makeAppointment(
  override: Partial<Omit<AppointmentProps, "createdAt">> = {},
  id?: UniqueEntityID,
) {
  const appointment = Appointment.create(
    {
      clientId: new UniqueEntityID().toString(),
      date: new Date(2025, 3, 26, 12, 0, 0),
      servicesIds: ["service-id-1", "service-id-2"],
      isSubscription: false,
      ...override,
    },
    id,
  )

  return appointment
}

@Injectable()
export class AppointmentFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaAppointment(
    data: Partial<AppointmentProps> = {},
  ): Promise<Appointment> {
    const appointment = makeAppointment(data)

    await this.prisma.appointment.create({
      data: PrismaAppointmentsMapper.toPrisma(appointment),
    })

    return appointment
  }
}
