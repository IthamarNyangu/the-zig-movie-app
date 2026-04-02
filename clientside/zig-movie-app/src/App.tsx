import React from 'react';
import './App.css';

interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  homepage?: string;
  poster_path?: string;
}

interface AppState {
  movies: Movie[];
  loading: boolean;
  error: string;
  searchQuery: string;
  selectedMovie: Movie | null;
  detailsLoading: boolean;
}

class App extends React.Component<{}, AppState> {
  public state: AppState = {
    movies: [],
    loading: true,
    error: '',
    searchQuery: '',
    selectedMovie: null,
    detailsLoading: false,
  };

  public componentDidMount() {
    this.loadPopularMovies();
  }

  public loadPopularMovies = () => {
    this.setState({
      loading: true,
      error: '',
      selectedMovie: null,
    });

    fetch('https://localhost:5001/api/popular')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch popular movies.');
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          movies: data.results || [],
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          error: 'Could not load popular movies. Make sure the server is running.',
          loading: false,
        });
      });
  };

  public searchMovies = () => {
    const { searchQuery } = this.state;

    if (!searchQuery.trim()) {
      this.loadPopularMovies();
      return;
    }

    this.setState({
      loading: true,
      error: '',
      selectedMovie: null,
    });

    fetch(`https://localhost:5001/api/search?query=${encodeURIComponent(searchQuery)}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to search movies.');
        }
        return response.json();
      })
      .then(data => {
        this.setState({
          movies: data.results || [],
          loading: false,
        });
      })
      .catch(() => {
        this.setState({
          error: 'Could not search movies.',
          loading: false,
        });
      });
  };

  public handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: event.target.value });
  };

  public handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.searchMovies();
    }
  };

  public loadMovieDetails = (movieId: number) => {
    this.setState({
      detailsLoading: true,
      error: '',
    });

    fetch(`https://localhost:5001/api/movie/${movieId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch movie details.');
        }
        return response.json();
      })
      .then(data => {
        if (data.success === false) {
          this.setState({
            error: data.status_message || 'Movie not found.',
            detailsLoading: false,
          });
          return;
        }

        this.setState({
          selectedMovie: data,
          detailsLoading: false,
        });
      })
      .catch(() => {
        this.setState({
          error: 'Could not load movie details.',
          detailsLoading: false,
        });
      });
  };

  public goBackToList = () => {
    this.setState({
      selectedMovie: null,
      error: '',
    });
  };

  public renderMovieList() {
  const { movies, loading, error, searchQuery } = this.state;

  return (
    <div className="container">
      <h1>Popular Movies</h1>
      <p className="subtitle">Search movies or browse popular titles</p>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by movie title..."
          value={searchQuery}
          onChange={this.handleInputChange}
          onKeyDown={this.handleKeyDown}
        />
        <button onClick={this.searchMovies}>Search</button>
        <button onClick={this.loadPopularMovies}>Reset</button>
      </div>

      {loading && <p>Loading movies...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && movies.length === 0 && (
        <p className="subtitle">No movies found.</p>
      )}

      <div className="movie-list">
        {movies.map(movie => (
          <div key={movie.id} className="movie-card">
            {movie.poster_path && (
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
                className="movie-card-poster"
              />
            )}

            <div className="movie-card-content">
              <h2>
                <button
                  className="movie-title-button"
                  onClick={() => this.loadMovieDetails(movie.id)}
                >
                  {movie.title}
                </button>
              </h2>
              <p><strong>Release date:</strong> {movie.release_date || 'Unknown'}</p>
              <p>{movie.overview || 'No description available.'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

  public renderMovieDetails() {
    const { selectedMovie, detailsLoading, error } = this.state;

    if (detailsLoading) {
      return (
        <div className="container">
          <p>Loading movie details...</p>
        </div>
      );
    }

    if (!selectedMovie) {
      return null;
    }

    const posterUrl = selectedMovie.poster_path
      ? `https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`
      : '';

    return (
      <div className="container">
        <button className="back-button" onClick={this.goBackToList}>
          ← Back to movies
        </button>

        {error && <p className="error">{error}</p>}

        <div className="details-card">
          {posterUrl && (
            <img
              src={posterUrl}
              alt={selectedMovie.title}
              className="movie-poster"
            />
          )}

          <div className="details-content">
            {selectedMovie.homepage ? (
              <h1>
                <a
                  href={selectedMovie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="movie-title-link"
                >
                  {selectedMovie.title}
                </a>
              </h1>
            ) : (
              <h1>{selectedMovie.title}</h1>
            )}

            <p><strong>Release date:</strong> {selectedMovie.release_date || 'Unknown'}</p>
            <p>{selectedMovie.overview || 'No description available.'}</p>
          </div>
        </div>
      </div>
    );
  }

  public render() {
    const { selectedMovie } = this.state;

    return (
      <div className="app">
        {selectedMovie ? this.renderMovieDetails() : this.renderMovieList()}
      </div>
    );
  }
}

export default App;