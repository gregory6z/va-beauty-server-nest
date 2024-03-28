import { ServicesRepository } from "@/domain/beauty-salon/repositories/services-repository"
import { Either, left, right } from "@/core/either"
import { Appointment } from "../../enterprise/entities/appointment"
import { BadRequestException, Injectable } from "@nestjs/common"
import { AppointmentsRepository } from "../../repositories/appointments-repository"
import { AppointmentWithServicesDetails } from "../../enterprise/entities/value-objects/appointmentsWithServicesDetail"

interface FetchAppointmentsByClientUseCaseRequest {
  clientId: string
}

type FetchAppointmentByClientResponse = Either<
  BadRequestException,
  {
    futureAppointments: AppointmentWithServicesDetails[]
    pastAppointments: AppointmentWithServicesDetails[]
    subscriptions: AppointmentWithServicesDetails[]
  }
>

@Injectable()
export class FetchAppointmentByClientUseCase {
  constructor(
    private appointmentRepository: AppointmentsRepository,
    private ServicesRepository: ServicesRepository,
  ) {}

  async execute({
    clientId,
  }: FetchAppointmentsByClientUseCaseRequest): Promise<FetchAppointmentByClientResponse> {
    const appointments =
      await this.appointmentRepository.findManyAppointmentsByUserId(clientId)

    if (!appointments) {
      return left(new BadRequestException())
    }

    const newAppointment = await Promise.all(
      appointments.map(async (appointment: Appointment) => {
        const services = await this.ServicesRepository.findManyByServiceId(
          appointment.servicesIds,
        )

        const date = new Date(appointment.date)
        const formattedDate = `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`

        return {
          appointmentId: appointment.id.toString(),
          services: services.map((service) => service.name),
          isSubscription: appointment.isSubscription,
          date: formattedDate,
          time: `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt,
          // Adicione aqui quaisquer outras propriedades necessárias para o tipo AppointmentWithServicesDetails
        } as AppointmentWithServicesDetails
      }),
    )

    function parseDate(dateString) {
      const [day, month, year] = dateString.split("/")
      return new Date(year, month - 1, day)
    }

    const subscriptions = newAppointment
      .filter(
        (appointment) =>
          appointment.isSubscription &&
          appointment.services.length > 0 &&
          parseDate(appointment.date) > new Date(),
      )
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())
      .slice(0, 4)

    const nonSubscriptions = newAppointment.filter(
      (appointment) => !appointment.isSubscription,
    )

    const sortedAppointments = [...subscriptions, ...nonSubscriptions].sort(
      (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime(),
    )

    const futureAppointments = sortedAppointments.filter(
      (appointment) => parseDate(appointment.date) > new Date(),
    )

    const pastAppointments = newAppointment
      .filter((appointment) => new Date(appointment.date) <= new Date())
      .sort((a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime())

    console.log(futureAppointments)

    return right({
      futureAppointments,
      pastAppointments,
      subscriptions,
    })
  }
}
