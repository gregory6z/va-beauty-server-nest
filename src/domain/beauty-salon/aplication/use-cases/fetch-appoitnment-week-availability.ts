import { Injectable } from "@nestjs/common"
import { Either, left, right } from "@/core/either"
import { AppointmentsRepository } from "../../repositories/appointments-repository"
import { isAfter, setSeconds } from "date-fns"
import dayjs from "dayjs"
import { ServicesRepository } from "../../repositories/services-repository"

interface FetchAppointmentsWeekAvailabilityUseCaseRequest {
  startDay: number
  month: number
  year: number
  numberOfWeeks?: number // tornando numberOfWeeks opcional
}

interface FetchAppointmentsWeekAvailabilityUseCaseError {
  message: string
}

interface TimeSlot {
  minute: number
  available: boolean
}

type WeekAvailability = { date: Date; availability: TimeSlot[] }[]

type FetchAppointmentsWeekAvailabilityUseCaseResponse = Either<
  FetchAppointmentsWeekAvailabilityUseCaseError,
  WeekAvailability
>

@Injectable()
export class FetchAppointmentsWeekAvailabilityUseCase {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private servicesRepository: ServicesRepository,
  ) {}

  async execute({
    startDay,
    month,
    year,
    numberOfWeeks = 26, // definindo o valor padrão para numberOfWeeks como 26 (6 meses)
  }: FetchAppointmentsWeekAvailabilityUseCaseRequest): Promise<FetchAppointmentsWeekAvailabilityUseCaseResponse> {
    try {
      const weekAvailability: WeekAvailability = []

      // Itera sobre o número de semanas desejado ou o padrão (26 semanas)
      for (let week = 0; week < numberOfWeeks; week++) {
        // Calcula o início da semana atual
        const currentStartDay = startDay + week * 7

        for (let i = 0; i < 7; i++) {
          const currentDate = dayjs()
            .year(year)
            .month(month - 1)
            .date(currentStartDay + i)

          const appointments =
            await this.appointmentsRepository.findAvailableDayTimeSlots({
              day: currentDate.date(),
              month: currentDate.month() + 1,
              year: currentDate.year(),
            })

          const someServices = appointments
            .map(({ services }) => services)
            .flat()
          const durationOfService =
            await this.servicesRepository.findManyServicesAndCalculateDuration(
              someServices,
            )

          const arrayOfAppointments: number[] = []
          for (const { date } of appointments) {
            const startTime = dayjs(date).hour() * 60 + dayjs(date).minute()
            const newArray = Array.from(
              { length: Math.ceil(durationOfService / 15) },
              (_, index) => startTime + index * 15,
            )
            arrayOfAppointments.push(...newArray)
          }

          const eachMinuteArray = Array.from(
            { length: 720 },
            (_, index) => index,
          )
          const currentDateObject = currentDate.toDate()

          const availability = eachMinuteArray.map((minute) => {
            const hasAppointmentInMinute = arrayOfAppointments.includes(minute)
            const compareDate = setSeconds(
              new Date(year, month - 1, currentDate.date(), minute),
              0,
            )
            return {
              minute,
              available:
                !hasAppointmentInMinute &&
                isAfter(compareDate, currentDateObject),
            }
          })

          weekAvailability.push({ date: currentDateObject, availability })
        }
      }

      return right(weekAvailability)
    } catch (error) {
      return left({
        message: "Error fetching week appointments availability.",
      })
    }
  }
}
