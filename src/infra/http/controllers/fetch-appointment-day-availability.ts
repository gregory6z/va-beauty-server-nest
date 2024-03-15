import { BadRequestException, Controller, Get, Query } from "@nestjs/common"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation.pipe"
import { FetchAppointmentsDayAvailabilityUseCase } from "@/domain/beauty-salon/aplication/use-cases/fetch-appointment-day-availability"
import { Public } from "@/infra/auth/public"

const pageQueryParamSchema = z.string().transform(Number)

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller("/day-availability")
export class FetchDayAvailabilityController {
  constructor(
    private fetchDayAvailability: FetchAppointmentsDayAvailabilityUseCase,
  ) {}

  @Public()
  @Get()
  async handle(
    @Query("day", queryValidationPipe) day: PageQueryParamSchema,
    @Query("month", queryValidationPipe) month: PageQueryParamSchema,
    @Query("year", queryValidationPipe) year: PageQueryParamSchema,
  ) {
    const result = await this.fetchDayAvailability.execute({
      day,
      month,
      year,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const appointments = result.value

    return appointments
  }
}
