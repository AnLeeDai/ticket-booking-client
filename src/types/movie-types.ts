export type MovieStatus = "IS_PENDING" | "IS_ACTIVE" | "IN_ACTIVE";

export type Movie = {
  movie_id: string;
  title: string;
  name: string;
  slug: string;
  description: string | null;
  thumb_url: string | null;
  trailer_url: string | null;
  gallery: string[];
  duration: number;
  language: string | null;
  age: number | null;
  rating: number | null;
  release_date: string;
  end_date: string | null;
  status: MovieStatus;
  genre_id: string | null;
  genre: { id: string; name: string; slug: string } | null;
  categories: { id: string; name: string; slug: string }[];
  created_at: string;
  updated_at: string;
};

export type MovieListParams = {
  search?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
  per_page?: number;
  page?: number;
};

export type MoviePayload = {
  title: string;
  name: string;
  description?: string;
  thumb_url?: string;
  trailer_url?: string;
  gallery?: string[];
  duration: number;
  language?: string;
  age?: number;
  rating?: number;
  release_date: string;
  end_date?: string;
  status: MovieStatus;
  genre_id?: string;
  category_ids?: string[];
};
