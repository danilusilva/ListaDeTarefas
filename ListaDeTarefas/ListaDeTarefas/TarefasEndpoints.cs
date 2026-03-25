using Microsoft.EntityFrameworkCore;
using ListaDeTarefas.Modelos;
using ListaDeTarefas.Data;
using ListaDeTarefas.DTOs;
using ListaDeTarefas.Filters;
using System.Security.Claims;


namespace ListaDeTarefas;

public static class TarefaEndpoints
{
    public static void MapTarefaEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/Tarefa").WithTags(nameof(Tarefa));

        group.MapGet("/", async (HttpContext ctx, ListaDeTarefasContext db) =>
        {
            var uid = GetUsuarioId(ctx);
            var tarefas = await db.Tarefa.AsNoTracking()
                .Where(t => t.UsuarioId == uid)
                .ToListAsync();
            return Results.Ok(tarefas.Select(ToResponse));
        }).RequireAuthorization();

        group.MapGet("/{id}", async (int id, HttpContext ctx, ListaDeTarefasContext db) =>
        {
            var uid = GetUsuarioId(ctx);
            var tarefa = await db.Tarefa.AsNoTracking()
                .FirstOrDefaultAsync(t => t.Id == id && t.UsuarioId == uid);
            return tarefa is null ? Results.NotFound() : Results.Ok(ToResponse(tarefa));
        }).RequireAuthorization();

        group.MapPost("/", async (CriarTarefaRequest request, HttpContext ctx, ListaDeTarefasContext db) =>
        {
            var tarefa = new Tarefa
            {
                Titulo = request.Titulo!,
                Prazo = request.Prazo!.Value,
                Concluido = false,
                CreatedAt = DateTime.UtcNow,
                UsuarioId = GetUsuarioId(ctx)
            };
            db.Tarefa.Add(tarefa);
            await db.SaveChangesAsync();
            return Results.Created($"/api/Tarefa/{tarefa.Id}", ToResponse(tarefa));
        })
        .AddEndpointFilter<ValidationFilter<CriarTarefaRequest>>()
        .RequireAuthorization();

        group.MapPut("/{id}", async (int id, AtualizarTarefaRequest request, HttpContext ctx, ListaDeTarefasContext db) =>
        {
            var uid = GetUsuarioId(ctx);
            var affected = await db.Tarefa
                .Where(t => t.Id == id && t.UsuarioId == uid) // ← filtra pelo usuário
                .ExecuteUpdateAsync(setters => setters
                    .SetProperty(m => m.Titulo, request.Titulo)
                    .SetProperty(m => m.Prazo, request.Prazo)
                    .SetProperty(m => m.Concluido, request.Concluido)
                );
            return affected == 1 ? Results.NoContent() : Results.NotFound();
        })
        .AddEndpointFilter<ValidationFilter<AtualizarTarefaRequest>>()
        .RequireAuthorization();

        group.MapDelete("/{id}", async (int id, HttpContext ctx, ListaDeTarefasContext db) =>
        {
            var uid = GetUsuarioId(ctx);
            var affected = await db.Tarefa
                .Where(t => t.Id == id && t.UsuarioId == uid) // ← filtra pelo usuário
                .ExecuteDeleteAsync();
            return affected == 1 ? Results.NoContent() : Results.NotFound();
        })
        .RequireAuthorization();
    }

    private static int GetUsuarioId(HttpContext ctx) =>
        int.Parse(ctx.User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    private static TarefaResponse ToResponse(Tarefa tarefa) =>
        new(tarefa.Id, tarefa.Titulo, tarefa.Prazo, tarefa.Concluido, tarefa.CreatedAt);
}