import { JwtModuleOptions } from "@nestjs/jwt";
// import * as dotenv from 'dotenv'

// dotenv.config();

export const jwtConfig: JwtModuleOptions = {
    secret: process.env.SECRET,
    signOptions: {
        expiresIn: '12h'
    }
}

export const refreshTokenConfig: JwtModuleOptions = {
    secret: "refresh_token_secret",
    signOptions: {
        expiresIn: '1d'
    }
}