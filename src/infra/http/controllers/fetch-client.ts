import { BadRequestException, Controller, Get, Query } from "@nestjs/common"

import { FetchClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/fetch-client"
import { Public } from "@/infra/auth/public"
import { CLientPresenter } from "../presenters/client-presenter"

@Controller("/client")
// @UseGuards(AuthGuard("jwt"))
@Public()
export class FetchClientController {
  constructor(private fetchClient: FetchClientUseCase) {}

  @Get()
  async handle(@Query("user") user: string) {
    const result = await this.fetchClient.execute({
      id: user,
    })

    console.log(result.value)

    if (result.isLeft()) {
      throw new BadRequestException("invalid input")
    }
    return { client: CLientPresenter.toHTTP(result.value.client) }
  }
}
