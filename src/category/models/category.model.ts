import { Article } from '../../article/models/article.model';

export interface Category {
  id: string;
  name: string;
  createdDate: string;
  updatedDate: string | null;
  isDeleted: boolean;
  deletedDate: string | null;
}

export interface CategoryWithArticles extends Category {
  articles: Article[];
}

/** Request body for creating a category (API expects PascalCase keys). */
export interface CreateCategoryDto {
  Name: string;
}

/** Update shares the same shape as create. */
export type UpdateCategoryDto = CreateCategoryDto;
