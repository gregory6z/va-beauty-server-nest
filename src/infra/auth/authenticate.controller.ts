import { AuthenticateClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/authenticate-client"
import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from "@nestjs/common"

@Controller("session")
export class AuthController {
  constructor(
    private readonly authenticateClientUseCase: AuthenticateClientUseCase,
  ) {}

  @Post("login")
  async login(@Body("email") email: string) {
    const result = await this.authenticateClientUseCase.execute({ email })
    if (result.isRight()) {
      return { magicLink: result.value.magicLink }
    }
  }
}
