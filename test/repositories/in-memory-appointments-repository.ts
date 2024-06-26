import { Appointment } from "@/domain/beauty-salon/enterprise/entities/appointment"
import {
  AppointmentsRepository,
  UpdateAppointmentProps,
  findAvailableDayTimeSlotsProps,
  findAvailableMonthTimeSlotsProps,
} from "@/domain/beauty-salon/repositories/appointments-repository"

export class InMemoryAppointmentRepository implements AppointmentsRepository {
  public items: Appointment[] = []

  async delete(appointmentId: string): Promise<void> {
    this.items = this.items.filter(
      (appointment) => appointment.id.toString() !== appointmentId,
    )
    return Promise.resolve()
  }

  async findByClientId(clientId: string): Promise<Appointment[]> {
    const clientAppointments = this.items.filter(
      (appointment) => appointment.clientId === clientId,
    )
    return Promise.resolve(clientAppointments)
  }

  async update({ appointmentId, date }: UpdateAppointmentProps): Promise<void> {
    const appointment = this.items.find(
      (a) => a.id.toString() === appointmentId,
    )
    if (appointment) {
      appointment.date = date
    }
  }

  async findManyAppointmentsByUserId(userId: string): Promise<Appointment[]> {
    const appointments = this.items.filter(
      (item) => item.clientId.toString() === userId,
    )

    return appointments
  }

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
