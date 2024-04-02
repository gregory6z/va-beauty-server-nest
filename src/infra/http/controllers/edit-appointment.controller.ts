import { BadRequestException, Body, Controller, Put } from "@nestjs/common"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation.pipe"
import { EditAppointmentUseCase } from "@/domain/beauty-salon/aplication/use-cases/edit-date-appointment"

const editAppointmentBodySchema = z.object({
  date: z.coerce.date(),
  appointmentId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editAppointmentBodySchema)

type EditAppointmentBodySchema = z.infer<typeof editAppointmentBodySchema>

@Controller("/edit-appointment")
export class EditAppointmentController {
  constructor(private editAppointment: EditAppointmentUseCase) {}

  @Put()
  async handle(@Body(bodyValidationPipe) body: EditAppointmentBodySchema) {
    const { date, appointmentId } = body

    const result = await this.editAppointment.execute({
      date,
      appointmentId,
    })

    if (result && result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
