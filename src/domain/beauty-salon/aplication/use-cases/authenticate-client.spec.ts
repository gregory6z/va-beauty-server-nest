import { FakeEncrypter } from "test/cryptography/fake-encrypter"
import { FakeHasher } from "test/cryptography/fake-hasher"
import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository"
import { makeClient } from "test/factures/make-client"
import { AuthenticateClientUseCase } from "./authenticate-client"

let inMemoryClientsRepository: InMemoryClientsRepository
let fakeHasher: FakeHasher
let encrypter: FakeEncrypter

let sut: AuthenticateClientUseCase

describe("Authenticate Client", () => {
  beforeEach(() => {
    inMemoryClientsRepository = new InMemoryClientsRepository()
    fakeHasher = new FakeHasher()
    encrypter = new FakeEncrypter()

    sut = new AuthenticateClientUseCase(
      inMemoryClientsRepository,
      fakeHasher,
      encrypter,
    )
  })

  it("should be able to authenticate a client", async () => {
    const client = makeClient({
      email: "johndoe@example.com",
      password: await fakeHasher.hash("123456"),
    })

    inMemoryClientsRepository.items.push(client)

    const result = await sut.execute({
      email: "johndoe@example.com",
      password: "123456",
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    })
  })
})
