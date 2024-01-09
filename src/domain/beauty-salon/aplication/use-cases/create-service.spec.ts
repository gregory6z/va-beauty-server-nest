import { InMemoryServiceRepository } from "test/repositories/in-memory-services-repository"
import { CreateServiceUseCase } from "./create-service"

let inMemoryServiceRepository: InMemoryServiceRepository
let sut: CreateServiceUseCase

describe("Create Service", () => {
  beforeEach(() => {
    inMemoryServiceRepository = new InMemoryServiceRepository()

    sut = new CreateServiceUseCase(inMemoryServiceRepository)
  })

  it("should be able to create a service", async () => {
    const result = await sut.execute({
      name: "Gregory",
      description: "description",
      category: "category",
      price: 40,
      duration: 30,
      img_url: "url",
    })

    expect(result.isRight()).toBe(true)
  })
})
