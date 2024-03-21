import { Either, left, right } from "@/core/either"
import { Appointment } from "../../enterprise/entities/appointment"
import { BadRequestException, Injectable } from "@nestjs/common"
import { AppointmentsRepository } from "../../repositories/appointments-repository"

interface EditAppointmentUseCaseRequest {
  appointmentId: string
  date: Date
}

type EditAppointmentUseCaseResponse = Either<
  BadRequestException,
  { appointment: Appointment }
>

@Injectable()
export class EditAppointmentUseCase {
  constructor(private appointmentRepository: AppointmentsRepository) {}

  async execute({
    appointmentId,
    date,
  }: EditAppointmentUseCaseRequest): Promise<EditAppointmentUseCaseResponse | void> {
    const appointment = await this.appointmentRepository.findById(appointmentId)

    if (!appointment) {
      return left(new BadRequestException())
    }

    await this.appointmentRepository.update({ date, appointmentId })
  }
}
