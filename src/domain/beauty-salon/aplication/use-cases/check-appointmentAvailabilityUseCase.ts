import * as dayjs from "dayjs"
import { AppointmentsRepository } from "../../repositories/appointments-repository"
import { ServicesRepository } from "../../repositories/services-repository"
import { Injectable } from "@nestjs/common"

const SLOT_TIME = 15 // slots  15 minutes
const BREAK_TIME = 720 // 12 h
const DURATION_BREAK_TIME = 60 // min

@Injectable()
export class CheckAppointmentAvailabilityUseCase {
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

  public async execute(date: Date): Promise<boolean> {
    const allAppointments = await this.fetchAppointments()
    const appointmentsForDay = allAppointments.filter((appointment) =>
      dayjs(appointment.date).isSame(date, "day"),
    )

    const durationOfService =
      await this.calculateServiceDuration(appointmentsForDay)
    const startTimes = this.extractStartTimes(appointmentsForDay)
    const arrayOfAppointments = this.buildArrayOfAppointments(
      startTimes,
      durationOfService,
    )

    const appointmentMinute = date.getMinutes()
    const hasAppointmentInMinute =
      arrayOfAppointments.includes(appointmentMinute)

    return !hasAppointmentInMinute
  }
}
