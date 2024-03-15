import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { AppointmentsRepository } from "../../repositories/appointments-repository"
import { isAfter, setSeconds } from "date-fns"
import * as dayjs from "dayjs"
import { ServicesRepository } from "../../repositories/services-repository"

// Constantes
const NUMBER_OF_WEEKS = 26 // 6 meses
const NUMBER_OF_DAYS_IN_WEEK = 7
const START_OF_SERVICE = 480 // 8 horas
const END_OF_SERVICE = 1080 // 18 horas
const SLOT_TIME = 15 // slots de 15 minutos
const BREAK_TIME = 720 // 12 horas
const DURATION_BREAK_TIME = 60 // duração do intervalo (em minutos)

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

  // Função para buscar compromissos
  private async fetchAppointments(currentDate: dayjs.Dayjs) {
    return await this.appointmentsRepository.findAvailableDayTimeSlots({
      day: currentDate.date(),
      month: currentDate.month() + 1,
      year: currentDate.year(),
    })
  }

  // Função para calcular a duração do serviço
  private async calculateServiceDuration(appointments) {
    const services = appointments.map(({ services }) => services).flat()
    return await this.servicesRepository.findManyServicesAndCalculateDuration(
      services,
    )
  }

  // Função para extrair os horários de início
  private extractStartTimes(appointments) {
    return appointments.map(({ date }) => {
      const hours = dayjs(date).hour()
      const minutes = dayjs(date).minute()
      return hours * 60 + minutes
    })
  }

  // Função para construir o array de compromissos
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

  // Função para construir os slots de tempo
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

      for (let week = 0; week < NUMBER_OF_WEEKS; week++) {
        for (let day = 0; day < NUMBER_OF_DAYS_IN_WEEK; day++) {
          const currentDate = today.add(
            week * NUMBER_OF_DAYS_IN_WEEK + day,
            "day",
          )

          const appointments = await this.fetchAppointments(currentDate)
          const durationOfService =
            await this.calculateServiceDuration(appointments)
          const startTimes = this.extractStartTimes(appointments)
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
      return left({
        message: "Erro ao buscar a disponibilidade semanal.",
        error,
      })
    }
  }
}
