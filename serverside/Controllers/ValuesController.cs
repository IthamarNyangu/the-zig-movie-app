using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using serverside.Repositories;

namespace serverside.Controllers
{
    [Route("api")]
    [ApiController]
    public class ValuesController : ControllerBase
    {
        private readonly IMovieRepository _movieRepository;

        public ValuesController(IMovieRepository movieRepository)
        {
            _movieRepository = movieRepository;
        }

        [HttpGet("popular")]
        public async Task<IActionResult> GetPopular()
        {
            var content = await _movieRepository.GetPopularMovies();
            return Content(content, "application/json");
        }

        [HttpGet("search")]
        public async Task<IActionResult> Search([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Query is required.");
            }

            var content = await _movieRepository.SearchMovies(query);
            return Content(content, "application/json");
        }

        [HttpGet("movie/{id}")]
        public async Task<IActionResult> GetMovie(int id)
        {
            var content = await _movieRepository.GetMovie(id);
            return Content(content, "application/json");
        }
    }
}