import { Appointment } from "@/domain/beauty-salon/enterprise/entities/appointment"

export class AppointmentPresenter {
  static toHTTP(appointment: Appointment) {
    return {
      id: appointment.id.toString(),
      date: appointment.date,
      services: appointment.servicesIds,
      isSubscription: appointment.isSubscription,
      createdAt: appointment.createdAt,
      updatedAt: appointment.updatedAt,
    }
  }
}
