import { Controller, Get, Query, Redirect, Headers } from "@nestjs/common"
import { AuthService } from "./auth.service"

@Controller("auth/magiclink")
export class AuthControllerMagicLink {
  constructor(private readonly authService: AuthService) {}

  @Get()
  @Redirect("/") // Redireciona para a página principal após a autenticação
  async authenticate(
    @Query("token") temporaryToken: string,
    @Headers() headers: any,
  ) {
    // Verifique se o token temporário foi fornecido
    if (!temporaryToken) {
      // Caso contrário, redirecione para uma página de erro
      return { statusCode: 400, url: "/error" }
    }

    // Autentique o usuário usando o token temporário
    const accessToken =
      await this.authService.authenticateWithTemporaryToken(temporaryToken)

    // Se a autenticação for bem-sucedida, adicione o access token nos headers
    if (accessToken) {
      headers.authorization = `Bearer ${accessToken}`
    } else {
      // Caso contrário, redirecione para uma página de erro
      return { statusCode: 401, url: "/error" }
    }
  }
}
