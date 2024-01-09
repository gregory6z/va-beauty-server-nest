import { UniqueEntityID } from "@/core/entities/unique-entity-id"

import {
  Service,
  ServiceProps,
} from "@/domain/beauty-salon/enterprise/entities/service"
import { faker } from "@faker-js/faker"

export function makeService(
  override: Partial<ServiceProps> = {},
  id?: UniqueEntityID,
) {
  const service = Service.create(
    {
      name: faker.person.fullName(),
      category: faker.lorem.sentence(),
      description: faker.lorem.sentence(),
      duration: 30,
      price: 20,
      img_url: faker.lorem.sentence(),
      ...override,
    },
    id,
  )

  return service
}

// @Injectable()
// export class StudentFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaStudent(data: Partial<StudentProps> = {}): Promise<Student> {
//     const student = makeStudent(data)

//     await this.prisma.user.create({
//       data: PrismaStudentMapper.toPrisma(student),
//     })

//     return student
//   }
// }
