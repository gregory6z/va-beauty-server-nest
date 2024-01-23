import { FetchAppointmentsDayAvailabilityUseCase } from "@/domain/beauty-salon/aplication/use-cases/fetch-appointment-day-availability"
import { Controller, Get, Query } from "@nestjs/common"

@Controller("day-availability")
export class ProvidersMonthAvailabilityController {
  constructor(
    private fetchAppointmentDayAvailability: FetchAppointmentsDayAvailabilityUseCase,
  ) {}

  @Get()
  public async handle(
    @Query("month") month: number,
    @Query("year") year: number,
    @Query("day") day: number,
  ): Promise<Response> {
    const availability = await this.fetchAppointmentDayAvailability.execute({
      month: Number(month),
      year: Number(year),
      day: Number(day),
    })

    return {
      availability,
    }
  }
}
