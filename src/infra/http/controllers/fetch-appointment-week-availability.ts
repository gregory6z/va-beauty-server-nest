import { FetchAppointmentsWeekAvailabilityUseCase } from "@/domain/beauty-salon/aplication/use-cases/fetch-appoitnment-week-availability"
import { Controller, Get, Query } from "@nestjs/common"

@Controller("availability")
export class AvailabilityController {
  constructor(
    private readonly fetchAppointmentsWeekAvailabilityUseCase: FetchAppointmentsWeekAvailabilityUseCase,
  ) {}

  @Get("weeks")
  async getWeeksAvailability(
    @Query("startDay") startDay: number,
    @Query("month") month: number,
    @Query("year") year: number,
    @Query("numberOfWeeks") numberOfWeeks: number,
  ) {
    const weeksAvailability = []

    for (let i = 0; i < numberOfWeeks; i++) {
      const currentStartDay = startDay + i * 7
      const response =
        await this.fetchAppointmentsWeekAvailabilityUseCase.execute({
          startDay: currentStartDay,
          month,
          year,
        })
      if (response.isLeft()) {
        throw new Error(response.value.message) // Tratar erro de forma adequada no seu aplicativo
      }
      weeksAvailability.push(response.value) // Adiciona a disponibilidade da semana ao array
    }

    return weeksAvailability
  }
}
