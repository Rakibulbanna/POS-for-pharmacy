export class HTTPClient {
  private baseURL: string = "http://localhost:3255"
  constructor() {
    
  }

  /**
   * GET
   */
  public async GET(path:string) {
    try {
      const res = await fetch(`${this.baseURL}${path}`)
      if (!res.ok) {
        return [null, await res.json()]
      }  
      return [await res.json(), null]
    } catch (err) {
      return [null, err]
    }
    
  }
}
