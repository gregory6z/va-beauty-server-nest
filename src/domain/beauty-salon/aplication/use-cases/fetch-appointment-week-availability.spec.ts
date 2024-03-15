import { InMemoryServiceRepository } from "../../../../../test/repositories/in-memory-services-repository"
import { InMemoryAppointmentRepository } from "../../../../../test/repositories/in-memory-appointments-repository"
import { FetchAppointmentsWeekAvailabilityUseCase } from "./fetch-appointment-week-availability"
import { makeService } from "test/factures/make-service"
import { makeAppointment } from "test/factures/make-appointments"

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

    const result = await sut.execute()

    expect(result.isLeft()).toBe(true)
    // Adicione as expectativas adicionais com base no comportamento esperado do seu caso de uso
  })
  it("should reflect new appointments in the availability", async () => {
    const service1 = makeService()
    const service2 = makeService()
    // Primeiro, execute o método sem o novo agendamento
    let result = await sut.execute()

    // Verifique a disponibilidade inicial
    expect(result.isLeft()).toBe(false)
    const initialAvailability = result.value
    expect(initialAvailability).toEqual(expect.any(Array))

    // Agora, adicione um novo agendamento
    const newAppointment = makeAppointment({
      date: new Date(Date.UTC(2025, 3, 26, 7, 0, 0)), // Segunda-feira
      servicesIds: [service1.stripeId.toString(), service2.stripeId.toString()],
    })
    inMemoryAppointmentRepository.items.push(newAppointment)

    // Execute o método novamente
    result = await sut.execute()

    // Verifique a nova disponibilidade
    expect(result.isLeft()).toBe(false)
    const newAvailability = result.value
    expect(newAvailability).toEqual(expect.any(Array))

    // A disponibilidade deve ter mudado
    expect(newAvailability).not.toEqual(initialAvailability)
  })
})
