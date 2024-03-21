import { PrismaService } from "../prisma.service"
import { Injectable } from "@nestjs/common"
import { Appointment } from "@/domain/beauty-salon/enterprise/entities/appointment"
import {
  AppointmentsRepository,
  UpdateAppointmentProps,
  findAvailableDayTimeSlotsProps,
  findAvailableMonthTimeSlotsProps,
} from "@/domain/beauty-salon/repositories/appointments-repository"
import { PrismaAppointmentsMapper } from "../mappers/prisma-appointments-mapper"
import { DomainEvents } from "@/core/events/domain-events"

@Injectable()
export class PrismaAppointmentsRepository implements AppointmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(appointment: Appointment): Promise<void> {
    const data = PrismaAppointmentsMapper.toPrisma(appointment)
    await this.prisma.appointment.create({
      data: {
        ...data,
        User: {
          connect: {
            id: appointment.clientId,
          },
        },
        userId: undefined, // Set userId to undefined
      },
    })

    DomainEvents.dispatchEventsForAggregate(appointment.id)
  }

  async update({ appointmentId, date }: UpdateAppointmentProps): Promise<void> {
    await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    })

    await this.prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        date,
      },
    })
  }

  async findFutureAppointments(): Promise<Appointment[]> {
    const futureAppointments = await this.prisma.appointment.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
    })
    return futureAppointments.map(PrismaAppointmentsMapper.toDomain)
  }

  async findById(appointmentId: string): Promise<Appointment | null> {
    const appointment = await this.prisma.appointment.findUnique({
      where: {
        id: appointmentId,
      },
    })

    if (!appointment) {
      return null
    }

    return PrismaAppointmentsMapper.toDomain(appointment)
  }

  async findAvailableDayTimeSlots({
    day,
    month,
    year,
  }: findAvailableDayTimeSlotsProps): Promise<Appointment[]> {
    try {
      const filteredAppointments = await this.prisma.appointment.findMany({
        where: {
          date: {
            equals: new Date(`${year}-${month + 1}-${day}`),
          },
        },
      })

      return filteredAppointments.map(PrismaAppointmentsMapper.toDomain)
    } catch (error) {
      // Trate erros de forma adequada
      console.error("Erro ao buscar slots de tempo disponíveis:", error)
      throw error
    }
  }

  async findAvailableMonthTimeSlots({
    month,
    year,
  }: findAvailableMonthTimeSlotsProps): Promise<Appointment[]> {
    try {
      const filteredAppointments = await this.prisma.appointment.findMany({
        where: {
          date: {
            equals: new Date(`${year}-${month + 1}`),
          },
        },
      })

      return filteredAppointments.map(PrismaAppointmentsMapper.toDomain)
    } catch (error) {
      // Trate erros de forma adequada
      console.error("Erro ao buscar slots de tempo disponíveis:", error)
      throw error
    }
  }
}
