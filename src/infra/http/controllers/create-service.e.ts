// import { AppModule } from "@/app.module"
// import { DatabaseModule } from "@/infra/database/database.module"
// import { PrismaService } from "@/infra/database/prisma/prisma.service"
// import { INestApplication } from "@nestjs/common"
// import { Test } from "@nestjs/testing"
// import request from "supertest"

// describe("Create Service (E2E)", () => {
//   let app: INestApplication
//   let prisma: PrismaService

//   // let jwt: JwtService

//   beforeAll(async () => {
//     const moduleRef = await Test.createTestingModule({
//       imports: [AppModule, DatabaseModule],
//       providers: [],
//     }).compile()

//     app = moduleRef.createNestApplication()

//     prisma = moduleRef.get(PrismaService)

//     await app.init()
//   })

//   test("[POST] /services", async () => {
//     // const user = await studentFactory.makePrismaStudent()

//     // const accessToken = jwt.sign({ sub: user.id.toString() })

//     const response = await request(app.getHttpServer())
//       .post("/services")
//       // .set("Authorization", `Bearer ${accessToken}`)
//       .send({
//         category: "ola",
//         description: "teste",
//         name: "nome",
//         duration: 30,
//         imgUrl: ["img-1"],
//         price: 50,
//         stripeId: "stripe-id",
//       })

//     expect(response.statusCode).toBe(200)

//     //   const questionOnDatabase = await prisma.question.findFirst({
//     //     where: {
//     //       title: "New question",
//     //     },
//     //   })

//     //   expect(questionOnDatabase).toBeTruthy()

//     //   const attachmentsOnDatabase = await prisma.attachment.findMany({
//     //     where: {
//     //       questionId: questionOnDatabase?.id,
//     //     },
//     //   })

//     //   expect(attachmentsOnDatabase).toHaveLength(2)
//   })
// })
