import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

import { EnvService } from "./infra/env/env.service"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const configService = app.get(EnvService)
  const port = configService.get("PORT")
  const host = "RENDER" in process.env ? "0.0.0.0" : "localhost"

  await app.listen(port, host)
}
bootstrap()
