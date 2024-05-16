import { Encrypter } from "@/domain/beauty-salon/aplication/cryptography/encrypter"
import { Injectable } from "@nestjs/common"
import { JwtService } from "@nestjs/jwt"

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private jwtService: JwtService) {}

  decrypt(token: string): Promise<Record<string, unknown>> {
    return this.jwtService.verifyAsync(token)
  }

  encrypt(payload: Record<string, unknown>): Promise<string> {
    return this.jwtService.signAsync(payload)
  }
}
