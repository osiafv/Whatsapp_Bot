

export default class CMDError extends Error {
  public event?: any
  constructor(message: any, event?: any) {
    super(message)
    this.name = "CMDError"
    if (event) this.event = event
  }
}