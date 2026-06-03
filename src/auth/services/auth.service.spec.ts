import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from '../../core/api/api-base-url';
import { TokenResponseDto } from '../models/auth.model';
import { AuthService } from './auth.service';
import { CLIENT_CREDENTIALS } from './client-credentials';
import { TokenStorageService } from './token-storage.service';

const BASE = 'https://api.test';
const CLIENT_CRED_URL = `${BASE}/api/token/createclientcredential`;
const SIGNIN_URL = `${BASE}/api/users/signin`;

class FakeTokenStorage {
  stored: TokenResponseDto | null = null;
  setTokens(tokens: TokenResponseDto): void {
    this.stored = tokens;
  }
}

const ok = <T>(data: T) => ({ failMessages: null, data });

function configure(credentials: { id: string; secret: string } | null) {
  const storage = new FakeTokenStorage();
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: API_BASE_URL, useValue: BASE },
      { provide: CLIENT_CREDENTIALS, useValue: credentials },
      { provide: TokenStorageService, useValue: storage },
    ],
  });
  return {
    service: TestBed.inject(AuthService),
    httpMock: TestBed.inject(HttpTestingController),
    storage,
  };
}

describe('AuthService.signIn', () => {
  it('bootstraps a client-credential token, attaches it to signin, and persists user tokens', () => {
    const { service, httpMock, storage } = configure({ id: 'client-web', secret: 's3cret' });

    service.signIn({ Email: 'admin@example.com', Password: 'pw' }).subscribe();

    // 1) Client-credential call goes out first with the configured credentials.
    const credReq = httpMock.expectOne(CLIENT_CRED_URL);
    expect(credReq.request.body).toEqual({ ClientId: 'client-web', ClientSecret: 's3cret' });
    credReq.flush(ok<TokenResponseDto>({ accessToken: 'client-token', refreshToken: '' }));

    // 2) Sign-in carries that client token as a bearer header.
    const signinReq = httpMock.expectOne(SIGNIN_URL);
    expect(signinReq.request.headers.get('Authorization')).toBe('Bearer client-token');
    signinReq.flush(ok<TokenResponseDto>({ accessToken: 'user-token', refreshToken: 'r-1' }));

    // 3) The returned user tokens are persisted.
    expect(storage.stored).toEqual({ accessToken: 'user-token', refreshToken: 'r-1' });

    httpMock.verify();
  });

  it('skips the bootstrap and sends no auth header when no client credentials are configured', () => {
    const { service, httpMock, storage } = configure(null);

    service.signIn({ Email: 'admin@example.com', Password: 'pw' }).subscribe();

    httpMock.expectNone(CLIENT_CRED_URL);
    const signinReq = httpMock.expectOne(SIGNIN_URL);
    expect(signinReq.request.headers.has('Authorization')).toBe(false);
    signinReq.flush(ok<TokenResponseDto>({ accessToken: 'user-token', refreshToken: 'r-1' }));

    expect(storage.stored).toEqual({ accessToken: 'user-token', refreshToken: 'r-1' });

    httpMock.verify();
  });

  it('does not persist tokens when the API reports a failure', () => {
    const { service, httpMock, storage } = configure(null);

    service.signIn({ Email: 'admin@example.com', Password: 'pw' }).subscribe();

    httpMock.expectOne(SIGNIN_URL).flush({ failMessages: ['Invalid credentials'], data: null });

    expect(storage.stored).toBeNull();

    httpMock.verify();
  });
});
