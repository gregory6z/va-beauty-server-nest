import { Module } from "@nestjs/common"
import { PrismaService } from "./prisma/prisma.service"
import { PrismaServicesRepository } from "./prisma/repositories/prisma-services-repository"
import { ServicesRepository } from "@/domain/beauty-salon/repositories/services-repository"
import { AppointmentsRepository } from "@/domain/beauty-salon/repositories/appointments-repository"
import { PrismaAppointmentsRepository } from "./prisma/repositories/prisma-appointments-repository"

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
      provide: AppointmentsRepository,
      useClass: PrismaAppointmentsRepository,
    },
  ],
  exports: [PrismaService, ServicesRepository, AppointmentsRepository],
})
export class DatabaseModule {}
