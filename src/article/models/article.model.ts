export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  categoryId: string;
  createdDate: string;
  updatedDate: string | null;
  isDeleted: boolean;
  deletedDate: string | null;
}

/** Request body for creating an article (API expects PascalCase keys). */
export interface CreateArticleDto {
  Title: string;
  Content: string;
  Author: string;
  CategoryId: string;
}

/** Update shares the same shape as create. */
export type UpdateArticleDto = CreateArticleDto;
