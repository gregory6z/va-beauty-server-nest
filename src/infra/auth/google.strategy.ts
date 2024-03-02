import { Injectable } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { Strategy } from "passport-google-token"
import { EnvService } from "../env/env.service"

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google-token") {
  constructor(private readonly config: EnvService) {
    super({
      clientID: config.get("GOOGLE_CLIENT_ID"),
      clientSecret: config.get("GOOGLE_CLIENT_SECRET"),
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // Aqui você pode verificar o usuário com base no perfil fornecido pelo Google
    // O accessToken é o token de acesso fornecido pelo Google
    // O refreshToken é um token opcional que pode ser usado para obter um novo accessToken quando expirar

    // Exemplo de como você pode retornar um usuário válido, ou lançar um erro se a validação falhar
    const user = {
      id: profile.id,
      email: profile.emails ? profile.emails[0].value : null,
      // Outros campos do usuário que você deseja incluir
    }

    // Retorne apenas o ID na payload
    return { sub: user.id }
  }
}
