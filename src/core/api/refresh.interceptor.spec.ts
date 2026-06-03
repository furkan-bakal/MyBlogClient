import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API_BASE_URL } from './api-base-url';
import { TokenStorageService } from '../../auth/services/token-storage.service';
import { TokenResponseDto } from '../../auth/models/auth.model';
import { refreshInterceptor } from './refresh.interceptor';

const BASE = 'http://localhost:5000';
const ARTICLES = `${BASE}/api/articles`;
const REFRESH_URL = `${BASE}/api/users/signinbyrefreshtoken`;
const SIGNIN_URL = `${BASE}/api/users/signin`;

class FakeTokenStorage {
  accessToken: string | null = null;
  refreshToken: string | null = null;
  cleared = false;
  isAuthenticated = () => this.accessToken !== null;
  getAccessToken(): string | null {
    return this.accessToken;
  }
  getRefreshToken(): string | null {
    return this.refreshToken;
  }
  setTokens(tokens: TokenResponseDto): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
  }
  clear(): void {
    this.cleared = true;
    this.accessToken = null;
    this.refreshToken = null;
  }
}

const ok = (data: TokenResponseDto) => ({ failMessages: null, data });

describe('refreshInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let storage: FakeTokenStorage;

  beforeEach(() => {
    storage = new FakeTokenStorage();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([refreshInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenStorageService, useValue: storage },
        { provide: API_BASE_URL, useValue: BASE },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('refreshes on 401 and retries the original request with the new token', () => {
    storage.accessToken = 'old';
    storage.refreshToken = 'refresh-1';
    let result: unknown;

    http.get(ARTICLES).subscribe((r) => (result = r));

    httpMock.expectOne(ARTICLES).flush(null, { status: 401, statusText: 'Unauthorized' });

    httpMock
      .expectOne(REFRESH_URL)
      .flush(ok({ accessToken: 'new', refreshToken: 'refresh-2' }));

    const retry = httpMock.expectOne(ARTICLES);
    expect(retry.request.headers.get('Authorization')).toBe('Bearer new');
    retry.flush({ ok: true });

    expect(result).toEqual({ ok: true });
  });

  it('refreshes on 403 when an access token is present', () => {
    storage.accessToken = 'old';
    storage.refreshToken = 'refresh-1';

    http.get(ARTICLES).subscribe();

    httpMock.expectOne(ARTICLES).flush(null, { status: 403, statusText: 'Forbidden' });
    httpMock.expectOne(REFRESH_URL).flush(ok({ accessToken: 'new', refreshToken: 'refresh-2' }));
    httpMock.expectOne(ARTICLES).flush({});
  });

  it('does NOT refresh on 403 when no access token is present', () => {
    let errorStatus: number | undefined;

    http.get(ARTICLES).subscribe({ error: (e) => (errorStatus = e.status) });

    httpMock.expectOne(ARTICLES).flush(null, { status: 403, statusText: 'Forbidden' });

    httpMock.expectNone(REFRESH_URL);
    expect(errorStatus).toBe(403);
  });

  it('does NOT refresh when the failing request is itself an auth endpoint', () => {
    storage.accessToken = 'old';
    storage.refreshToken = 'refresh-1';
    let errorStatus: number | undefined;

    http.post(SIGNIN_URL, {}).subscribe({ error: (e) => (errorStatus = e.status) });

    httpMock.expectOne(SIGNIN_URL).flush(null, { status: 401, statusText: 'Unauthorized' });

    httpMock.expectNone(REFRESH_URL);
    expect(errorStatus).toBe(401);
  });

  it('clears tokens and propagates the error when the refresh fails', () => {
    storage.accessToken = 'old';
    storage.refreshToken = 'refresh-1';
    let errored = false;

    http.get(ARTICLES).subscribe({ error: () => (errored = true) });

    httpMock.expectOne(ARTICLES).flush(null, { status: 401, statusText: 'Unauthorized' });
    httpMock
      .expectOne(REFRESH_URL)
      .flush(null, { status: 401, statusText: 'Unauthorized' });

    expect(errored).toBe(true);
    expect(storage.cleared).toBe(true);
  });

  it('dedupes concurrent failures into a single refresh call', () => {
    storage.accessToken = 'old';
    storage.refreshToken = 'refresh-1';

    http.get(`${ARTICLES}/1`).subscribe();
    http.get(`${ARTICLES}/2`).subscribe();

    httpMock.expectOne(`${ARTICLES}/1`).flush(null, { status: 401, statusText: 'Unauthorized' });
    httpMock.expectOne(`${ARTICLES}/2`).flush(null, { status: 401, statusText: 'Unauthorized' });

    // Only one refresh request despite two 401s.
    httpMock.expectOne(REFRESH_URL).flush(ok({ accessToken: 'new', refreshToken: 'refresh-2' }));

    httpMock.expectOne(`${ARTICLES}/1`).flush({});
    httpMock.expectOne(`${ARTICLES}/2`).flush({});
  });
});
