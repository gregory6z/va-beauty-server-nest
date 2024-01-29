// clerk.module.ts
import { Module, DynamicModule } from "@nestjs/common"
import { ClerkService } from "./clerk.service"
import { ClerkAuthGuard } from "./clerk.guard"

@Module({})
export class ClerkModule {
  static configure(apiKey: string, publicKey: string): DynamicModule {
    return {
      module: ClerkModule,
      providers: [
        {
          provide: "CLERK_API_KEY",
          useValue: apiKey,
        },
        {
          provide: "CLERK_PUBLIC_KEY",
          useValue: publicKey,
        },
        ClerkService,
        AuthGuard,
      ],
      exports: [ClerkService, ClerkAuthGuard],
    }
  }
}
