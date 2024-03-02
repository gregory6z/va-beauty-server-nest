import { Encrypter } from "@/domain/beauty-salon/aplication/cryptography/encrypter"

export class FakeEncrypter implements Encrypter {
  async encrypt(payload: Record<string, unknown>): Promise<string> {
    return JSON.stringify(payload)
  }
}
