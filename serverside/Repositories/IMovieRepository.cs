using System.Threading.Tasks;

namespace serverside.Repositories
{
  public interface IMovieRepository
  {
    Task<string> GetPopularMovies();
    Task<string> SearchMovies(string query);
    Task<string> GetMovie(int id);
  }
}