import { BadRequestException, Controller, Get, Query } from "@nestjs/common"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation.pipe"
import { FetchAppointmentsMonthAvailabilityUseCase } from "@/domain/beauty-salon/aplication/use-cases/fetch-appointment-month-availability"

const pageQueryParamSchema = z.string().transform(Number)

const queryValidationPipe = new ZodValidationPipe(pageQueryParamSchema)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller("/month-availability")
export class FetchMonthAvailabilityController {
  constructor(
    private fetchMonthAvailability: FetchAppointmentsMonthAvailabilityUseCase,
  ) {}

  @Get()
  async handle(
    @Query("month", queryValidationPipe) month: PageQueryParamSchema,
    @Query("year", queryValidationPipe) year: PageQueryParamSchema,
  ) {
    const result = await this.fetchMonthAvailability.execute({
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
