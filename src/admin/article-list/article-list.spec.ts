import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleList } from './article-list';

describe('ArticleList', () => {
  let component: ArticleList;
  let fixture: ComponentFixture<ArticleList>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArticleList],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ArticleList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and request the first page', () => {
    const req = httpMock.expectOne((r) => r.url.endsWith('/api/articles/getpaginate'));
    expect(req.request.params.get('take')).toBe('10');
    expect(req.request.params.get('skip')).toBe('0');
    req.flush({ failMessages: null, data: [] });

    expect(component).toBeTruthy();
    httpMock.verify();
  });
});
