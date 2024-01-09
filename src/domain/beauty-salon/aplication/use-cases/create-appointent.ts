import { ServicesRepository } from "@/domain/beauty-salon/repositories/services-repository"
import { Either, left, right } from "@/core/either"

import { startOfHour, isBefore } from "date-fns"

import { Injectable } from "@nestjs/common"
import { Appointment } from "../../enterprise/entities/appointment"
import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import { AppointmentsRepository } from "../../repositories/appointments-repository"

import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"

interface CreateAppointmentUseCaseRequest {
  clientId: string
  services: string[]
  date: Date
}

type CreateAppointmentUseCaseResponse = Either<
  NotAllowedError,
  {
    appointment: Appointment
  }
>

@Injectable()
export class CreateAppointmentUseCase {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private servicesRepository: ServicesRepository,
  ) {}

  async execute({
    clientId,
    date,
    services,
  }: CreateAppointmentUseCaseRequest): Promise<CreateAppointmentUseCaseResponse> {
    const ServiceValidated = await this.servicesRepository.findManyByServiceId(
      services,
    )

    if (!ServiceValidated) {
      return left(new NotAllowedError())
    }
    if (ServiceValidated.length < 1) {
      return left(new NotAllowedError())
    }

    const appointment = Appointment.create({
      clientId: new UniqueEntityID(clientId),
      date,
      services: ServiceValidated,
    })

    const appointmentDate = startOfHour(date)

    if (isBefore(appointmentDate, Date.now())) {
      return left(new NotAllowedError())
    }

    if (appointmentDate.getHours() < 8 || appointmentDate.getHours() > 18) {
      return left(new NotAllowedError())
    }

    await this.appointmentsRepository.create(appointment)

    return right({
      appointment,
    })
  }
}
