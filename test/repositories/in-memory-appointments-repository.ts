import { Appointment } from "@/domain/beauty-salon/enterprise/entities/appointment"
import {
  AppointmentsRepository,
  findAvailableDayTimeSlotsProps,
  findAvailableMonthTimeSlotsProps,
} from "@/domain/beauty-salon/repositories/appointments-repository"

export class InMemoryAppointmentRepository implements AppointmentsRepository {
  public items: Appointment[] = []

  async findById(appointmentId: string) {
    const client = this.items.find(
      (item) => item.id.toString() === appointmentId,
    )

    if (!client) {
      return null
    }

    return client
  }

  async create(appointment: Appointment) {
    this.items.push(appointment)
  }

  async findAvailableDayTimeSlots({
    day,
    month,
    year,
  }: findAvailableDayTimeSlotsProps): Promise<Appointment[]> {
    const filteredAppointments = this.items.filter((appointment) => {
      const appointmentDay = appointment.date.getDate()
      const appointmentMonth = appointment.date.getMonth() + 1
      const appointmentYear = appointment.date.getFullYear()

      return (
        appointmentDay === day &&
        appointmentMonth === month &&
        appointmentYear === year
      )
    })

    return filteredAppointments
  }

  async findFutureAppointments(): Promise<Appointment[]> {
    const now = new Date()
    const futureAppointments = this.items.filter((appointment) => {
      return appointment.date > now
    })

    return futureAppointments
  }

  async findAvailableMonthTimeSlots({
    month,
    year,
  }: findAvailableMonthTimeSlotsProps): Promise<Appointment[]> {
    const filteredAppointments = this.items.filter((appointment) => {
      const appointmentMonth = appointment.date.getMonth() + 1
      const appointmentYear = appointment.date.getFullYear()

      return appointmentMonth === month && appointmentYear === year
    })

    return filteredAppointments
  }
}
