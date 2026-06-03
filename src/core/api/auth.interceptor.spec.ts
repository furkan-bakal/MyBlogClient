import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TokenStorageService } from '../../auth/services/token-storage.service';
import { authInterceptor } from './auth.interceptor';

class FakeTokenStorage {
  accessToken: string | null = null;
  getAccessToken(): string | null {
    return this.accessToken;
  }
}

describe('authInterceptor', () => {
  let http: HttpClient;
  let httpMock: HttpTestingController;
  let storage: FakeTokenStorage;

  beforeEach(() => {
    storage = new FakeTokenStorage();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: TokenStorageService, useValue: storage },
      ],
    });
    http = TestBed.inject(HttpClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('attaches the bearer token when one is present', () => {
    storage.accessToken = 'abc123';

    http.get('/api/articles').subscribe();

    const req = httpMock.expectOne('/api/articles');
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc123');
    req.flush({});
  });

  it('does not attach an Authorization header when no token is present', () => {
    http.get('/api/articles').subscribe();

    const req = httpMock.expectOne('/api/articles');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });
});
