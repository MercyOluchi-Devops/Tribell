import { useEffect, useState } from "react";
import "./App.css";

const movies = [
  {
    title: "The Dark Knight",
    image:
      "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    category: "Action",
    genre: "Action, Crime",
    year: "2008",
    duration: "2h 32m",
    rating: "9.0",
    description:
      "A masked hero faces a dangerous criminal who pushes Gotham into chaos.",
director: "Christopher Nolan",
  cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
},
  {
    title: "Interstellar",
    image:
      "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    category: "Sci-Fi",
    genre: "Sci-Fi, Drama",
    year: "2014",
    duration: "2h 49m",
    rating: "8.7",
    description:
       "A team of explorers travels beyond our galaxy in search of a future for humanity.",
        director: "Christopher Nolan",
        cast: ["Matthew McConaughey", "Anne Hathaway", "Jessica Chastain"], 
      },
     {
    title: "Inception",
    image:
      "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    category: "Thriller",
    genre: "Sci-Fi, Thriller",
    year: "2010",
    duration: "2h 28m",
    rating: "8.8",
    description:
      "A skilled specialist enters people's dreams to influence their thoughts and decisions.",
director: "Christopher Nolan",
cast: ["Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page"],
  },
  {
    title: "Avengers: Endgame",
    image:
      "https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    category: "Adventure",
    genre: "Action, Adventure",
    year: "2019",
    duration: "3h 1m",
    rating: "8.4",
    description:
      "The remaining heroes attempt to reverse a devastating event and restore what was lost.",

      director: "Anthony Russo & Joe Russo",
cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
  },
  {
    title: "Black Panther",
    image:
      "https://image.tmdb.org/t/p/w500/uxzzxijgPIY7slzFvMotPv8wjKA.jpg",
    category: "Action",
    genre: "Action, Adventure",
    year: "2018",
    duration: "2h 14m",
    rating: "7.3",
    description:
      "A new king must protect his nation while facing a powerful challenger from within.",

      director: "Ryan Coogler",
cast: ["Chadwick Boseman", "Michael B. Jordan", "Lupita Nyong'o"],
  },
];

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchingMovie, setWatchingMovie] = useState(null);
  const [myList, setMyList] = useState(() => {
  const savedList = localStorage.getItem("tribellMyList");

  return savedList ? JSON.parse(savedList) : [];
});
useEffect(() => {
  localStorage.setItem("tribellMyList", JSON.stringify(myList));
}, [myList]);
 const [searchTerm, setSearchTerm] = useState("");
