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
  user_email: string;
  user_forename: string;
  user_id: number;
  user_password: string;
  user_surname: string;
  user_username: string;
};

type LoginResponse = {
  token: string;
  user: User;
};

type OutputMessage = {
  status: "info" | "warning" | "success" | "error";
  title: string;
  message: string;
};
