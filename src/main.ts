import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"

import * as express from "express"
import { ExpressAdapter } from "@nestjs/platform-express"

async function bootstrap() {
  // const app = await NestFactory.create(AppModule)
  const server = express()

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server))

  // const configService = app.get(EnvService)
  const port = process.env.PORT || 10000

  await app.listen(Number(port))
}
bootstrap()
