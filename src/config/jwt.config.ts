import { JwtModuleOptions } from "@nestjs/jwt";

export const jwtConfig: JwtModuleOptions = {
    secret: "secret",
    signOptions: {
        expiresIn: '30s'
    }
}

export const refreshTokenConfig: JwtModuleOptions = {
    secret: "refresh_token_secret",
    signOptions: {
        expiresIn: '1d'
    }
}