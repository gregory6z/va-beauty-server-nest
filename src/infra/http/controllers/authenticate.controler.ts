import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
  UsePipes,
} from "@nestjs/common"
import { z } from "zod"
import { Public } from "@/infra/auth/public"
import { ZodValidationPipe } from "../pipes/zod-validation.pipe"
import { AuthenticateClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/authenticate-client"
import { WrongCredentialsError } from "@/domain/beauty-salon/aplication/use-cases/errors/wrong-credentials-error"

const authenticateBodySchema = z.object({
  email: z.string().email(),
})

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>

@Controller("/sessions")
@Public()
export class AuthenticateController {
  constructor(private authenticateClient: AuthenticateClientUseCase) {}

  @Post()
  async handle(@Body() body: AuthenticateBodySchema) {
    const { email } = body

    const result = await this.authenticateClient.execute({
      email,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
