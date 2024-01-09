import { InMemoryAppointmentRepository } from "./../../../../../test/repositories/in-memory-appointments-repository"
import { InMemoryServiceRepository } from "test/repositories/in-memory-services-repository"
import { makeAppointment } from "test/factures/make-appointments"
import { makeService } from "test/factures/make-service"
import { FetchAppointmentsMonthAvailabilityUseCase } from "./fetch-appointment-month-availability"

let inMemoryServiceRepository: InMemoryServiceRepository
let inMemoryAppointmentRepository: InMemoryAppointmentRepository
let sut: FetchAppointmentsMonthAvailabilityUseCase

describe("Create Service", () => {
  beforeEach(() => {
    inMemoryServiceRepository = new InMemoryServiceRepository()
    inMemoryAppointmentRepository = new InMemoryAppointmentRepository()

    sut = new FetchAppointmentsMonthAvailabilityUseCase(
      inMemoryAppointmentRepository,
      inMemoryServiceRepository,
    )
  })

  it("should be able fetch to month available", async () => {
    const service1 = makeService()
    const service2 = makeService()

    inMemoryServiceRepository.items.push(service1, service2)

    const appointment1 = makeAppointment({
      date: new Date(Date.UTC(2025, 3, 26, 7, 0, 0)),
      services: [service1.id.toString(), service2.id.toString()],
    })

    const appointment2 = makeAppointment({
      date: new Date(Date.UTC(2025, 3, 26, 15, 0, 0)),
      services: [service1.id.toString(), service2.id.toString()],
    })

    inMemoryAppointmentRepository.items.push(appointment1, appointment2)

    const result = await sut.execute({
      month: 4,
      year: 2025,
    })

    expect(result.isRight()).toBe(true)
  })
})
