import React from 'react';
import './App.css';

interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
}

interface AppState {
  movies: Movie[];
  loading: boolean;
  error: string;
  searchQuery: string;
}

class App extends React.Component<{}, AppState> {
  public state: AppState = {
    movies: [],
    loading: true,
    error: '',
    searchQuery: '',
  };

  public componentDidMount() {
    this.loadPopularMovies();
  }

  public loadPopularMovies = () => {
    this.setState({ loading: true, error: '' });

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

    this.setState({ loading: true, error: '' });

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

  public render() {
    const { movies, loading, error, searchQuery } = this.state;

    return (
      <div className="app">
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
                <h2>{movie.title}</h2>
                <p><strong>Release date:</strong> {movie.release_date || 'Unknown'}</p>
                <p>{movie.overview || 'No description available.'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;