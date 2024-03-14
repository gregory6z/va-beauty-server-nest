import { AppModule } from "@/app.module"
import { DatabaseModule } from "@/infra/database/database.module"
import { INestApplication } from "@nestjs/common"
import { Test } from "@nestjs/testing"
import request from "supertest"
import { ServiceFactory } from "test/factures/make-service"

describe("Create Appointment (E2E)", () => {
  let app: INestApplication

  let serviceFactory: ServiceFactory

  // let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [ServiceFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    serviceFactory = moduleRef.get(ServiceFactory)
    // prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test("[POST] /appointments", async () => {
    // const user = await studentFactory.makePrismaStudent()

    // const accessToken = jwt.sign({ sub: user.id.toString() })

    const service1 = await serviceFactory.makePrismaService({
      stripeId: "stripeId-1",
    })

    const service2 = await serviceFactory.makePrismaService({
      stripeId: "stripeId-2",
    })

    // const service2 = await serviceFactory.makePrismaService({
    //   stripeId: "stripeId-2",
    // })

    const response = await request(app.getHttpServer())
      .post("/appointments")
      // .set("Authorization", `Bearer ${accessToken}`)
      .send({
        servicesIds: [service1.stripeId, service2.stripeId],
        date: new Date(2025, 3, 26, 12, 0, 0),
      })

    expect(response.statusCode).toBe(201)

    //   const questionOnDatabase = await prisma.question.findFirst({
    //     where: {
    //       title: "New question",
    //     },
    //   })

    //   expect(questionOnDatabase).toBeTruthy()

    //   const attachmentsOnDatabase = await prisma.attachment.findMany({
    //     where: {
    //       questionId: questionOnDatabase?.id,
    //     },
    //   })

    //   expect(attachmentsOnDatabase).toHaveLength(2)
  })
})
