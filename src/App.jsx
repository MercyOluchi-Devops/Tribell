import { useEffect, useState } from "react";
import "./App.css";

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const TMDB_IMAGE_URL = "https://image.tmdb.org/t/p/w500";
const TMDB_BACKDROP_URL = "https://image.tmdb.org/t/p/w1280";

const genreMap = {
  Action: 28,
  Adventure: 12,
  Thriller: 53,
  "Sci-Fi": 878,
  Drama: 18,
  Comedy: 35,
  Horror: 27,
  Romance: 10749,
};

function App() {
  const [movies, setMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);

  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchingMovie, setWatchingMovie] = useState(null);
const [myList, setMyList] = useState(() => {
  try {
    const savedList = localStorage.getItem("tribellMyList");

    if (!savedList) {
      return [];
    }

    const parsedList = JSON.parse(savedList);

    return Array.isArray(parsedList) ? parsedList : [];
  } catch (error) {
    console.error("MY LIST ERROR:", error);
    return [];
  }
});

  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [detailsLoading, setDetailsLoading] = useState(false);

  /*
   * Save My List
   */
  useEffect(() => {
    localStorage.setItem("tribellMyList", JSON.stringify(myList));
  }, [myList]);

  /*
   * Load Trending, Popular and Upcoming movies
   */
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        setError("");

        const headers = {
          Authorization: `Bearer ${TMDB_TOKEN}`,
          accept: "application/json",
        };

        const [trendingResponse, popularResponse, upcomingResponse] =
          await Promise.all([
            fetch(
              "https://api.themoviedb.org/3/trending/movie/week",
              { headers }
            ),

            fetch(
              "https://api.themoviedb.org/3/movie/popular",
              { headers }
            ),

            fetch(
              "https://api.themoviedb.org/3/movie/upcoming",
              { headers }
            ),
          ]);

        if (
          !trendingResponse.ok ||
          !popularResponse.ok ||
          !upcomingResponse.ok
        ) {
          throw new Error("Unable to load movies from TMDB.");
        }

        const trendingData = await trendingResponse.json();
        const popularData = await popularResponse.json();
        const upcomingData = await upcomingResponse.json();

        setMovies(trendingData.results || []);
        setPopularMovies(popularData.results || []);
        setUpcomingMovies(upcomingData.results || []);
      } catch (error) {
        console.error("TMDB ERROR:", error);
        setError(
          "We couldn't load the movies right now. Please refresh and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  /*
   * Search TMDB
   */
useEffect(() => {
  const query = searchTerm.trim();

  if (!query) {
    setSearchResults([]);
    setIsSearching(false);
    return;
  }

  const searchMovies = async () => {
    try {
      setIsSearching(true);

      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
          query
        )}&include_adult=false&language=en-US&page=1`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("TMDB SEARCH ERROR:", response.status, errorText);
        throw new Error(`Search failed: ${response.status}`);
      }

      const data = await response.json();

      console.log("TMDB SEARCH RESULTS:", data);

      setSearchResults(data.results || []);
    } catch (error) {
      console.error("SEARCH ERROR:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const timer = setTimeout(searchMovies, 400);

  return () => clearTimeout(timer);
}, [searchTerm]);

  /*
   * Get full movie details when a movie is selected
   */
  const openMovieDetails = async (movie) => {
    try {
      setDetailsLoading(true);

      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}?append_to_response=credits,similar`,
        {
          headers: {
            Authorization: `Bearer ${TMDB_TOKEN}`,
            accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Unable to load movie details.");
      }

      const data = await response.json();

      setSelectedMovie(data);
    } catch (error) {
      console.error("MOVIE DETAILS ERROR:", error);

      // Still open the basic movie information if details fail
      setSelectedMovie(movie);
    } finally {
      setDetailsLoading(false);
    }
  };

  /*
   * Filter Trending movies by genre
   */
  const filteredMovies = movies.filter((movie) => {
    if (selectedCategory === "All") {
      return true;
    }

    return movie.genre_ids?.includes(
      genreMap[selectedCategory]
    );
  });

  /*
   * Format runtime
   */
  const formatRuntime = (minutes) => {
    if (!minutes) {
      return "Runtime unavailable";
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) {
      return `${remainingMinutes}m`;
    }

    return `${hours}h ${remainingMinutes}m`;
  };

  /*
   * Get director
   */
  const getDirector = (movie) => {
    if (!movie.credits?.crew) {
      return "Not available";
    }

    const director = movie.credits.crew.find(
      (person) => person.job === "Director"
    );

    return director?.name || "Not available";
  };

  /*
   * Get main cast
   */
  const getCast = (movie) => {
    if (!movie.credits?.cast) {
      return "Not available";
    }

    return movie.credits.cast
      .slice(0, 5)
      .map((person) => person.name)
      .join(", ");
  };

  /*
   * Get genres
   */
  const getGenres = (movie) => {
    if (!movie.genres) {
      return "Movie";
    }

    return movie.genres
      .slice(0, 3)
      .map((genre) => genre.name)
      .join(", ");
  };

  /*
   * Add movie to My List
   */
  const addToMyList = (movie) => {
    setMyList((currentList) => {
      if (currentList.some((item) => item.id === movie.id)) {
        return currentList;
      }

      return [...currentList, movie];
    });
  };

  /*
   * Remove movie from My List
   */
  const removeFromMyList = (movie) => {
    setMyList((currentList) =>
      currentList.filter((item) => item.id !== movie.id)
    );

    setSelectedMovie(null);
  };

  /*
   * Movie card component
   */
  const MovieCard = ({ movie }) => {
    return (
      <article
        className="movie-card"
        onClick={() => openMovieDetails(movie)}
      >
        <img
          src={
            movie.poster_path
              ? `${TMDB_IMAGE_URL}${movie.poster_path}`
              : "/placeholder-movie.jpg"
          }
          alt={movie.title}
        />

        <div className="movie-overlay">
          <span>
            {movie.release_date
              ? movie.release_date.slice(0, 4)
              : "Movie"}
          </span>

          <h3>{movie.title}</h3>

          <button
            onClick={(event) => {
              event.stopPropagation();
              openMovieDetails(movie);
            }}
            aria-label={`Open ${movie.title}`}
          >
            ▶
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="app">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">TRIBELL</div>

        <nav>
          <a href="#home">Home</a>
          <a href="#movies">Movies</a>
          <a href="#popular">Popular</a>
          <a href="#upcoming">Upcoming</a>
          <a href="#my-list">My List</a>
        </nav>

        <div className="nav-actions">
          {searchOpen && (
            <div className="search-container">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(event) =>
                  setSearchTerm(event.target.value)
                }
                autoFocus
              />
            </div>
          )}

         <button
  className="search-btn"
  onClick={() => setSearchOpen((current) => !current)}
  aria-label="Search"
>
  ⌕
</button>

          <button className="profile-btn">M</button>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="hero" id="home">
          <div className="hero-content">
            <p className="small-label">WELCOME TO TRIBELL</p>

            <h1>
              Your next favorite
              <br />
              story starts here.
            </h1>

            <p>
              Discover movies worth watching, explore new stories,
              and build your personal collection.
            </p>

            <div className="hero-buttons">
              <button
                className="watch-btn"
                onClick={() =>
                  document
                    .getElementById("movies")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                ▶ Explore Movies
              </button>

              <button
                className="info-btn"
                onClick={() =>
                  document
                    .getElementById("popular")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Discover More
              </button>
            </div>
          </div>
        </section>

        {/* Search Results */}
        {searchTerm.trim() && (
          <section className="movie-section search-results-section">
            <div className="section-heading">
              <h2>Search Results</h2>
            </div>

            {isSearching ? (
              <p className="loading-message">
                Searching TMDB...
              </p>
            ) : searchResults.length === 0 ? (
              <p className="empty-list">
                No movies found for "{searchTerm}".
              </p>
            ) : (
              <div className="movie-grid">
                {searchResults.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Error */}
        {error && (
          <div className="error-message">
            <p>{error}</p>

            <button onClick={() => window.location.reload()}>
              Refresh
            </button>
          </div>
        )}

        {/* Trending */}
        <section className="movie-section" id="movies">
          <div className="section-heading">
            <div>
              <p className="small-label">DISCOVER</p>
              <h2>Trending Now</h2>
            </div>

            <div className="category-filters">
              {[
                "All",
                "Action",
                "Sci-Fi",
                "Thriller",
                "Adventure",
              ].map((category) => (
                <button
                  key={category}
                  className={
                    selectedCategory === category
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="loading-message">
              Loading trending movies...
            </p>
          ) : filteredMovies.length > 0 ? (
            <div className="movie-grid">
              {filteredMovies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                />
              ))}
            </div>
          ) : (
            <p className="empty-list">
              No trending movies match this category right now.
            </p>
          )}
        </section>

        {/* Popular */}
        <section className="movie-section" id="popular">
          <div className="section-heading">
            <div>
              <p className="small-label">POPULAR</p>
              <h2>Popular Movies</h2>
            </div>
          </div>

          {loading ? (
            <p className="loading-message">
              Loading popular movies...
            </p>
          ) : (
            <div className="movie-grid">
              {popularMovies.slice(0, 10).map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                />
              ))}
            </div>
          )}
        </section>

        {/* Upcoming */}
        <section className="movie-section" id="upcoming">
          <div className="section-heading">
            <div>
              <p className="small-label">COMING SOON</p>
              <h2>Upcoming Movies</h2>
            </div>
          </div>

          {loading ? (
            <p className="loading-message">
              Loading upcoming movies...
            </p>
          ) : (
            <div className="movie-grid">
              {upcomingMovies.slice(0, 10).map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                />
              ))}
            </div>
          )}
        </section>

        {/* My List */}
        <section className="movie-section" id="my-list">
          <div className="section-heading">
            <div>
              <p className="small-label">YOUR COLLECTION</p>
              <h2>My List</h2>
            </div>
          </div>

          {myList.length === 0 ? (
            <p className="empty-list">
              You haven't added any movies to your list yet.
            </p>
          ) : (
            <div className="movie-grid">
              {myList.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                />
              ))}
            </div>
          )}
        </section>

        {/* About / Coming Soon */}
        <section className="coming-section">
          <div>
            <p className="small-label">THE TRIBELL EXPERIENCE</p>

            <h2>
              Great stories.
              <br />
              Beautifully discovered.
            </h2>

            <p>
              Tribell is being built to make discovering movies
              simple, beautiful, and enjoyable.
            </p>
          </div>

          <button
            className="explore-btn"
            onClick={() =>
              document
                .getElementById("movies")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Explore Movies
          </button>
        </section>
      </main>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <div
          className="movie-modal"
          onClick={() => setSelectedMovie(null)}
        >
          <div
            className="movie-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="close-modal"
              onClick={() => setSelectedMovie(null)}
              aria-label="Close movie details"
            >
              ×
            </button>

            <div className="movie-modal-poster">
              <img
                src={
                  selectedMovie.poster_path
                    ? `${TMDB_IMAGE_URL}${selectedMovie.poster_path}`
                    : "/placeholder-movie.jpg"
                }
                alt={selectedMovie.title}
              />
            </div>

            <div
              className="movie-modal-info"
              style={
                selectedMovie.backdrop_path
                  ? {
                      backgroundImage: `linear-gradient(
                        to right,
                        rgba(255,255,255,0.98),
                        rgba(255,255,255,0.94)
                      ), url(${TMDB_BACKDROP_URL}${selectedMovie.backdrop_path})`,
                    }
                  : undefined
              }
            >
              {detailsLoading ? (
                <div className="details-loading">
                  <p>Loading movie details...</p>
                </div>
              ) : (
                <>
                  <p className="movie-category">
                    {getGenres(selectedMovie)}
                  </p>

                  <h2>{selectedMovie.title}</h2>

                  <div className="movie-meta">
                    <span>
                      ⭐{" "}
                      {selectedMovie.vote_average
                        ? selectedMovie.vote_average.toFixed(1)
                        : "N/A"}
                    </span>

                    <span>
                      {selectedMovie.release_date
                        ? selectedMovie.release_date.slice(0, 4)
                        : "N/A"}
                    </span>

                    <span>
                      {formatRuntime(selectedMovie.runtime)}
                    </span>
                  </div>

                  <p className="movie-description">
                    {selectedMovie.overview ||
                      "No description available."}
                  </p>

                  <div className="movie-credits">
                    <p>
                      <strong>Director:</strong>{" "}
                      {getDirector(selectedMovie)}
                    </p>

                    <p>
                      <strong>Cast:</strong>{" "}
                      {getCast(selectedMovie)}
                    </p>
                  </div>

                  {/* Similar Movies */}
                  {selectedMovie.similar?.results?.length > 0 && (
                    <div className="similar-movies">
                      <h3>More Like This</h3>

                      <div className="similar-movie-list">
                        {selectedMovie.similar.results
                          .filter(
                            (movie) =>
                              movie.poster_path &&
                              movie.id !== selectedMovie.id
                          )
                          .slice(0, 5)
                          .map((movie) => (
                            <button
                              key={movie.id}
                              className="similar-movie"
                              onClick={() =>
                                openMovieDetails(movie)
                              }
                            >
                              <img
                                src={`${TMDB_IMAGE_URL}${movie.poster_path}`}
                                alt={movie.title}
                              />

                              <span>{movie.title}</span>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="modal-actions">
                    <button
                      className="watch-btn"
                      onClick={() => {
                        setWatchingMovie(selectedMovie);
                        setSelectedMovie(null);
                      }}
                    >
                      ▶ Watch Now
                    </button>

                    <button
                      className="info-btn"
                      onClick={() =>
                        addToMyList(selectedMovie)
                      }
                    >
                      {myList.some(
                        (movie) =>
                          movie.id === selectedMovie.id
                      )
                        ? "✓ Added to My List"
                        : "+ Add to My List"}
                    </button>

                    {myList.some(
                      (movie) =>
                        movie.id === selectedMovie.id
                    ) && (
                      <button
                        className="remove-btn"
                        onClick={() =>
                          removeFromMyList(selectedMovie)
                        }
                      >
                        − Remove from My List
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Watch Screen */}
      {watchingMovie && (
        <div className="watch-screen">
          <button
            className="close-watch"
            onClick={() => setWatchingMovie(null)}
            aria-label="Close player"
          >
            ×
          </button>

          <div className="watch-content">
            <div className="video-placeholder">
              <div>
                <span>▶</span>
                <p>Tribell Movie Player</p>
              </div>
            </div>

            <h2>{watchingMovie.title}</h2>

            <p>
              {watchingMovie.release_date
                ? watchingMovie.release_date.slice(0, 4)
                : "Movie"}
            </p>

            <p className="watch-message">
              The movie player will be connected to Tribell's
              licensed video content in a future version.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer>
        <div className="footer-logo">TRIBELL</div>

        <p>
          © 2026 Tribell. Movie information provided by TMDB.
        </p>

        <p className="tmdb-attribution">
          This product uses the TMDB API but is not endorsed or
          certified by TMDB.
        </p>
      </footer>
    </div>
  );
}

export default App;