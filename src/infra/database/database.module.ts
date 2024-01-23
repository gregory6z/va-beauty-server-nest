import { Module } from "@nestjs/common"
import { PrismaService } from "./prisma/prisma.service"
import { PrismaServicesRepository } from "./prisma/repositories/prisma-services-repository"
import { ServicesRepository } from "@/domain/beauty-salon/repositories/services-repository"

@Module({
  imports: [],
  controllers: [],
  providers: [
    PrismaService,
    {
      provide: ServicesRepository,
      useClass: PrismaServicesRepository,
    },
  ],
  exports: [PrismaService, ServicesRepository],
})
export class DatabaseModule {}
