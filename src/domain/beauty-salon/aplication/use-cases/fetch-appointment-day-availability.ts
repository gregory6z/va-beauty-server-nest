import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { AppointmentsRepository } from "../../repositories/appointments-repository"
import { isAfter, setSeconds } from "date-fns"
import dayjs from "dayjs"
import { ServicesRepository } from "../../repositories/services-repository"

interface FetchAppointmentsDayAvailabilityUseCaseRequest {
  date: Date
}

interface FetchAppointmentsDayAvailabilityUseCaseError {
  message: string
}

type FetchAppointmentsDayAvailabilityUseCaseResponse = Either<
  FetchAppointmentsDayAvailabilityUseCaseError,
  { minute: number; available: boolean }[]
>

@Injectable()
export class FetchAppointmentsDayAvailabilityUseCase {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private servicesRepository: ServicesRepository,
  ) {}

  async execute({
    date,
  }: FetchAppointmentsDayAvailabilityUseCaseRequest): Promise<FetchAppointmentsDayAvailabilityUseCaseResponse> {
    try {
      const day = date.getDate()
      const month = date.getMonth() + 1 // getMonth() retorna um valor de 0 (janeiro) a 11 (dezembro), então adicionamos 1 para obter o mês correto.
      const year = date.getFullYear()

      const appointments =
        await this.appointmentsRepository.findAvailableDayTimeSlots({
          day,
          month,
          year,
        })

      const someServices = appointments
        .map(({ servicesIds }) => servicesIds)
        .flat()

      const durationOfService =
        await this.servicesRepository.findManyServicesAndCalculateDuration(
          someServices,
        )

      const AppointmentsOfTheDay = appointments.map(({ date }) => date)

      const ConversionOfDatesToMinutes = AppointmentsOfTheDay.map((data) => {
        const hours = dayjs(data).hour()
        const minutes = dayjs(data).minute()
        const allMinutes = hours * 60 + minutes
        return allMinutes
      })

      // array for comparison of available schedules

      const arrays: number[][] = []

      const StartOfService = 480
      // 8 hours
      const EndOfService = 1080
      // 18 hours
      const startTimes: number[] = ConversionOfDatesToMinutes

      const slotTime = 15

      // break time
      const BreakTime = 720
      const durationBreakTime = 60

      const arrayDoAlmoco = Array.from(
        { length: Math.ceil(durationBreakTime / slotTime) },
        (_, index) => BreakTime + index * slotTime,
      )

      for (const startTime of startTimes) {
        const newArray = Array.from(
          { length: Math.ceil(durationOfService / slotTime) },
          (_, index) => startTime + index * slotTime,
        )
        arrays.push(newArray)
      }

      const arrayToSort = (a, b) => a - b

      const arrayOfAppointments: number[] = ([] as number[])
        .concat(...arrays)
        .concat(arrayDoAlmoco)
        .sort(arrayToSort)

      //

      const numberOfArray = (EndOfService - StartOfService) / slotTime
      const eachMinuteArray = Array.from(
        { length: numberOfArray },
        (_, index) => StartOfService + index * slotTime,
      )

      const currentDate = new Date(Date.now())

      const availability = eachMinuteArray.map((minute) => {
        const hasAppointmentInMinute = arrayOfAppointments.find(
          (appointment) => appointment === minute,
        )

        const compareDate = setSeconds(
          new Date(year, month - 1, day, minute),
          0,
        )

        return {
          minute,
          available:
            !hasAppointmentInMinute && isAfter(compareDate, currentDate),
        }
      })

      return right(availability)
    } catch (error) {
      return left({ message: "Error fetching appointments availability." })
    }
  }
}
