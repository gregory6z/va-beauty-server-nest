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

@Injectable()
export class PrismaAppointmentsRepository implements AppointmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(appointment: Appointment): Promise<void> {
    const { clientId, date, servicesIds, isSubscription } = appointment

    await this.prisma.appointment.create({
      data: {
        date,
        servicesIds,
        clientId,
        isSubscription,
        User: {
          connect: {
            id: clientId,
          },
        },
      },
    })
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

  async findManyAppointmentsByUserId(clientId: string): Promise<Appointment[]> {
    const appointments = await this.prisma.appointment.findMany({
      where: {
        clientId,
      },
    })

    return appointments.map(PrismaAppointmentsMapper.toDomain)
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
