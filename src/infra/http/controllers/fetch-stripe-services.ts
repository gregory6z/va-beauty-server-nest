// stripe.controller.ts
import { StripeService } from "@/infra/stripe/stripe.service"
import { Controller, Get } from "@nestjs/common"
import { Public } from "@/infra/auth/public"

@Controller("/stripe")
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Public()
  @Get("sync-services")
  async syncServices(): Promise<any> {
    try {
      // Chame o serviço para buscar e salvar serviços do Stripe
      await this.stripeService.fetchAndSaveServices()

      return {
        success: true,
        message: "Serviços do Stripe sincronizados com sucesso.",
      }
    } catch (error) {
      // Lide com erros
      console.error("Erro ao sincronizar serviços do Stripe:", error)
      return {
        success: false,
        message: "Erro ao sincronizar serviços do Stripe.",
      }
    }
  }
}
