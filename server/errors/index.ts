export class UnauthorizedError extends Error {
  readonly code = 401
  constructor(message: string = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}
