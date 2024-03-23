import { BadRequestException, Body, Controller, Put } from "@nestjs/common"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { z } from "zod"
import { EditClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/edit-client"
import { ZodValidationPipe } from "../pipes/zod-validation.pipe"
import { JwtService } from "@nestjs/jwt"

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
  constructor(
    private editClient: EditClientUseCase,
    private readonly jwtService: JwtService,
  ) {}

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

    const updatedUser = result.value

    const newJwt = this.jwtService.sign({
      name: updatedUser.client.name,
      email: updatedUser.client.email,
      telephone: updatedUser.client.telephone,
    })

    console.log(newJwt)

    // Retorne o novo JWT
    return { accessToken: newJwt }
  }
}
