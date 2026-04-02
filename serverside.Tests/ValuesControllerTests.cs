using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Moq;
using serverside.Controllers;
using serverside.Repositories;
using Xunit;

namespace serverside.Tests
{
  public class ValuesControllerTests
  {
    [Fact]
    public async Task GetPopular_ReturnsJsonContent()
    {
      var mockRepo = new Mock<IMovieRepository>();
      mockRepo.Setup(repo => repo.GetPopularMovies())
              .ReturnsAsync("{\"results\":[]}");

      var controller = new ValuesController(mockRepo.Object);

      var result = await controller.GetPopular();

      var contentResult = Assert.IsType<ContentResult>(result);
      Assert.Equal("application/json", contentResult.ContentType);
      Assert.Equal("{\"results\":[]}", contentResult.Content);
    }

    [Fact]
    public async Task Search_WithEmptyQuery_ReturnsBadRequest()
    {
      var mockRepo = new Mock<IMovieRepository>();
      var controller = new ValuesController(mockRepo.Object);

      var result = await controller.Search("");

      Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task Search_WithQuery_ReturnsJsonContent()
    {
      var mockRepo = new Mock<IMovieRepository>();
      mockRepo.Setup(repo => repo.SearchMovies("avatar"))
              .ReturnsAsync("{\"results\":[{\"title\":\"Avatar\"}]}");

      var controller = new ValuesController(mockRepo.Object);

      var result = await controller.Search("avatar");

      var contentResult = Assert.IsType<ContentResult>(result);
      Assert.Equal("application/json", contentResult.ContentType);
      Assert.Contains("Avatar", contentResult.Content);
    }

    [Fact]
    public async Task GetMovie_ReturnsJsonContent()
    {
      var mockRepo = new Mock<IMovieRepository>();
      mockRepo.Setup(repo => repo.GetMovie(83533))
              .ReturnsAsync("{\"id\":83533,\"title\":\"Avatar: Fire and Ash\"}");

      var controller = new ValuesController(mockRepo.Object);

      var result = await controller.GetMovie(83533);

      var contentResult = Assert.IsType<ContentResult>(result);
      Assert.Equal("application/json", contentResult.ContentType);
      Assert.Contains("83533", contentResult.Content);
    }
  }
}