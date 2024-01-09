// payment.ts
import { Entity } from "@/core/entities/entity"
import { Appointment } from "./appointment"

export enum PaymentStatus {
  Pending = "pending",
  Completed = "completed",
  Failed = "failed",
}

export interface PaymentProps {
  appointment: Appointment
  amount: number
  currency: string
  status: PaymentStatus
  createdAt: Date
  updatedAt?: Date | null
}

export class Payment extends Entity<PaymentProps> {
  get appointment() {
    return this.props.appointment
  }

  get amount() {
    return this.props.amount
  }

  get currency() {
    return this.props.currency
  }

  get status() {
    return this.props.status
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }
}
