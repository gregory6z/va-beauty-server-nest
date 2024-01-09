import { makeService } from "test/factures/make-service"
import { InMemoryAppointmentRepository } from "test/repositories/in-memory-appointments-repository"
import { CreateAppointmentUseCase } from "./create-appointent"
import { InMemoryServiceRepository } from "test/repositories/in-memory-services-repository"

let inMemoryAppointmentRepository: InMemoryAppointmentRepository
let inMemoryServicesRepository: InMemoryServiceRepository
let sut: CreateAppointmentUseCase

describe("Create Appointment", () => {
  beforeEach(() => {
    inMemoryAppointmentRepository = new InMemoryAppointmentRepository()
    inMemoryServicesRepository = new InMemoryServiceRepository()

    sut = new CreateAppointmentUseCase(
      inMemoryAppointmentRepository,
      inMemoryServicesRepository,
    )
  })

  it("should be able to create a appointment", async () => {
    const service1 = makeService()

    inMemoryServicesRepository.items.push(service1)

    const result = await sut.execute({
      clientId: "clientTest",
      services: [service1.id.toString()],
      date: new Date("December 17, 2200 10:24:00"),
    })

    expect(result.isRight()).toBe(true)
  })

  it("should be possible to create appointments with one or more services.", async () => {
    const service1 = makeService()
    const service2 = makeService()

    inMemoryServicesRepository.items.push(service1, service2)

    const result = await sut.execute({
      clientId: "clientTest",
      services: [service1.id.toString(), service2.id.toString()],
      date: new Date("December 17, 2200 10:24:00"),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAppointmentRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          services: [service1.id.toString(), service2.id.toString()],
        }),
      ]),
    )
  })

  it("should not be possible to schedule an appointment with a nonexistent or null service.", async () => {
    const result = await sut.execute({
      clientId: "clientTest",
      services: ["non-existent service"],
      date: new Date("December 17, 2200 03:24:00"),
    })

    expect(result.isLeft()).toBe(true)
  })

  it("should not be able to create a appointment to on the day that has already passed.", async () => {
    const service1 = makeService()

    inMemoryServicesRepository.items.push(service1)

    const result = await sut.execute({
      clientId: "clientTest",
      services: [service1.id.toString()],
      date: new Date("December 17, 1999 10:24:00"),
    })

    expect(result.isLeft()).toBe(true)
  })

  it("should not be able to create a appointment to on before opening hours.", async () => {
    const service1 = makeService()

    inMemoryServicesRepository.items.push(service1)

    const result = await sut.execute({
      clientId: "clientTest",
      services: [service1.id.toString()],
      date: new Date("December 17, 2025 03:00:00"),
    })

    expect(result.isLeft()).toBe(true)
  })

  it("should not be able to create a appointment to on after opening hours.", async () => {
    const service1 = makeService()

    inMemoryServicesRepository.items.push(service1)

    const result = await sut.execute({
      clientId: "clientTest",
      services: [service1.id.toString()],
      date: new Date("December 17, 2025 22:00:00"),
    })

    expect(result.isLeft()).toBe(true)
  })
})
