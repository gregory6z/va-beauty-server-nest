import { BadRequestException, Body, Controller, Post } from "@nestjs/common"

import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation.pipe"
import { CreateAppointmentUseCase } from "@/domain/beauty-salon/aplication/use-cases/create-appointent"

const createAppointmentBodySchema = z.object({
  clientId: z.string().uuid(),
  servicesIds: z.array(z.string().uuid()),
  date: z.date(),
})

const bodyValidationPipe = new ZodValidationPipe(createAppointmentBodySchema)

type CreateAppointmentBodySchema = z.infer<typeof createAppointmentBodySchema>

@Controller("/appointments")
export class CreateAppointmentController {
  constructor(private createAppointment: CreateAppointmentUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateAppointmentBodySchema) {
    const { servicesIds, date, clientId } = body

    const result = await this.createAppointment.execute({
      servicesIds,
      date,
      clientId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
