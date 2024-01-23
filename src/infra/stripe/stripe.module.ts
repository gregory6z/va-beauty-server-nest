import { Module } from "@nestjs/common"
import { StripeModule } from "nestjs-stripe"
import { StripeService } from "./stripe.service"
import { PrismaService } from "../database/prisma/prisma.service"

@Module({
  imports: [
    StripeModule.forRoot({
      apiKey:
        "sk_test_51LgShvK3dCvt5LZgmzRDfvTXCTzj6oRiWXjsVeiHGMiuuwpPyt9HyaYucnsRBSExTKtcMvxcstFJ2QuJBX5lmFLH00pqAX28PN",
    }),
  ],
  providers: [StripeService, PrismaService],
  controllers: [],
})
export class StripeNestModule {}
