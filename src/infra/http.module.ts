import { CreateAppointmentUseCase } from "./../domain/beauty-salon/aplication/use-cases/create-appointent"
import { CreateServiceUseCase } from "./../domain/beauty-salon/aplication/use-cases/create-service"
import { Module } from "@nestjs/common"
import { DatabaseModule } from "./database/database.module"
import { StripeController } from "./http/controllers/fetch-stripe-services"
import { StripeService } from "./stripe/stripe.service"
import { CreateAppointmentController } from "./http/controllers/create-appointment"
import { CreateServiceController } from "./http/controllers/create-service"
import { FetchDayAvailabilityController } from "./http/controllers/fetch-appointment-day-availability"
import { FetchAppointmentsDayAvailabilityUseCase } from "@/domain/beauty-salon/aplication/use-cases/fetch-appointment-day-availability"
import { FetchAppointmentsMonthAvailabilityUseCase } from "@/domain/beauty-salon/aplication/use-cases/fetch-appointment-month-availability"
import { FetchMonthAvailabilityController } from "./http/controllers/fetch-appointment-month-availability"
import { FetchAppointmentsWeekAvailabilityUseCase } from "@/domain/beauty-salon/aplication/use-cases/fetch-appointment-week-availability"
import { FetchWeekAvailabilityController } from "./http/controllers/fetch-appointment-week-availability"
import { AuthenticateClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/authenticate-client"
import { CryptographyModule } from "./cryptography/cryptography.module"
import { AuthModule } from "./auth/auth.module"

import { AuthControllerMagicLink } from "./auth/auth.controller"
import { MagicLinkService } from "./email/magic-link.service"
import { EmailService } from "./email/email.service"
import { AuthService } from "./auth/auth.service"
import { AuthController } from "./auth/authenticate.controller"
import { MeuController } from "./http/controllers/email-envio.teste"

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule],
  controllers: [
    StripeController,
    CreateAppointmentController,
    CreateServiceController,
    FetchDayAvailabilityController,
    FetchMonthAvailabilityController,
    FetchWeekAvailabilityController,
    AuthController,
    AuthControllerMagicLink,

    MeuController,

    // AuthenticateController,
  ],
  providers: [
    AuthService,
    StripeService,
    MagicLinkService,
    EmailService,

    CreateServiceUseCase,
    CreateAppointmentUseCase,
    FetchAppointmentsDayAvailabilityUseCase,
    FetchAppointmentsMonthAvailabilityUseCase,
    FetchAppointmentsWeekAvailabilityUseCase,
    // EmailUseCase,
    AuthenticateClientUseCase,
  ],
})
export class HttpModule {}
