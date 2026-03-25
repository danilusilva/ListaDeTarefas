using FluentAssertions;
using ListaDeTarefas.DTOs;
using System.Net;
using System.Net.Http.Json;

namespace Tests;

public class TarefaEndpointsTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public TarefaEndpointsTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task CreateTarefa_RequestValido_Retorna201()
    {
        var request = new CriarTarefaRequest("Estudar .NET 10", new DateOnly(2025, 12, 31));

        var response = await _client.PostAsJsonAsync("/api/Tarefa", request);

        response.StatusCode.Should().Be(HttpStatusCode.Created);
        var tarefa = await response.Content.ReadFromJsonAsync<TarefaResponse>();
        tarefa!.Titulo.Should().Be("Estudar .NET 10");
        tarefa.Id.Should().BeGreaterThan(0);
        tarefa.Concluido.Should().BeFalse();
    }

    [Fact]
    public async Task CreateTarefa_SemTitulo_Retorna400()
    {
        var payload = new { Prazo = "2025-12-31" };

        var response = await _client.PostAsJsonAsync("/api/Tarefa", payload);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);

    }

    [Fact]
    public async Task CreateTarefa_TituloMenorQue3Caracteres_Retorna400()
    {
        var request = new CriarTarefaRequest("AB", new DateOnly(2025, 12, 31));

        var response = await _client.PostAsJsonAsync("/api/Tarefa", request);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task GetTarefaById_TarefaExistente_Retorna200()
    {
        var created = await _client.PostAsJsonAsync("/api/Tarefa",
            new CriarTarefaRequest("Tarefa para buscar", new DateOnly(2025, 12, 31)));
        var tarefa = await created.Content.ReadFromJsonAsync<TarefaResponse>();

        var response = await _client.GetAsync($"/api/Tarefa/{tarefa!.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var resultado = await response.Content.ReadFromJsonAsync<TarefaResponse>();
        resultado!.Titulo.Should().Be("Tarefa para buscar");
    }

    [Fact]
    public async Task GetTarefaById_TarefaInexistente_Retorna404()
    {
        var response = await _client.GetAsync("/api/Tarefa/99999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateTarefa_TarefaExistente_Retorna204()
    {
        var created = await _client.PostAsJsonAsync("/api/Tarefa",
            new CriarTarefaRequest("Tarefa original", new DateOnly(2025, 12, 31)));
        var tarefa = await created.Content.ReadFromJsonAsync<TarefaResponse>();

        var update = new AtualizarTarefaRequest("Tarefa atualizada", new DateOnly(2025, 12, 31), true);
        var response = await _client.PutAsJsonAsync($"/api/Tarefa/{tarefa!.Id}", update);

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task UpdateTarefa_TarefaInexistente_Retorna404()
    {
        var update = new AtualizarTarefaRequest("Qualquer", new DateOnly(2025, 12, 31), false);

        var response = await _client.PutAsJsonAsync("/api/Tarefa/99999", update);

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteTarefa_TarefaExistente_Retorna204()
    {
        var created = await _client.PostAsJsonAsync("/api/Tarefa",
            new CriarTarefaRequest("Tarefa para deletar", new DateOnly(2025, 12, 31)));
        var tarefa = await created.Content.ReadFromJsonAsync<TarefaResponse>();

        var response = await _client.DeleteAsync($"/api/Tarefa/{tarefa!.Id}");

        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task DeleteTarefa_TarefaInexistente_Retorna404()
    {
        var response = await _client.DeleteAsync("/api/Tarefa/99999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }
}