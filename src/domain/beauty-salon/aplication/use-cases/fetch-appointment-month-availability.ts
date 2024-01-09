import { Either, left, right } from "@/core/either"
import { Injectable } from "@nestjs/common"
import { AppointmentsRepository } from "../../repositories/appointments-repository"

import { ServicesRepository } from "../../repositories/services-repository"
import { getDate, getDaysInMonth, isAfter } from "date-fns"

interface FetchAppointmentsMonthAvailabilityUseCaseRequest {
  month: number
  year: number
}

interface FetchAppointmentsMonthAvailabilityUseCaseError {
  message: string
}

type FetchAppointmentsMonthAvailabilityUseCaseResponse = Either<
  FetchAppointmentsMonthAvailabilityUseCaseError,
  { day: number; available: boolean }[]
>

@Injectable()
export class FetchAppointmentsMonthAvailabilityUseCase {
  constructor(
    private appointmentsRepository: AppointmentsRepository,
    private servicesRepository: ServicesRepository,
  ) {}

  async execute({
    month,
    year,
  }: FetchAppointmentsMonthAvailabilityUseCaseRequest): Promise<FetchAppointmentsMonthAvailabilityUseCaseResponse> {
    try {
      const appointments =
        await this.appointmentsRepository.findAvailableMonthTimeSlots({
          month,
          year,
        })

      const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1))

      const eachDayArray = Array.from(
        {
          length: numberOfDaysInMonth,
        },
        (_, index) => index + 1,
      )

      const availability = eachDayArray.map((day) => {
        const compareDate = new Date(year, month - 1, day, 23, 59, 59)

        const appointmentsInDay = appointments.filter((appointment) => {
          return getDate(appointment.date) === day
        })

        return {
          day,
          available:
            isAfter(compareDate, new Date()) && appointmentsInDay.length < 10,
        }
      })

      return right(availability)
    } catch (error) {
      return left({ message: "Error fetching appointments availability." })
    }
  }
}
