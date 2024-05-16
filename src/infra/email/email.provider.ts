export interface EmailProvider {
  sendEmail({
    to,
    subject,
    html,
  }: {
    to: string
    subject: string
    html: string
  }): Promise<void>
}
