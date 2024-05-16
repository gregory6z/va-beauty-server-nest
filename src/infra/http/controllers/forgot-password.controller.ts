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
import { WrongCredentialsError } from "@/domain/beauty-salon/aplication/use-cases/errors/wrong-credentials-error"
import { ForgotPasswordUseCase } from "@/domain/beauty-salon/aplication/use-cases/forgot-password"

const forgotPasswordBodySchema = z.object({
  email: z.string().email(),
})

type ForgotPasswordBodySchema = z.infer<typeof forgotPasswordBodySchema>

@Controller("/forgot-password")
@Public()
export class ForgotPasswordController {
  constructor(private forgotPassword: ForgotPasswordUseCase) {}

  @Post()
  @UsePipes(new ZodValidationPipe(forgotPasswordBodySchema))
  async handle(@Body() body: ForgotPasswordBodySchema) {
    const { email } = body

    const result = await this.forgotPassword.execute({
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

    return result.value
  }
}
