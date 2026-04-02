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
}

class App extends React.Component<{}, AppState> {
  public state: AppState = {
    movies: [],
    loading: true,
    error: '',
  };

  public componentDidMount() {
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
          error: 'Could not load movies. Make sure the server is running.',
          loading: false,
        });
      });
  }

  public render() {
    const { movies, loading, error } = this.state;

    return (
      <div className="app">
        <div className="container">
          <h1>Popular Movies</h1>
          <p className="subtitle">Top movies from the API</p>

          {loading && <p>Loading movies...</p>}
          {error && <p className="error">{error}</p>}

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