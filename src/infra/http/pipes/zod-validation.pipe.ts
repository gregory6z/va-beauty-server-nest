import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from "@nestjs/common"
import { ZodError, ZodSchema } from "zod"
import { fromZodError } from "zod-validation-error"

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type === "custom") {
      return value
    }

    try {
      return this.schema.parse(value)
    } catch (error) {
      console.error("Validation Error:", error) // Adicione este log para obter mais detalhes sobre o erro

      if (error instanceof ZodError) {
        throw new BadRequestException({
          errors: fromZodError(error),
          status: 400,
          message: "Validation failed",
        })
      }
      throw new BadRequestException("Validation failed")
    }
  }
}
