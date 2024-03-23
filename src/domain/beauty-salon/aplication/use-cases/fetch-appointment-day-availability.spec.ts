// import { InMemoryAppointmentRepository } from "./../../../../../test/repositories/in-memory-appointments-repository"
// import { InMemoryServiceRepository } from "test/repositories/in-memory-services-repository"
// import { FetchAppointmentsDayAvailabilityUseCase } from "./fetch-appointment-day-availability"
// import { makeAppointment } from "test/factures/make-appointments"
// import { makeService } from "test/factures/make-service"

// let inMemoryServiceRepository: InMemoryServiceRepository
// let inMemoryAppointmentRepository: InMemoryAppointmentRepository
// let sut: FetchAppointmentsDayAvailabilityUseCase

// describe("Fetch appointment day availability", () => {
//   beforeEach(() => {
//     inMemoryServiceRepository = new InMemoryServiceRepository()
//     inMemoryAppointmentRepository = new InMemoryAppointmentRepository()

//     sut = new FetchAppointmentsDayAvailabilityUseCase(
//       inMemoryAppointmentRepository,
//       inMemoryServiceRepository,
//     )
//   })

//   it("should be able fetch to day available", async () => {
//     const service1 = makeService()
//     const service2 = makeService()

//     inMemoryServiceRepository.items.push(service1, service2)

//     const appointment1 = makeAppointment({
//       date: new Date(Date.UTC(2025, 3, 26, 7, 0, 0)),
//       servicesIds: [service1.stripeId.toString(), service2.stripeId.toString()],
//     })

//     const appointment2 = makeAppointment({
//       date: new Date(Date.UTC(2025, 3, 26, 15, 0, 0)),
//       servicesIds: [service1.stripeId.toString(), service2.stripeId.toString()],
//     })

//     inMemoryAppointmentRepository.items.push(appointment1, appointment2)

//     const result = await sut.execute({
//       day: 26,
//       month: 4,
//       year: 2025,
//     })

//     expect(result.isRight()).toBe(true)
//   })
// })
