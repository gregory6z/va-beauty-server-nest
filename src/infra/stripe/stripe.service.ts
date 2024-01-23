// stripe.service.ts
import { Injectable } from "@nestjs/common"
import { Stripe } from "stripe"
import { PrismaService } from "../database/prisma/prisma.service"
import { Service } from "@/domain/beauty-salon/enterprise/entities/service"

@Injectable()
export class StripeService {
  private readonly stripe: Stripe

  constructor(private readonly prismaService: PrismaService) {
    this.stripe = new Stripe(
      "sk_test_51LgShvK3dCvt5LZgmzRDfvTXCTzj6oRiWXjsVeiHGMiuuwpPyt9HyaYucnsRBSExTKtcMvxcstFJ2QuJBX5lmFLH00pqAX28PN",
      // Versão da API do Stripe
    )
  }

  async fetchAndSaveServices(): Promise<any> {
    try {
      // Buscar serviços do Stripe
      const stripeServices = await this.stripe.products.list()

      await Promise.all(
        stripeServices.data.map(async (stripeService) => {
          const price = stripeService.default_price as Stripe.Price

          // Verificar se o serviço já existe no banco de dados
          const existingService = await this.prismaService.service.findUnique({
            where: { stripeId: stripeService.id },
          })

          if (!existingService) {
            const service = Service.create({
              name: stripeService.name,
              stripeId: stripeService.id,
              description: stripeService.description || "",
              duration: Number(stripeService.metadata.duration),
              price: Number(price.unit_amount),
              imgUrl: stripeService.images,
              category: stripeService.metadata.category,
              // Mapeie as outras propriedades do serviço conforme necessário
            })

            // Salve a instância da entidade Service no banco de dados usando Prisma
            await this.prismaService.service.create({
              data: {
                name: service.name,
                category: service.category,
                stripeId: service.stripeId,
                description: service.description,
                price: Number(service.price) || 10,
                duration: service.duration,
                slug: service.slug,
                imgUrl: service.imgUrl,
                // Mapeie outras propriedades do banco de dados conforme necessário
              },
            })
          }
        }),
      )
    } catch (error) {
      console.error("Erro ao buscar/salvar serviços do Stripe:", error)
      throw error
    }
  }
}
