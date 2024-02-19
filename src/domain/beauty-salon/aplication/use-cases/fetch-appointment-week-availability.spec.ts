import { InMemoryAppointmentRepository } from "./../../../../../test/repositories/in-memory-appointments-repository"
import { InMemoryServiceRepository } from "test/repositories/in-memory-services-repository"
import { makeAppointment } from "test/factures/make-appointments"
import { makeService } from "test/factures/make-service"
import { FetchAppointmentsWeekAvailabilityUseCase } from "./fetch-appoitnment-week-availability"

let inMemoryServiceRepository: InMemoryServiceRepository
let inMemoryAppointmentRepository: InMemoryAppointmentRepository
let sut: FetchAppointmentsWeekAvailabilityUseCase

describe("Fetch appointment week availability", () => {
  beforeEach(() => {
    inMemoryServiceRepository = new InMemoryServiceRepository()
    inMemoryAppointmentRepository = new InMemoryAppointmentRepository()

    sut = new FetchAppointmentsWeekAvailabilityUseCase(
      inMemoryAppointmentRepository,
      inMemoryServiceRepository,
    )
  })

  it("should be able to fetch availability for a given number of weeks", async () => {
    const service1 = makeService()
    const service2 = makeService()

    inMemoryServiceRepository.items.push(service1, service2)

    // Making appointments for different days of the week
    const appointments = [
      makeAppointment({
        date: new Date(Date.UTC(2025, 3, 26, 7, 0, 0)), // Monday
        servicesIds: [
          service1.stripeId.toString(),
          service2.stripeId.toString(),
        ],
      }),
      makeAppointment({
        date: new Date(Date.UTC(2025, 3, 27, 15, 0, 0)), // Tuesday
        servicesIds: [
          service1.stripeId.toString(),
          service2.stripeId.toString(),
        ],
      }),
      makeAppointment({
        date: new Date(Date.UTC(2025, 3, 28, 9, 0, 0)), // Wednesday
        servicesIds: [
          service1.stripeId.toString(),
          service2.stripeId.toString(),
        ],
      }),
      makeAppointment({
        date: new Date(Date.UTC(2025, 3, 29, 12, 0, 0)), // Thursday
        servicesIds: [
          service1.stripeId.toString(),
          service2.stripeId.toString(),
        ],
      }),
      makeAppointment({
        date: new Date(Date.UTC(2025, 3, 30, 10, 0, 0)), // Friday
        servicesIds: [
          service1.stripeId.toString(),
          service2.stripeId.toString(),
        ],
      }),
      makeAppointment({
        date: new Date(Date.UTC(2025, 4, 1, 8, 0, 0)), // Saturday
        servicesIds: [
          service1.stripeId.toString(),
          service2.stripeId.toString(),
        ],
      }),
      makeAppointment({
        date: new Date(Date.UTC(2025, 4, 2, 11, 0, 0)), // Sunday
        servicesIds: [
          service1.stripeId.toString(),
          service2.stripeId.toString(),
        ],
      }),
    ]

    inMemoryAppointmentRepository.items.push(...appointments)

    const numberOfWeeks = 6 // Number of weeks to fetch

    const result = await sut.execute({
      startDay: 26, // Monday
      month: 4,
      year: 2025,
      numberOfWeeks,
    })

    console.log(result)

    expect(result.isRight()).toBe(true)

    // Test other assertions as needed to verify the correctness of the result
  })
})
