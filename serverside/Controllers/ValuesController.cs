using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace serverside.Controllers
{
    [Route("api")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private static readonly HttpClient _httpClient = new HttpClient();
        private const string BaseUrl = "https://api.themoviedb.org/3";

        private string GetApiKey()
        {
            var apiKey = Environment.GetEnvironmentVariable("API_KEY");

            if (string.IsNullOrWhiteSpace(apiKey))
            {
                throw new Exception("API_KEY environment variable is missing.");
            }

            return apiKey;
        }

        [HttpGet("popular")]
        public async Task<IActionResult> GetPopular()
        {
            var apiKey = GetApiKey();
            var url = $"{BaseUrl}/movie/popular?api_key={apiKey}";

            var response = await _httpClient.GetAsync(url);
            var content = await response.Content.ReadAsStringAsync();

            return Content(content, "application/json");
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Query is required.");
            }

            var apiKey = GetApiKey();
            var encodedQuery = Uri.EscapeDataString(query);
            var url = $"{BaseUrl}/search/movie?api_key={apiKey}&query={encodedQuery}";

            var response = await _httpClient.GetAsync(url);
            var content = await response.Content.ReadAsStringAsync();

            return Content(content, "application/json");
        }

        [HttpGet("movie/{id}")]
        public async Task<IActionResult> GetMovie(int id)
        {
            var apiKey = GetApiKey();
            var url = $"{BaseUrl}/movie/{id}?api_key={apiKey}";

            var response = await _httpClient.GetAsync(url);
            var content = await response.Content.ReadAsStringAsync();

            return Content(content, "application/json");
        }
    }
}