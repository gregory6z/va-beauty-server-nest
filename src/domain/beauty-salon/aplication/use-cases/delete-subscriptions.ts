/* eslint-disable no-void */
import { Injectable } from "@nestjs/common"
import { AppointmentsRepository } from "../../repositories/appointments-repository"
import { Either, right } from "@/core/either"
import { NotAllowedError } from "@/core/errors/errors/not-allowed-error"

interface DeleteSubscriptionUseCaseRequest {
  clientId: string
  stripeId: string
}

type DeleteSubscriptionUseCaseResponse = Either<NotAllowedError, void>

@Injectable()
export class DeleteSubscriptionUseCase {
  constructor(
    private readonly appointmentsRepository: AppointmentsRepository,
  ) {}

  async execute(
    request: DeleteSubscriptionUseCaseRequest,
  ): Promise<DeleteSubscriptionUseCaseResponse> {
    const appointments = await this.appointmentsRepository.findByClientId(
      request.clientId,
    )

    const currentDate = new Date()

    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1,
    )

    const appointmentsToDelete = appointments.filter(
      (appointment) =>
        appointment.date.getTime() >= nextMonth.getTime() &&
        (!appointment.isSubscription ||
          appointment.servicesIds.includes(request.stripeId)),
    )

    // appointments.forEach((appointment) => {
    //   console.log("appointment date:", appointment.date.getTime())
    //   console.log("next month:", nextMonth.getTime())
    //   console.log("one month from now:", oneMonthFromNow.getTime())
    //   console.log("is subscription:", appointment.isSubscription)
    //   console.log(
    //     "includes stripeId:",
    //     appointment.servicesIds.includes(request.stripeId),
    //   )
    // })

    for (const appointment of appointmentsToDelete) {
      await this.appointmentsRepository.delete(appointment.id.toString())
    }

    return right(void 0)
  }
}
