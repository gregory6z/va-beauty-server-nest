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
import { CryptographyModule } from "./cryptography/cryptography.module"
import { AuthModule } from "./auth/auth.module"

import { MagicLinkService } from "./email/magic-link.service"
import { EmailService } from "./email/email.service"

import { MeuController } from "./http/controllers/email-envio.teste"
import { AuthenticateClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/authenticate-client"
import { RegisterClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/register-client"
import { CreateAccountController } from "./http/controllers/create-account.controller"
import { AuthenticateController } from "./http/controllers/authenticate.controller"
import { FetchClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/fetch-client"
import { FetchClientController } from "./http/controllers/fetch-client"

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule],
  controllers: [
    StripeController,
    CreateAppointmentController,
    CreateServiceController,
    FetchDayAvailabilityController,
    FetchMonthAvailabilityController,
    FetchWeekAvailabilityController,
    CreateAccountController,
    AuthenticateController,
    FetchClientController,

    MeuController,

    // AuthenticateController,
  ],
  providers: [
    StripeService,
    MagicLinkService,
    EmailService,
    AuthenticateClientUseCase,
    RegisterClientUseCase,

    FetchClientUseCase,

    CreateServiceUseCase,
    CreateAppointmentUseCase,
    FetchAppointmentsDayAvailabilityUseCase,
    FetchAppointmentsMonthAvailabilityUseCase,
    FetchAppointmentsWeekAvailabilityUseCase,
    // EmailUseCase,
  ],
})
export class HttpModule {}
