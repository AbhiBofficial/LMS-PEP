export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
};

export type ProfileRequest = {
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  avatarUrl?: string;
};

export type ProfileResponse = ProfileRequest & {
  id: number;
};

export type UserSummary = {
  id: number;
  email: string;
  fullName: string;
};

export type User = UserSummary & {
  enabled: boolean;
  roles: string[];
  profile?: ProfileResponse;
  borrowedBooks: BookSummary[];
  activeBorrowCount: number;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  accessTokenExpiresAt: string;
  user: UserSummary;
  roles: string[];
};

export type Author = {
  id: number;
  name: string;
  biography?: string;
  bookCount: number;
};

export type Category = {
  id: number;
  name: string;
  description?: string;
  bookCount: number;
};

export type BookSummary = {
  id: number;
  title: string;
  isbn: string;
  availableCopies: number;
};

export type Book = BookSummary & {
  description?: string;
  publicationYear?: number;
  totalCopies: number;
  shelfLocation?: string;
  author: Author;
  categories: Category[];
  currentBorrower?: UserSummary;
};

export type BorrowHistory = {
  id: number;
  user: UserSummary;
  book: BookSummary;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  fineAmount: number;
  status: 'BORROWED' | 'RETURNED' | 'LOST';
};

export type DashboardStats = {
  bookCount: number;
  userCount: number;
  activeBorrowCount: number;
  overdueBorrowCount: number;
  popularCategories: { category: string; bookCount: number }[];
};

export type AuditLog = {
  id: number;
  actorEmail?: string;
  action: string;
  entityType?: string;
  entityId?: number;
  message?: string;
  ipAddress?: string;
  createdAt: string;
};
