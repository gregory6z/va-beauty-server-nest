import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from "@nestjs/common"

import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation.pipe"
import { CreateAppointmentUseCase } from "@/domain/beauty-salon/aplication/use-cases/create-appointent"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { AuthGuard } from "@nestjs/passport"

const createAppointmentBodySchema = z.object({
  servicesIds: z.array(z.string()),
  date: z.coerce.date(),
})

const bodyValidationPipe = new ZodValidationPipe(createAppointmentBodySchema)

type CreateAppointmentBodySchema = z.infer<typeof createAppointmentBodySchema>

@Controller("/appointments")
@UseGuards(AuthGuard("jwt"))
export class CreateAppointmentController {
  constructor(private createAppointment: CreateAppointmentUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe)
    body: CreateAppointmentBodySchema,
  ) {
    const { servicesIds, date } = body

    const clientId = user.sub

    console.log(user.sub)

    const result = await this.createAppointment.execute({
      clientId,
      date,
      servicesIds,
    })

    if (result.isLeft()) {
      throw new BadRequestException("invalid input")
    }
  }
}
