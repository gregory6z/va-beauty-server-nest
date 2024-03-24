import { ServicesRepository } from "@/domain/beauty-salon/repositories/services-repository"
import { Either, left, right } from "@/core/either"

import { startOfHour, isBefore, addDays, addMinutes } from "date-fns"

import { Injectable } from "@nestjs/common"
import { AppointmentsRepository } from "../../repositories/appointments-repository"

import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"
import { Service } from "../../enterprise/entities/service"
import { Appointment } from "../../enterprise/entities/appointment"
import { FetchAppointmentsDayAvailabilityUseCase } from "./fetch-appointment-day-availability"

interface CreateAppointmentUseCaseRequest {
  clientId: string
  servicesIds: string[]
  date: Date
}

type CreateAppointmentUseCaseResponse = Either<NotAllowedError, void>

@Injectable()
export class CreateAppointmentUseCase {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private servicesRepository: ServicesRepository,
    private fetchAppointmentDayAvailability: FetchAppointmentsDayAvailabilityUseCase,
  ) {}

  async execute({
    clientId,
    date,
    servicesIds,
  }: CreateAppointmentUseCaseRequest): Promise<CreateAppointmentUseCaseResponse> {
    const ServiceValidated =
      await this.servicesRepository.findManyByServiceId(servicesIds)

    if (!ServiceValidated) {
      return left(new NotAllowedError())
    }
    if (ServiceValidated.length < 1) {
      return left(new NotAllowedError())
    }

    // Filtrar serviços de inscrição
    const subscriptionServices = ServiceValidated.filter(
      (service) => service.isSubscription,
    )

    // Filtrar serviços não-inscrição
    const nonSubscriptionServices = ServiceValidated.filter(
      (service: Service) => !service.isSubscription,
    )

    // Definir a data inicial do compromisso
    let appointmentDate: Date = startOfHour(date)

    // Verificar se a data do compromisso é no passado
    if (isBefore(appointmentDate, Date.now())) {
      return left(new NotAllowedError())
    }

    let currentAppointmentDate = appointmentDate

    for (const service of subscriptionServices) {
      // Verifique se service.sessions e service.stripeId existem antes de entrar no loop
      if (
        service.sessions &&
        service.stripeId &&
        service.stripeId.trim() !== ""
      ) {
        for (let i = 0; i < service.sessions; i++) {
          // Adicione o intervalo do serviço à data do compromisso após a criação do primeiro compromisso
          if (i > 0 && service.interval) {
            currentAppointmentDate = addDays(
              currentAppointmentDate,
              service.interval,
            )
          }

          let availability = await this.fetchAppointmentDayAvailability.execute(
            {
              date: currentAppointmentDate,
            },
          )

          while (!availability) {
            currentAppointmentDate = addMinutes(currentAppointmentDate, 15)
            availability = await this.fetchAppointmentDayAvailability.execute({
              date: currentAppointmentDate,
            })
          }

          if (service.stripeId && service.stripeId.trim() !== "") {
            const appointment = Appointment.create({
              clientId,
              date: currentAppointmentDate,
              servicesIds: [service.stripeId],
            })

            await this.appointmentsRepository.create(appointment)
          }

          // Adicione tempo extra após a criação do compromisso para evitar a criação de vários compromissos no mesmo horário
          currentAppointmentDate = addMinutes(currentAppointmentDate, 15)
        }
      }
    }

    const totalDurationNonSubscriptionServices = nonSubscriptionServices.reduce(
      (total, service) => total + service.duration,
      0,
    )

    if (subscriptionServices && subscriptionServices.length > 0) {
      appointmentDate = addMinutes(
        appointmentDate,
        totalDurationNonSubscriptionServices,
      )
    }

    const appointment = Appointment.create({
      clientId,
      date: appointmentDate,
      servicesIds: nonSubscriptionServices.map((service) => service.stripeId),
    })

    await this.appointmentsRepository.create(appointment)

    return right(undefined)
  }
}
