import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
} from "@nestjs/common"

import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation.pipe"
import { CreateAppointmentUseCase } from "@/domain/beauty-salon/aplication/use-cases/create-appointent"

const createAppointmentBodySchema = z.object({
  clientId: z.string(),
  servicesIds: z.array(z.string()),
  date: z.coerce.date(),
})

const bodyValidationPipe = new ZodValidationPipe(createAppointmentBodySchema)

type CreateAppointmentBodySchema = z.infer<typeof createAppointmentBodySchema>

@Controller("/appointments")
export class CreateAppointmentController {
  constructor(private createAppointment: CreateAppointmentUseCase) {}

  @Post()
  async handle(
    @Request() request,
    @Body(bodyValidationPipe)
    body: CreateAppointmentBodySchema,
  ) {
    const { servicesIds, date, clientId } = body

    console.log(request.user)

    const result = await this.createAppointment.execute({
      clientId,
      date,
      servicesIds,
    })

    if (result.isLeft()) {
      throw new BadRequestException("invalido")
    }
  }
}
