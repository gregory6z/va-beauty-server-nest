// auth.guard.ts
import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common"
import { ClerkService } from "./clerk.service"

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly clerkService: ClerkService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    const publicKey =
      "https://secure-monkey-1.clerk.accounts.dev/.well-known/jwks.json" // Substitua pela sua chave pública do Clerk
    const cookies = request.cookies
    const sessToken = cookies.__session
    const token = request.headers.authorization

    if (sessToken === undefined && token === undefined) {
      return false
    }

    try {
      let decoded = ""
      if (token) {
        decoded = this.clerkService.verifyJwtToken(token, publicKey)
      } else {
        decoded = this.clerkService.verifyJwtToken(sessToken, publicKey)
      }

      // O token é válido, continue com a lógica do seu aplicativo
      request.user = decoded // Adicione o usuário decodificado ao objeto de solicitação

      console.log(request.user)
      return true
    } catch (error) {
      return false
    }
  }
}
