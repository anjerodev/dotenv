export interface RequestErrorType {
  message: string
  form?: { [x: string]: any }
  status?: number
}

export class RequestError extends Error {
  public status?: number
  public form?: any

  constructor({
    message,
    status = 500,
    form,
  }: {
    message: string
    status?: number
    form?: any
  }) {
    super(message)
    this.status = status
    this.form = form
  }
}
