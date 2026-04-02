using System;
using System.Net.Http;
using System.Threading.Tasks;

namespace serverside.Repositories
{
  public class MovieRepository : IMovieRepository
  {
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private const string BaseUrl = "https://api.themoviedb.org/3";

    public MovieRepository(HttpClient httpClient)
    {
      _httpClient = httpClient;
      _apiKey = Environment.GetEnvironmentVariable("API_KEY");

      if (string.IsNullOrWhiteSpace(_apiKey))
      {
        throw new Exception("API_KEY environment variable is missing.");
      }
    }

    public async Task<string> GetPopularMovies()
    {
      var url = $"{BaseUrl}/movie/popular?api_key={_apiKey}";
      var response = await _httpClient.GetAsync(url);
      return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> SearchMovies(string query)
    {
      var encodedQuery = Uri.EscapeDataString(query);
      var url = $"{BaseUrl}/search/movie?api_key={_apiKey}&query={encodedQuery}";
      var response = await _httpClient.GetAsync(url);
      return await response.Content.ReadAsStringAsync();
    }

    public async Task<string> GetMovie(int id)
    {
      var url = $"{BaseUrl}/movie/{id}?api_key={_apiKey}";
      var response = await _httpClient.GetAsync(url);
      return await response.Content.ReadAsStringAsync();
    }
  }
}