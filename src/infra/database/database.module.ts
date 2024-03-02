import { Module } from "@nestjs/common"
import { PrismaService } from "./prisma/prisma.service"
import { PrismaServicesRepository } from "./prisma/repositories/prisma-services-repository"
import { ServicesRepository } from "@/domain/beauty-salon/repositories/services-repository"
import { AppointmentsRepository } from "@/domain/beauty-salon/repositories/appointments-repository"
import { PrismaAppointmentsRepository } from "./prisma/repositories/prisma-appointments-repository"
import { ClientsRepository } from "@/domain/beauty-salon/repositories/client-repository"
import { PrismaClientsRepository } from "./prisma/repositories/prisma-clients-repository"

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: ServicesRepository,
      useClass: PrismaServicesRepository,
    },
    {
      provide: ClientsRepository,
      useClass: PrismaClientsRepository,
    },
    {
      provide: AppointmentsRepository,
      useClass: PrismaAppointmentsRepository,
    },
  ],
  exports: [
    PrismaService,
    ServicesRepository,
    AppointmentsRepository,
    ClientsRepository,
  ],
})
export class DatabaseModule {}
