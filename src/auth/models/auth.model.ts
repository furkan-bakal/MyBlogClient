export interface SignUpRequestDto {
  UserName: string;
  Email: string;
  Password: string;
}

export interface SignInRequestDto {
  Email: string;
  Password: string;
}

export interface CreateAccessTokenByRefreshTokenRequestDto {
  RefreshToken: string;
}

export interface GetAccessTokenRequestDto {
  ClientId: string;
  ClientSecret: string;
}

export interface TokenResponseDto {
  accessToken: string;
  refreshToken: string;
}
