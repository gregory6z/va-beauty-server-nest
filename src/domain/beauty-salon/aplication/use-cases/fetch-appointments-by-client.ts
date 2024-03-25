import { Either, left, right } from "@/core/either"
import { Appointment } from "../../enterprise/entities/appointment"
import { BadRequestException, Injectable } from "@nestjs/common"
import { AppointmentsRepository } from "../../repositories/appointments-repository"

interface FetchAppointmentsByClientUseCaseRequest {
  clientId: string
}

type FetchAppointmentByClientResponse = Either<
  BadRequestException,
  { appointments: Appointment[] }
>

@Injectable()
export class FetchAppointmentByClientUseCase {
  constructor(private appointmentRepository: AppointmentsRepository) {}

  async execute({
    clientId,
  }: FetchAppointmentsByClientUseCaseRequest): Promise<FetchAppointmentByClientResponse> {
    const appointments =
      await this.appointmentRepository.findManyAppointmentsByUserId(clientId)

    console.log(appointments)

    if (!appointments) {
      return left(new BadRequestException())
    }

    return right({
      appointments,
    })
  }
}
