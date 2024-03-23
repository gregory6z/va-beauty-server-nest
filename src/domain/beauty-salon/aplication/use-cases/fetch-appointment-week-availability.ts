import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { AppointmentsRepository } from "../../repositories/appointments-repository"
import { isAfter, setSeconds } from "date-fns"
import * as dayjs from "dayjs"
import { ServicesRepository } from "../../repositories/services-repository"

const NUMBER_OF_WEEKS = 20 // 6 months
const NUMBER_OF_DAYS_IN_WEEK = 7 // days
const START_OF_SERVICE = 480 // 8 heures
const END_OF_SERVICE = 1080 // 18 heures
const SLOT_TIME = 15 // slots  15 minutes
const BREAK_TIME = 720 // 12 h
const DURATION_BREAK_TIME = 60 // min

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

  private async fetchAppointments() {
    return await this.appointmentsRepository.findFutureAppointments()
  }

  private async calculateServiceDuration(appointments) {
    const servicesIds = appointments
      .map((appointment) => appointment.servicesIds)
      .flat()

    return await this.servicesRepository.findManyServicesAndCalculateDuration(
      servicesIds,
    )
  }

  private extractStartTimes(appointments) {
    return appointments.map(({ date }) => {
      const hours = dayjs(date).hour()
      const minutes = dayjs(date).minute()
      return hours * 60 + minutes
    })
  }

  private buildArrayOfAppointments(startTimes, durationOfService) {
    const arrays: number[][] = []

    for (const startTime of startTimes) {
      const newArray = Array.from(
        { length: Math.ceil(durationOfService / SLOT_TIME) },
        (_, index) => startTime + index * SLOT_TIME,
      )
      arrays.push(newArray)
    }

    const lunchArray = Array.from(
      { length: Math.ceil(DURATION_BREAK_TIME / SLOT_TIME) },
      (_, index) => BREAK_TIME + index * SLOT_TIME,
    )

    return ([] as number[])
      .concat(...arrays)
      .concat(lunchArray)
      .sort((a, b) => a - b)
  }

  private buildTimeSlots(currentDate, arrayOfAppointments) {
    const numberOfArray = (END_OF_SERVICE - START_OF_SERVICE) / SLOT_TIME
    const eachMinuteArray = Array.from(
      { length: numberOfArray },
      (_, index) => START_OF_SERVICE + index * SLOT_TIME,
    )

    return eachMinuteArray.map((minute) => {
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
        available: !hasAppointmentInMinute && isAfter(compareDate, new Date()),
      }
    })
  }

  async execute(): Promise<FetchWeekAvailabilityUseCaseResponse> {
    try {
      const weekAvailability: WeekAvailability[] = []
      const today = dayjs()

      const allAppointments = await this.fetchAppointments()

      for (let week = 0; week < NUMBER_OF_WEEKS; week++) {
        for (let day = 0; day < NUMBER_OF_DAYS_IN_WEEK; day++) {
          const currentDate = today.add(
            week * NUMBER_OF_DAYS_IN_WEEK + day,
            "day",
          )

          const appointmentsForDay = allAppointments.filter((appointment) =>
            dayjs(appointment.date).isSame(currentDate, "day"),
          )

          const durationOfService =
            await this.calculateServiceDuration(appointmentsForDay)
          const startTimes = this.extractStartTimes(appointmentsForDay)
          const arrayOfAppointments = this.buildArrayOfAppointments(
            startTimes,
            durationOfService,
          )

          const timeSlots = this.buildTimeSlots(
            currentDate,
            arrayOfAppointments,
          )

          weekAvailability.push({ day: currentDate.toDate(), timeSlots })
        }
      }

      return right(weekAvailability)
    } catch (error) {
      console.log(error)
      return left({
        message: "Erro ao buscar a disponibilidade semanal.",
      })
    }
  }
}
