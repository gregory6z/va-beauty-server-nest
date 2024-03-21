import { InMemoryAppointmentRepository } from "./../../../../../test/repositories/in-memory-appointments-repository"
import { makeAppointment } from "test/factures/make-appointments"
import { EditAppointmentUseCase } from "./edit-date-appointment"
import { Left } from "@/core/either"
import { BadRequestException } from "@nestjs/common"

let inMemoryAppointmentRepository: InMemoryAppointmentRepository
let sut: EditAppointmentUseCase

describe("Edit appointment use case", () => {
  beforeEach(() => {
    inMemoryAppointmentRepository = new InMemoryAppointmentRepository()
    sut = new EditAppointmentUseCase(inMemoryAppointmentRepository)
  })

  it("should be able to edit an appointment date", async () => {
    const appointment = makeAppointment({
      date: new Date(Date.UTC(2025, 3, 26, 7, 0, 0)),
    })

    inMemoryAppointmentRepository.items.push(appointment)

    const newDate = new Date(Date.UTC(2025, 3, 27, 7, 0, 0))
    await sut.execute({
      appointmentId: appointment.id.toString(),
      date: newDate,
    })

    const updatedAppointment = await inMemoryAppointmentRepository.findById(
      appointment.id.toString(),
    )
    expect(updatedAppointment?.date).toEqual(newDate)
  })

  it("should return a Left with BadRequestException if appointment does not exist", async () => {
    const result = await sut.execute({
      appointmentId: "nonexistent-id",
      date: new Date(),
    })

    expect(result).toBeInstanceOf(Left)
    if (result instanceof Left) {
      expect(result.value).toBeInstanceOf(BadRequestException)
    }
  })
})
