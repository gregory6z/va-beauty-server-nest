import { BadRequestException, Body, Controller, Put } from "@nestjs/common"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { z } from "zod"
import { EditClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/edit-client"
import { ZodValidationPipe } from "../pipes/zod-validation.pipe"

const editClientBodySchema = z.object({
  name: z.string().optional(),
  password: z.string().optional(),
  telephone: z.string().optional(),
  email: z.string().email().optional(),
})

const bodyValidationPipe = new ZodValidationPipe(editClientBodySchema)

type EditClientBodySchema = z.infer<typeof editClientBodySchema>

@Controller("/client")
export class EditClientController {
  constructor(private editClient: EditClientUseCase) {}

  @Put()
  async handle(
    @Body(bodyValidationPipe) body: EditClientBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { name, password, telephone, email } = body

    const clientId = user.sub

    const result = await this.editClient.execute({
      clientId,
      name,
      password,
      telephone,
      email,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const { accessToken } = result.value

    return {
      accessToken,
    }
  }
}
