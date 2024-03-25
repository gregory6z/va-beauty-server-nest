// import { InMemoryClientsRepository } from "test/repositories/in-memory-clients-repository"
// import { EditClientUseCase } from "./edit-client"
// import { makeClient } from "test/factures/make-client"
// import { Left } from "@/core/either"
// import { BadRequestException } from "@nestjs/common"
// import { Client } from "../../enterprise/entities/client"
// import { Entity } from "@/core/entities/entity"

// let inMemoryClientRepository: InMemoryClientsRepository
// let sut: EditClientUseCase

// describe("Edit client use case", () => {
//   beforeEach(() => {
//     inMemoryClientRepository = new InMemoryClientsRepository()
//     sut = new EditClientUseCase(inMemoryClientRepository, encrypter)
//   })

//   it("should be able to edit a client", async () => {
//     // Arrange
//     const client = makeClient()
//     inMemoryClientRepository.items.push(client)

//     const newName = "New Name"
//     const newEmail = "newemail@example.com"
//     const newPassword = "newpassword"
//     const newTelephone = "newtelephone"

//     const originalClientId = client.id.toString()

//     // Act
//     const response = await sut.execute({
//       clientId: client.id.toString(),
//       name: newName,
//       email: newEmail,
//       password: newPassword,
//       telephone: newTelephone,
//     })

//     console.log(response)

//     // Assert
//     const updatedClient = inMemoryClientRepository.items.find(
//       (client) => client.id.toString() === originalClientId,
//     )

//     console.log(updatedClient)

//     expect(updatedClient?.name).toEqual(newName)
//     expect(updatedClient?.email).toEqual(newEmail)
//     expect(updatedClient?.password).toEqual(newPassword)
//     expect(updatedClient?.telephone).toEqual(newTelephone)
//   })
// })
