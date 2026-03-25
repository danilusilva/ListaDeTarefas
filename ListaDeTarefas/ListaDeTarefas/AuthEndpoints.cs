using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ListaDeTarefas.Data;
using ListaDeTarefas.DTOs;
using ListaDeTarefas.Filters;
using ListaDeTarefas.Modelos;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace ListaDeTarefas;

public static class AuthEndpoints
{
    public static void MapAuthEndpoints(this IEndpointRouteBuilder routes)
    {
        var group = routes.MapGroup("/api/auth").WithTags("Auth");

        group.MapPost("/registrar", async (RegistrarRequest request, ListaDeTarefasContext db) =>
        {
            var existe = await db.Usuario.CountAsync(u => u.Email == request.Email);
            if (existe > 0)
                return Results.Conflict(new { erro = "E-mail já cadastrado." });

            var usuario = new Usuario
            {
                Email = request.Email!,
                SenhaHash = BCrypt.Net.BCrypt.HashPassword(request.Senha)
            };

            db.Usuario.Add(usuario);
            await db.SaveChangesAsync();

            return Results.Created($"/api/auth/{usuario.Id}", new { usuario.Id, usuario.Email });
        })
        .AddEndpointFilter<ValidationFilter<RegistrarRequest>>();

        group.MapPost("/login", async (LoginRequest request, ListaDeTarefasContext db, IConfiguration config) =>
        {
            var usuario = await db.Usuario.FirstOrDefaultAsync(u => u.Email == request.Email);

            if (usuario is null || !BCrypt.Net.BCrypt.Verify(request.Senha, usuario.SenhaHash))
                return Results.Unauthorized();

            var token = GerarToken(usuario, config);
            return Results.Ok(new AuthResponse(token, usuario.Email));
        })
        .AddEndpointFilter<ValidationFilter<LoginRequest>>();
    }

    private static string GerarToken(Usuario usuario, IConfiguration config)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(config["Jwt:Key"]!));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, usuario.Id.ToString()),
            new Claim(ClaimTypes.Email, usuario.Email)
        };

        var token = new JwtSecurityToken(
            issuer: config["Jwt:Issuer"],
            audience: config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(8),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}