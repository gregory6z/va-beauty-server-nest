import { Module } from "@nestjs/common"
import { ConfigModule } from "@nestjs/config"

import { envSchema } from "./infra/env/env"
import { EnvModule } from "./infra/env/env.module"
import { HttpModule } from "./infra/http.module"
import { StripeNestModule } from "./infra/stripe/stripe.module"
import { ClerkModule } from "./infra/auth/clerk/clerk.module"

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    HttpModule,
    // ClerkModule,
    StripeNestModule,
  ],
  controllers: [],
})
export class AppModule {}
