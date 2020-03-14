export class UnauthorizedError extends Error {
  readonly httpCode = 401
  constructor(message: string = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}
