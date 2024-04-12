import { BadRequestException, Body, Controller, Delete } from "@nestjs/common"
import { CurrentUser } from "@/infra/auth/current-user-decorator"
import { UserPayload } from "@/infra/auth/jwt.strategy"
import { z } from "zod"
import { ZodValidationPipe } from "../pipes/zod-validation.pipe"
import { DeleteSubscriptionUseCase } from "@/domain/beauty-salon/aplication/use-cases/delete-subscriptions"

const deleteSubscriptionBodySchema = z.object({
  stripeId: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(deleteSubscriptionBodySchema)

type DeleteSubscriptionBodySchema = z.infer<typeof deleteSubscriptionBodySchema>

@Controller("/delete-subscription")
export class DeleteSubscriptionController {
  constructor(private deleteSubscription: DeleteSubscriptionUseCase) {}

  @Delete()
  async handle(
    @Body(bodyValidationPipe) body: DeleteSubscriptionBodySchema,
    @CurrentUser() user: UserPayload,
  ) {
    const { stripeId } = body

    const clientId = user.sub

    const result = await this.deleteSubscription.execute({
      clientId,
      stripeId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    console.log(result)

    return {
      message: "Subscription deleted successfully",
    }
  }
}
