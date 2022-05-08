type Film = {
  film_id: number;
  film_title: string;
  film_year: number;
  film_runtime: number;
  film_revenue: string;
};

type FilmWithDetails = Film & {
  rating: number;
  likes: number;
  genres: string;
  actors: string;
  directors: string;
};

type User = {
  id: number;
  authenticated: boolean;
  token: string;
};
