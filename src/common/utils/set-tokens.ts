import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import type { JwtPayload } from 'src/users/interfaces/jwt-payload.interface';

/**
 * Sets the access and refresh tokens in the response cookies.
 * The access token expires in 15 minutes and the refresh token in 7 days.
 *
 * @param user - The user payload used to generate the tokens.
 * @param res - Express Response object to set cookies.
 * @param jwtService - JWT Service used to sign tokens.
 */
export const setTokens = (
  user: JwtPayload,
  res: Response,
  jwtService: JwtService
) => {

  const payload = {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
  };

  const accessToken = jwtService.sign(payload, { expiresIn: '15m' });
  
  const refreshToken = jwtService.sign(payload, { expiresIn: '7d' });


  res.cookie('access_token', accessToken, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict', 
    maxAge: 15 * 60 * 1000, 
  });

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'strict', 
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
