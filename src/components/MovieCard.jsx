function MovieCard({ movie }) {
  return (
    <div className="movie-card">
      <img src={movie.image} alt={movie.title} />

      <div className="movie-info">
        <h3>{movie.title}</h3>

        <p>
          {movie.year} • {movie.genre}
        </p>

        <span>★ {movie.rating}</span>
      </div>
    </div>
  )
}

export default MovieCard