import { Module } from "@nestjs/common"
import { DatabaseModule } from "./database/database.module"
import { StripeController } from "./http/controllers/fetch-stripe-services"
import { StripeService } from "./stripe/stripe.service"

@Module({
  imports: [DatabaseModule],
  controllers: [StripeController],
  providers: [StripeService],
})
export class HttpModule {}
