// Importe a interface aqui
import {
  FetchAppointmentsWeekAvailabilityUseCase,
  WeekAvailability,
} from "@/domain/beauty-salon/aplication/use-cases/fetch-appoitnment-week-availability"
import { Controller, Get } from "@nestjs/common"

@Controller("availability")
export class AvailabilityController {
  constructor(
    private readonly fetchAppointmentsWeekAvailabilityUseCase: FetchAppointmentsWeekAvailabilityUseCase,
  ) {}

  @Get("weeks")
  async getWeeksAvailability(): Promise<WeekAvailability[]> {
    const numberOfWeeks = 26 // Definindo o número de semanas como 26

    const weeksAvailability: WeekAvailability[] = []

    for (let i = 0; i < numberOfWeeks; i++) {
      const response =
        await this.fetchAppointmentsWeekAvailabilityUseCase.execute({}) // Passando um objeto vazio

      if (response.isLeft()) {
        throw new Error(response.value.message) // Lidar com erro adequadamente no seu aplicativo
      }

      weeksAvailability.push(response.value) // Adicionar a disponibilidade da semana ao array
    }

    return weeksAvailability
  }
}