const [searchOpen, setSearchOpen] = useState(false);
const [selectedCategory, setSelectedCategory] = useState("All");
  const filteredMovies = movies.filter((movie) => {
  const matchesSearch = movie.title
    .toLowerCase()
    .includes(searchTerm.toLowerCase());

  const matchesCategory =
    selectedCategory === "All" ||
    movie.category === selectedCategory;

  return matchesSearch && matchesCategory;
});

  return (
    <div className="app">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">TRIBELL</div>

        <nav>
          <a href="#home">Home</a>
          <a href="#movies">Movies</a>
          <a href="#series">Series</a>
          <a href="#my-list">My List</a>
        </nav>

        <div className="nav-actions">
          {searchOpen && (
            <div className="search-container">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                autoFocus
              />
            </div>
          )}

          <button
            className="search-btn"
            onClick={() => setSearchOpen(!searchOpen)}
            aria-label="Search"
          >
            ⌕
          </button>

          <button className="profile-btn">M</button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
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
              <button className="watch-btn">▶ Watch Now</button>
              <button className="info-btn">＋ More Info</button>
            </div>
          </div>
        </section>

        {/* Trending Movies */}
        <section className="movie-section" id="movies">
         <div className="section-heading">
  <h2>Trending Now</h2>

  <div className="category-filters">
    {["All", "Action", "Sci-Fi", "Thriller", "Adventure"].map(
      (category) => (
        <button
          key={category}
          className={
            selectedCategory === category ? "active" : ""
          }
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>
      )
    )}
  </div>
</div>

          <div className="movie-grid">
            {filteredMovies.length > 0 ? (
              filteredMovies.map((movie) => (
                <article
                  className="movie-card"
                  key={movie.title}
                  onClick={() => setSelectedMovie(movie)}
                >
                  <img src={movie.image} alt={movie.title} />

                  <div className="movie-overlay">
                    <span>{movie.category}</span>
                    <h3>{movie.title}</h3>
                    <button>▶</button>
                  </div>
                </article>
              ))
            ) : (
              <p className="empty-list">No movies found.</p>
            )}
          </div>
        </section>

        {/* Movie Modal */}
        {selectedMovie && (
          <div className="movie-modal">
            <div className="movie-modal-content">
              <button
                className="close-modal"
                onClick={() => setSelectedMovie(null)}
              >
                ×
              </button>

              <img
                src={selectedMovie.image}
                alt={selectedMovie.title}
              />

              <div className="movie-modal-info">
  <p>{selectedMovie.category}</p>

  <h2>{selectedMovie.title}</h2>

  <div className="movie-meta">
    <span>⭐ {selectedMovie.rating}</span>
    <span>{selectedMovie.year}</span>
    <span>{selectedMovie.duration}</span>
    <span>{selectedMovie.genre}</span>
  </div>

  <p className="movie-description">
    {selectedMovie.description}
  </p>
  
  <div className="movie-credits">
  <p>
    <strong>Director:</strong> {selectedMovie.director}
  </p>

  <p>
    <strong>Cast:</strong>{" "}
    {selectedMovie.cast.join(", ")}
  </p>
</div>

<div className="similar-movies">
  <h3>More Like This</h3>

  <div className="similar-movie-list">
    {movies
      .filter(
        (movie) =>
          movie.category === selectedMovie.category &&
          movie.title !== selectedMovie.title
      )
      .map((movie) => (
        <button
          key={movie.title}
          className="similar-movie"
          onClick={() => setSelectedMovie(movie)}
        >
          <img src={movie.image} alt={movie.title} />
          <span>{movie.title}</span>
        </button>
      ))}
  </div>
</div>


                <button
  className="watch-btn"
  onClick={() => {
    setWatchingMovie(selectedMovie);
    setSelectedMovie(null);
  }}
>
  ▶ Watch Now
</button>

                {/* Add to My List */}
                <button
                  className="info-btn"
                  onClick={() => {
                    setMyList((currentList) => {
                      if (
                        currentList.some(
                          (movie) =>
                            movie.title === selectedMovie.title
                        )
                      ) {
                        return currentList;
                      }

                      return [...currentList, selectedMovie];
                    });
                  }}
                >
                  {myList.some(
                    (movie) =>
                      movie.title === selectedMovie.title
                  )
                    ? "✓ Added to My List"
                    : "+ Add to My List"}
                </button>

                {/* Remove from My List */}
                {myList.some(
                  (movie) =>
                    movie.title === selectedMovie.title
                ) && (
                  <button
                    className="remove-btn"
                    onClick={() => {
                      setMyList((currentList) =>
                        currentList.filter(
                          (movie) =>
                            movie.title !== selectedMovie.title
                        )
                      );

                      setSelectedMovie(null);
                    }}
                  >
                    − Remove from My List
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {watchingMovie && (
  <div className="watch-screen">
    <button
      className="close-watch"
      onClick={() => setWatchingMovie(null)}
    >
      ×
    </button>

    <div className="watch-content">
      <div className="video-placeholder">
        <div>
          <span>▶</span>
          <p>Movie Player</p>
        </div>
      </div>

      <h2>{watchingMovie.title}</h2>

      <p>{watchingMovie.category}</p>

      <p className="watch-message">
        The movie player will be connected to Tribell's licensed
        video content in a future version.
      </p>
    </div>
  </div>
)}

        {/* Coming Soon */}
        <section className="coming-section" id="series">
          <div>
            <p className="small-label">COMING SOON</p>

            <h2>Your next favorite story is waiting.</h2>

            <p>
              Tribell is being built to make discovering great movies
              simple, beautiful, and enjoyable.
            </p>
          </div>

          <button className="explore-btn">Explore More</button>
        </section>

        {/* My List */}
        <section className="movie-section" id="my-list">
          <div className="section-heading">
            <h2>My List</h2>
          </div>

          {myList.length === 0 ? (
            <p className="empty-list">
              You haven't added any movies to your list yet.
            </p>
          ) : (
            <div className="movie-grid">
              {myList.map((movie) => (
                <article
                  className="movie-card"
                  key={movie.title}
                  onClick={() => setSelectedMovie(movie)}
                >
                  <img src={movie.image} alt={movie.title} />

                  <div className="movie-overlay">
                    <span>{movie.category}</span>
                    <h3>{movie.title}</h3>
                    <button>▶</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer>
        <div className="footer-logo">TRIBELL</div>

        <p>
          © 2026 Tribell. Built to make discovering stories
          more enjoyable.
        </p>
      </footer>
    </div>
  );
}

export default App;

