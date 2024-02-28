import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { AppointmentsRepository } from "../../repositories/appointments-repository"
import { isAfter, setSeconds } from "date-fns"
import * as dayjs from "dayjs"
import { ServicesRepository } from "../../repositories/services-repository"

interface FetchWeekAvailabilityUseCaseError {
  message: string
}

export interface TimeSlot {
  minute: number
  available: boolean
}

export type DayAvailability = TimeSlot[]

export type WeekAvailability = { day: Date; timeSlots: DayAvailability }

type FetchWeekAvailabilityUseCaseResponse = Either<
  FetchWeekAvailabilityUseCaseError,
  WeekAvailability[]
>

@Injectable()
export class FetchAppointmentsWeekAvailabilityUseCase {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private servicesRepository: ServicesRepository,
  ) {}

  async execute(): Promise<FetchWeekAvailabilityUseCaseResponse> {
    try {
      const weekAvailability: WeekAvailability[] = []

      const numberOfWeeks = 26 // 6 meses
      const numberOfDaysInWeek = 7
      const today = dayjs()

      const StartOfService = 480 // 8 horas
      const EndOfService = 1080 // 18 horas
      const slotTime = 15 // slots de 15 minutos

      // Tempo de intervalo para o almoço
      const BreakTime = 720 // 12 horas
      const durationBreakTime = 60 // duração do intervalo (em minutos)

      for (let week = 0; week < numberOfWeeks; week++) {
        for (let day = 0; day < numberOfDaysInWeek; day++) {
          const currentDate = today.add(week * numberOfDaysInWeek + day, "day")

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

          const startTimes: number[] = appointments.map(({ date }) => {
            const hours = dayjs(date).hour()
            const minutes = dayjs(date).minute()
            return hours * 60 + minutes
          })

          const arrays: number[][] = []

          for (const startTime of startTimes) {
            const newArray = Array.from(
              { length: Math.ceil(durationOfService / slotTime) },
              (_, index) => startTime + index * slotTime,
            )
            arrays.push(newArray)
          }

          const arrayDoAlmoco = Array.from(
            { length: Math.ceil(durationBreakTime / slotTime) },
            (_, index) => BreakTime + index * slotTime,
          )

          const arrayToSort = (a, b) => a - b

          const arrayOfAppointments: number[] = ([] as number[])
            .concat(...arrays)
            .concat(arrayDoAlmoco)
            .sort(arrayToSort)

          const numberOfArray = (EndOfService - StartOfService) / slotTime
          const eachMinuteArray = Array.from(
            { length: numberOfArray },
            (_, index) => StartOfService + index * slotTime,
          )

          const currentDateObject = currentDate.toDate()

          const timeSlots: DayAvailability = eachMinuteArray.map((minute) => {
            const hasAppointmentInMinute = arrayOfAppointments.includes(minute)
            const compareDate = setSeconds(
              new Date(
                currentDate.year(),
                currentDate.month(),
                currentDate.date(),
                Math.floor(minute / 60), // hora
                minute % 60, // minuto
              ),
              0,
            )
            return {
              minute,
              available:
                !hasAppointmentInMinute && isAfter(compareDate, new Date()),
            }
          })

          weekAvailability.push({ day: currentDateObject, timeSlots })
        }
      }

      return right(weekAvailability)
    } catch (error) {
      return left({
        message: "Erro ao buscar a disponibilidade semanal.",
        error,
      })
    }
  }
}
