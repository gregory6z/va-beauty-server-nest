import { Injectable, UnauthorizedException } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"
import { UserPayload } from "./jwt.strategy"

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  // Método para autenticar o usuário com um token JWT
  async authenticateWithJWT(token: string): Promise<UserPayload> {
    try {
      // Validar e decodificar o token JWT usando o serviço JwtService
      const payload = this.jwtService.verify(token)
      return payload
    } catch (error) {
      // Se ocorrer algum erro na validação do token, lançar uma exceção de não autorizado
      throw new UnauthorizedException("Invalid JWT token")
    }
  }

  async authenticateWithTemporaryToken(
    temporaryToken: string,
  ): Promise<string> {
    // Simulação de validação do token temporário
    const isValidTemporaryToken = temporaryToken === "fake-temporary-token"

    // Verifique se o token temporário é válido
    if (!isValidTemporaryToken) {
      // Se o token temporário for inválido, lança uma exceção de não autorizado
      throw new UnauthorizedException("Invalid temporary token")
    }

    // Se o token temporário for válido, gere um token JWT com o payload do usuário
    const userPayload = { userId: "user-id-from-temporary-token" } // Aqui você pode incluir mais informações do usuário
    const accessToken = this.jwtService.sign(userPayload)

    // Retorne o token JWT gerado
    return accessToken
  }
}
