import { Appointment } from "../enterprise/entities/appointment"

export interface UpdateAppointmentProps {
  appointmentId: string
  date: Date
}

export interface findAvailableDayTimeSlotsProps {
  day: number
  month: number
  year: number
}
export interface findAvailableMonthTimeSlotsProps {
  month: number
  year: number
}

export abstract class AppointmentsRepository {
  abstract create(appointment: Appointment): Promise<void>
  abstract update(props: UpdateAppointmentProps): Promise<void>

  abstract findManyAppointmentsByUserId(
    clientId: string,
  ): Promise<Appointment[]>

  abstract findById(appointmentId: string): Promise<Appointment | null>
  abstract findAvailableDayTimeSlots({
    day,
    month,
    year,
  }: findAvailableDayTimeSlotsProps): Promise<Appointment[]>

  abstract findFutureAppointments(): Promise<Appointment[]>

  abstract findAvailableMonthTimeSlots({
    month,
    year,
  }: findAvailableMonthTimeSlotsProps): Promise<Appointment[]>
}
