import { BadRequestException, Controller, Get } from "@nestjs/common"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"

import { FetchAppointmentByClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/fetch-appointments-by-client"

@Controller("/fetch-appointments")
export class FetchAppointmentByClientController {
  constructor(
    private fetchAppointmentByClient: FetchAppointmentByClientUseCase,
  ) {}

  @Get()
  async handle(@CurrentUser() user: UserPayload) {
    const clientId = user.sub

    const result = await this.fetchAppointmentByClient.execute({
      clientId,
    })

    if (result.isLeft()) {
      return new BadRequestException()
    }

    const { futureAppointments, pastAppointments, subscriptions } = result.value

    return {
      futureAppointments,
      pastAppointments,
      subscriptions,
    }
  }
}
