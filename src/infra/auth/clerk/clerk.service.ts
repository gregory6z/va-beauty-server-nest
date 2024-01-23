// clerk.service.ts
import { Injectable, Inject } from "@nestjs/common"
import clerkClient, { Clerk } from "@clerk/clerk-sdk-node"

@Injectable()
export class ClerkService {
  constructor(
    @Inject("CLERK_API_KEY") private readonly apiKey: string,
    @Inject("CLERK_PUBLIC_KEY") private readonly publicKey: string,
  ) {
    Clerk({
      apiKey: this.apiKey,
      jwtKey: this.publicKey,
    })
  }

  verifyJwtToken(token: string, publicKey: string): any {
    try {
      const decoded = clerkClient.sessions.verifySession(token, publicKey)
      return decoded
    } catch (error) {
      throw new Error("Invalid Token")
    }
  }

  getUserById(userId: string): any {
    try {
      const user = clerkClient.users.getUser(userId)
      return user
    } catch (error) {
      throw new Error("Failed to retrieve user")
    }
  }
}
