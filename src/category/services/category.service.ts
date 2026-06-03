import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../core/api/api-base-url';
import { ResponseModel } from '../../core/models/response-model';
import {
  Category,
  CategoryWithArticles,
  CreateCategoryDto,
  UpdateCategoryDto,
} from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${inject(API_BASE_URL)}/api/categories`;

  getAll(): Observable<ResponseModel<Category[]>> {
    return this.http.get<ResponseModel<Category[]>>(this.baseUrl);
  }

  getWithArticles(id: string): Observable<ResponseModel<CategoryWithArticles>> {
    return this.http.get<ResponseModel<CategoryWithArticles>>(`${this.baseUrl}/${id}`);
  }

  create(category: CreateCategoryDto): Observable<ResponseModel<string>> {
    return this.http.post<ResponseModel<string>>(this.baseUrl, category);
  }

  update(id: string, category: UpdateCategoryDto): Observable<ResponseModel<unknown>> {
    return this.http.put<ResponseModel<unknown>>(`${this.baseUrl}/${id}`, category);
  }

  delete(id: string): Observable<ResponseModel<unknown>> {
    return this.http.delete<ResponseModel<unknown>>(`${this.baseUrl}/${id}`);
  }
}
