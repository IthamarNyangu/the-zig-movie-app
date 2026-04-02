using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using serverside.Repositories;
using Xunit;

namespace serverside.Tests
{
  public class MovieRepositoryTests
  {
    [Fact]
    public async Task GetPopularMovies_ReturnsResponseContent()
    {
      Environment.SetEnvironmentVariable("API_KEY", "fake-key");

      var handler = new FakeHttpMessageHandler("{\"results\":[]}");
      var httpClient = new HttpClient(handler);

      var repository = new MovieRepository(httpClient);

      var result = await repository.GetPopularMovies();

      Assert.Equal("{\"results\":[]}", result);
    }

    private class FakeHttpMessageHandler : HttpMessageHandler
    {
      private readonly string _responseContent;

      public FakeHttpMessageHandler(string responseContent)
      {
        _responseContent = responseContent;
      }

      protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
      {
        var response = new HttpResponseMessage(HttpStatusCode.OK)
        {
          Content = new StringContent(_responseContent)
        };

        return Task.FromResult(response);
      }
    }
  }
}