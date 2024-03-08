import {
  FetchAppointmentsWeekAvailabilityUseCase,
  WeekAvailability,
} from "@/domain/beauty-salon/aplication/use-cases/fetch-appointment-week-availability"
import { Public } from "@/infra/auth/public"
import { Controller, Get } from "@nestjs/common"

@Controller("week-availability")
export class FetchWeekAvailabilityController {
  constructor(
    private readonly fetchAppointmentsWeekAvailabilityUseCase: FetchAppointmentsWeekAvailabilityUseCase,
  ) {}

  @Get()
  @Public()
  async getWeekAvailability(): Promise<WeekAvailability[]> {
    const result = await this.fetchAppointmentsWeekAvailabilityUseCase.execute()

    console.log(result)

    if (result.isRight()) {
      return result.value
    } else {
      // Tratar erro aqui
      throw new Error(result.value.message)
    }
  }
}
