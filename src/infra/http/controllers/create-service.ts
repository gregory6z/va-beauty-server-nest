import { BadRequestException, Body, Controller, Post } from "@nestjs/common"

import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation.pipe"
import { CreateServiceUseCase } from "@/domain/beauty-salon/aplication/use-cases/create-service"

const createServiceBodySchema = z.object({
  // clientId: z.string().uuid(),
  // servicesIds: z.array(z.string()),
  // date: z.date(),
  category: z.string(),
  description: z.string(),
  name: z.string(),
  duration: z.number(),
  imgUrl: z.array(z.string()),
  price: z.number(),
  stripeId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createServiceBodySchema)

type CreateServiceBodySchema = z.infer<typeof createServiceBodySchema>

@Controller("/services")
export class CreateServiceController {
  constructor(private createService: CreateServiceUseCase) {}

  @Post()
  async handle(@Body(bodyValidationPipe) body: CreateServiceBodySchema) {
    const { category, description, name, duration, imgUrl, price, stripeId } =
      body

    const result = await this.createService.execute({
      category,
      description,
      name,
      duration,
      imgUrl,
      price,
      stripeId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
