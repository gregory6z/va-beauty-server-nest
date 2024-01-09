import { UniqueEntityID } from "@/core/entities/unique-entity-id"
import {
  Appointment,
  AppointmentProps,
} from "@/domain/beauty-salon/enterprise/entities/appointment"

import { faker } from "@faker-js/faker"
import { makeService } from "./make-service"
import { InMemoryServiceRepository } from "test/repositories/in-memory-services-repository"

export function makeAppointment(
  override: Partial<AppointmentProps> = {},
  id?: UniqueEntityID,
) {
  const appointment = Appointment.create(
    {
      clientId: new UniqueEntityID(),
      date: new Date(2025, 3, 26, 12, 0, 0),
      services: [],
      ...override,
    },
    id,
  )

  return appointment
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
