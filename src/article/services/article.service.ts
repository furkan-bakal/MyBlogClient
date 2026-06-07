import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/api/api-base-url';
import { ResponseModel } from '../../core/models/response-model';
import { Article, CreateArticleDto, UpdateArticleDto } from '../models/article.model';

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_BASE_URL)}/api/articles`;

  getAll(): Observable<ResponseModel<Article[]>> {
    return this.http.get<ResponseModel<Article[]>>(this.baseUrl);
  }

  getById(id: string): Observable<ResponseModel<Article>> {
    return this.http.get<ResponseModel<Article>>(`${this.baseUrl}/${id}`);
  }

  getPaginated(take: number, skip: number): Observable<ResponseModel<Article[]>> {
    const params = new HttpParams().set('take', take).set('skip', skip);
    return this.http.get<ResponseModel<Article[]>>(`${this.baseUrl}/getpaginate`, { params });
  }

  /**
   * Full-text search across article title and content. Matching is performed on the backend;
   * results are paginated like {@link getPaginated}.
   */
  search(query: string, take: number, skip: number): Observable<ResponseModel<Article[]>> {
    const params = new HttpParams().set('query', query).set('take', take).set('skip', skip);
    return this.http.get<ResponseModel<Article[]>>(`${this.baseUrl}/search`, { params });
  }

  create(article: CreateArticleDto): Observable<ResponseModel<string>> {
    return this.http.post<ResponseModel<string>>(this.baseUrl, article);
  }

  update(id: string, article: UpdateArticleDto): Observable<ResponseModel<unknown>> {
    return this.http.put<ResponseModel<unknown>>(`${this.baseUrl}/${id}`, article);
  }

  delete(id: string): Observable<ResponseModel<unknown>> {
    return this.http.delete<ResponseModel<unknown>>(`${this.baseUrl}/${id}`);
  }
}
