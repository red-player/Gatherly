

// export const DATABASE_URL = process.env.DATABASE_URL || 'mysql://admin:admin1234@db-43ftr4.cwmfg03qxj7z.ap-south-1.rds.amazonaws.com:3306/colatika'
// export const PORT = process.env.PORT || 8080;
// export const ENV = process.env.ENV
// export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET
// export const ID_TOKEN_SECRET = process.env.ID_TOKEN_SECRET
// export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

// export const ACCESS_TOKEN_EXPIRY =  60*60*24*10
// export const ID_TOKEN_EXPIRY =  60*60*24*10
// export const REFRESH_TOKEN_EXPIRY =  60*60*24*12

// export const ACCESS_TOKEN_EXPIRY =  10
// export const ID_TOKEN_EXPIRY =  120
// export const REFRESH_TOKEN_EXPIRY =  120


import { env } from 'node:process';
export const DATABASE_URL = env.DATABASE_URL
export const PORT = env.PORT
export const ENV = env.ENV
export const SERVER = env.SERVER
export const ACCESS_TOKEN_SECRET = env.ACCESS_TOKEN_SECRET
export const REFRESH_TOKEN_SECRET = env.REFRESH_TOKEN_SECRET

export const ID_TOKEN_SECRET = env.ID_TOKEN_SECRET

export const ACCESS_TOKEN_EXPIRY = '1day'
export const REFRESH_TOKEN_EXPIRY = '1day'
export const ID_TOKEN_EXPIRY =  '1day'

export const uploadPath = `${env.UPLOAD_PATH}`

