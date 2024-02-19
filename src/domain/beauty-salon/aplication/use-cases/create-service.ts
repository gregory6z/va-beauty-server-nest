import { Either, right } from "@/core/either"
import { Service } from "../../enterprise/entities/service"
import { Injectable } from "@nestjs/common"
import { ServicesRepository } from "../../repositories/services-repository"

interface CreateServiceUseCaseRequest {
  name: string
  stripeId: string
  description: string
  category: string
  price: number
  duration: number
  imgUrl: string[]
}

type CreateServiceUseCaseResponse = Either<
  null,
  {
    service: Service
  }
>

@Injectable()
export class CreateServiceUseCase {
  constructor(private servicesRepository: ServicesRepository) {}

  async execute({
    name,
    description,
    category,
    price,
    duration,
    stripeId,
    // eslint-disable-next-line camelcase
    imgUrl,
  }: CreateServiceUseCaseRequest): Promise<CreateServiceUseCaseResponse> {
    const service = Service.create({
      name,
      stripeId,
      description,
      category,
      price,
      duration,
      // eslint-disable-next-line camelcase
      imgUrl,
    })

    await this.servicesRepository.create(service)

    return right({
      service,
    })
  }
}
