import { Appointment } from "../enterprise/entities/appointment"

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
  abstract findById(appointmentId: string): Promise<Appointment | null>
  abstract findAvailableDayTimeSlots({
    day,
    month,
    year,
  }: findAvailableDayTimeSlotsProps): Promise<Appointment[]>

  abstract findAvailableMonthTimeSlots({
    month,
    year,
  }: findAvailableMonthTimeSlotsProps): Promise<Appointment[]>
}
