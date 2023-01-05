export interface Environment {
  apiKey:string
  production:boolean
  dbUrl:string
}

export interface FbAuthResponse {
  idToken:string
  expiresIn:string
}
