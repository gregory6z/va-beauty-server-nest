import { ForgotPasswordController } from "./http/controllers/forgot-password.controller"
import { FetchAppointmentByClientController } from "./http/controllers/fetch-appointment-by-client"
import { CreateServiceUseCase } from "./../domain/beauty-salon/aplication/use-cases/create-service"
import { Module } from "@nestjs/common"
import { DatabaseModule } from "./database/database.module"
import { StripeController } from "./http/controllers/fetch-stripe-services"
import { StripeService } from "./stripe/stripe.service"
import { CreateAppointmentController } from "./http/controllers/create-appointment"
import { CreateServiceController } from "./http/controllers/create-service"
import { FetchAppointmentsMonthAvailabilityUseCase } from "@/domain/beauty-salon/aplication/use-cases/fetch-appointment-month-availability"
import { FetchMonthAvailabilityController } from "./http/controllers/fetch-appointment-month-availability"
import { FetchAppointmentsWeekAvailabilityUseCase } from "@/domain/beauty-salon/aplication/use-cases/fetch-appointment-week-availability"
import { FetchWeekAvailabilityController } from "./http/controllers/fetch-appointment-week-availability"
import { CryptographyModule } from "./cryptography/cryptography.module"
import { AuthModule } from "./auth/auth.module"

import { AuthenticateClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/authenticate-client"
import { RegisterClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/register-client"
import { CreateAccountController } from "./http/controllers/create-account.controller"
import { AuthenticateController } from "./http/controllers/authenticate.controller"
import { FetchClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/fetch-client"
import { FetchClientController } from "./http/controllers/fetch-client"
import { EditClientController } from "./http/controllers/edit-client.controller"
import { EditClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/edit-client"
import { EditAppointmentUseCase } from "@/domain/beauty-salon/aplication/use-cases/edit-date-appointment"
import { CreateAppointmentUseCase } from "@/domain/beauty-salon/aplication/use-cases/create-appointent"
import { FetchAppointmentByClientUseCase } from "@/domain/beauty-salon/aplication/use-cases/fetch-appointments-by-client"
import { CheckAppointmentAvailabilityUseCase } from "@/domain/beauty-salon/aplication/use-cases/check-appointmentAvailabilityUseCase"
import { EditAppointmentController } from "./http/controllers/edit-appointment.controller"
import { DeleteSubscriptionUseCase } from "@/domain/beauty-salon/aplication/use-cases/delete-subscriptions"
import { DeleteSubscriptionController } from "./http/controllers/delete-subscriptions.controller"
import { ForgotPasswordUseCase } from "@/domain/beauty-salon/aplication/use-cases/forgot-password"
import { EnvService } from "./env/env.service"
import { EmailModule } from "./email/email.module"
import { EmailService } from "./email/emailService"

@Module({
  imports: [DatabaseModule, CryptographyModule, AuthModule, EmailModule],
  controllers: [
    StripeController,
    CreateAppointmentController,
    CreateServiceController,
    FetchMonthAvailabilityController,
    FetchWeekAvailabilityController,
    CreateAccountController,
    AuthenticateController,
    FetchClientController,
    EditClientController,
    EditAppointmentController,
    FetchAppointmentByClientController,
    DeleteSubscriptionController,
    ForgotPasswordController,

    // AuthenticateController,
  ],
  providers: [
    EmailService,
    StripeService,
    AuthenticateClientUseCase,
    RegisterClientUseCase,
    EditClientUseCase,
    EditAppointmentUseCase,
    DeleteSubscriptionUseCase,
    ForgotPasswordUseCase,
    EnvService,

    FetchClientUseCase,
    FetchAppointmentByClientUseCase,

    CreateServiceUseCase,
    CreateAppointmentUseCase,

    CheckAppointmentAvailabilityUseCase,

    FetchAppointmentsMonthAvailabilityUseCase,
    FetchAppointmentsWeekAvailabilityUseCase,
    // EmailUseCase,
  ],
})
export class HttpModule {}
