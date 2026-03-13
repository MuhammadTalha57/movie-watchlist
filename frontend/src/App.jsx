import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "./api";

const initialMovieForm = {
  title: "",
  year: "",
  rating: "",
  watched: false,
};

const normalizeAuthPayload = (payload) => {
  if (!payload) {
    return null;
  }

  if (payload.data?.token && payload.data?.user) {
    return payload.data;
  }

  if (payload.token?.token && payload.token?.user) {
    return payload.token;
  }

  if (payload.token && payload.user) {
    return payload;
  }

  return null;
};

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [token, setToken] = useState(() => localStorage.getItem("token") || "");
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  });
  const [movies, setMovies] = useState([]);
  const [movieForm, setMovieForm] = useState(initialMovieForm);
  const [editingMovie, setEditingMovie] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingMovies, setIsLoadingMovies] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!token) {
      return;
    }

    fetchMovies();
  }, [token]);

  const welcomeName = useMemo(() => {
    if (!user?.name) {
      return "Movie Explorer";
    }

    return user.name;
  }, [user]);

  const updateAuthForm = (event) => {
    const { name, value } = event.target;
    setAuthForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const updateMovieForm = (event) => {
    const { name, value, type, checked } = event.target;
    setMovieForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const applySession = (session) => {
    setToken(session.token);
    setUser(session.user);
    localStorage.setItem("token", session.token);
    localStorage.setItem("user", JSON.stringify(session.user));
  };

  const clearSession = () => {
    setToken("");
    setUser(null);
    setMovies([]);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const fetchMovies = async () => {
    setIsLoadingMovies(true);
    setErrorMessage("");

    try {
      const result = await apiRequest("/movies", { method: "GET" }, token);
      setMovies(result?.data || []);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load movies.");
    } finally {
      setIsLoadingMovies(false);
    }
  };

  const onAuthSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const endpoint = authMode === "login" ? "/auth/login" : "/auth/register";
    const payload =
      authMode === "login"
        ? {
            email: authForm.email,
            password: authForm.password,
          }
        : {
            name: authForm.name,
            email: authForm.email,
            password: authForm.password,
          };

    try {
      const result = await apiRequest(endpoint, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const session = normalizeAuthPayload(result);

      if (!session) {
        throw new Error("Invalid auth response from server");
      }

      applySession(session);
      setAuthForm({ name: "", email: "", password: "" });
    } catch (error) {
      setErrorMessage(error.message || "Authentication failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startCreateMovie = () => {
    setEditingMovie(null);
    setMovieForm(initialMovieForm);
  };

  const startEditMovie = (movie) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title || "",
      year: movie.year || "",
      rating: movie.rating || "",
      watched: Boolean(movie.watched),
    });
  };

  const saveMovie = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const payload = {
      title: movieForm.title,
      year: movieForm.year ? Number(movieForm.year) : undefined,
      rating: movieForm.rating ? Number(movieForm.rating) : undefined,
      watched: movieForm.watched,
    };

    try {
      if (editingMovie) {
        await apiRequest(
          `/movies/${editingMovie._id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          },
          token,
        );
      } else {
        await apiRequest(
          "/movies",
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
          token,
        );
      }

      await fetchMovies();
      startCreateMovie();
    } catch (error) {
      setErrorMessage(error.message || "Failed to save movie");
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMovie = async (movieId) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      await apiRequest(`/movies/${movieId}`, { method: "DELETE" }, token);
      if (selectedMovie?._id === movieId) {
        setSelectedMovie(null);
      }
      await fetchMovies();
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete movie");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openMovieDetails = async (movieId) => {
    setErrorMessage("");
    try {
      const result = await apiRequest(`/movies/${movieId}`, { method: "GET" }, token);
      setSelectedMovie(result?.data || null);
    } catch (error) {
      setErrorMessage(error.message || "Failed to fetch movie details");
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Movie Watchlist</p>
          <h1>{token ? `Welcome, ${welcomeName}` : "Track every movie worth watching"}</h1>
        </div>
        <div className="topbar-actions">
          <button
            className="ghost-btn"
            onClick={() => setTheme((current) => (current === "dark" ? "light" : "dark"))}
            type="button"
          >
            {theme === "dark" ? "Switch to Light" : "Switch to Dark"}
          </button>
          {token && (
            <button className="danger-btn" onClick={clearSession} type="button">
              Logout
            </button>
          )}
        </div>
      </header>

      {errorMessage && <p className="alert">{errorMessage}</p>}

      {!token ? (
        <section className="auth-layout">
          <article className="auth-copy">
            <h2>Plan your next binge with style.</h2>
            <p>
              Keep your personal movie universe in one place. Add titles, rate them,
              mark watched status, and open any card for details.
            </p>
          </article>

          <article className="auth-card">
            <div className="auth-switch">
              <button
                className={authMode === "login" ? "active" : ""}
                onClick={() => setAuthMode("login")}
                type="button"
              >
                Login
              </button>
              <button
                className={authMode === "signup" ? "active" : ""}
                onClick={() => setAuthMode("signup")}
                type="button"
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={onAuthSubmit}>
              {authMode === "signup" && (
                <label>
                  Name
                  <input
                    name="name"
                    onChange={updateAuthForm}
                    required
                    type="text"
                    value={authForm.name}
                  />
                </label>
              )}

              <label>
                Email
                <input
                  name="email"
                  onChange={updateAuthForm}
                  required
                  type="email"
                  value={authForm.email}
                />
              </label>

              <label>
                Password
                <input
                  name="password"
                  onChange={updateAuthForm}
                  required
                  type="password"
                  value={authForm.password}
                />
              </label>

              <button className="primary-btn" disabled={isSubmitting} type="submit">
                {isSubmitting
                  ? "Please wait..."
                  : authMode === "login"
                    ? "Login"
                    : "Create account"}
              </button>
            </form>
          </article>
        </section>
      ) : (
        <section className="dashboard">
          <aside className="panel form-panel">
            <h2>{editingMovie ? "Edit movie" : "Add movie"}</h2>
            <form onSubmit={saveMovie}>
              <label>
                Title
                <input
                  name="title"
                  onChange={updateMovieForm}
                  required
                  type="text"
                  value={movieForm.title}
                />
              </label>

              <label>
                Year
                <input
                  max="2100"
                  min="1888"
                  name="year"
                  onChange={updateMovieForm}
                  type="number"
                  value={movieForm.year}
                />
              </label>

              <label>
                Rating
                <input
                  max="10"
                  min="0"
                  name="rating"
                  onChange={updateMovieForm}
                  step="0.1"
                  type="number"
                  value={movieForm.rating}
                />
              </label>

              <label className="toggle-row">
                <input
                  checked={movieForm.watched}
                  name="watched"
                  onChange={updateMovieForm}
                  type="checkbox"
                />
                Watched
              </label>

              <div className="form-actions">
                <button className="primary-btn" disabled={isSubmitting} type="submit">
                  {editingMovie ? "Update movie" : "Create movie"}
                </button>
                {editingMovie && (
                  <button className="ghost-btn" onClick={startCreateMovie} type="button">
                    Cancel edit
                  </button>
                )}
              </div>
            </form>
          </aside>

          <main className="panel">
            <div className="panel-title-row">
              <h2>Your collection</h2>
              <button className="ghost-btn" onClick={fetchMovies} type="button">
                Refresh
              </button>
            </div>

            {isLoadingMovies ? (
              <p>Loading movies...</p>
            ) : movies.length === 0 ? (
              <p>No movies yet. Add your first movie.</p>
            ) : (
              <div className="movie-grid">
                {movies.map((movie) => (
                  <article
                    className="movie-card"
                    key={movie._id}
                    onClick={() => openMovieDetails(movie._id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        openMovieDetails(movie._id);
                      }
                    }}
                  >
                    <h3>{movie.title}</h3>
                    <p>{movie.year || "Unknown year"}</p>
                    <p>Rating: {movie.rating ?? "N/A"}</p>
                    <p>Status: {movie.watched ? "Watched" : "To watch"}</p>

                    <div className="card-actions" onClick={(event) => event.stopPropagation()}>
                      <button
                        className="ghost-btn"
                        onClick={() => startEditMovie(movie)}
                        type="button"
                      >
                        Edit
                      </button>
                      <button
                        className="danger-btn"
                        onClick={() => removeMovie(movie._id)}
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </main>
        </section>
      )}

      {selectedMovie && (
        <div className="modal-backdrop" onClick={() => setSelectedMovie(null)}>
          <article className="modal-card" onClick={(event) => event.stopPropagation()}>
            <h2>{selectedMovie.title}</h2>
            <p>
              <strong>Year:</strong> {selectedMovie.year || "Unknown"}
            </p>
            <p>
              <strong>Rating:</strong> {selectedMovie.rating ?? "N/A"}
            </p>
            <p>
              <strong>Status:</strong> {selectedMovie.watched ? "Watched" : "To watch"}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {selectedMovie.createdAt
                ? new Date(selectedMovie.createdAt).toLocaleString()
                : "Unknown"}
            </p>
            <button
              className="primary-btn"
              onClick={() => setSelectedMovie(null)}
              type="button"
            >
              Close
            </button>
          </article>
        </div>
      )}
    </div>
  );
}

export default App;
