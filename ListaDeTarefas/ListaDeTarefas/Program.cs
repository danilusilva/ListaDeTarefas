using ListaDeTarefas;
using ListaDeTarefas.Data;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Configura PostgreSQL (Lê a string do Render ou Local)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ListaDeTarefasContext>(options =>
    options.UseNpgsql(connectionString));

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.UnmappedMemberHandling = System.Text.Json.Serialization.JsonUnmappedMemberHandling.Skip;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Description = "Insira apenas o token JWT abaixo",
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            Array.Empty<string>()
        }
    });
});

// 2. JWT com Verificação de Nulo (Evita erro de crash no Render)
var jwtKey = builder.Configuration["Jwt:Key"] ?? "Chave_Super_Secreta_De_Backup_32_Caracteres";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

builder.Services.AddAuthorization();

// 3. CORS Flexível para Produção
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// 4. Migrations Automáticas e Teste de Conexão
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ListaDeTarefasContext>();
    try
    {
        // Aplica as migrações (Cria as tabelas no Supabase automaticamente)
        if (db.Database.GetPendingMigrations().Any())
        {
            db.Database.Migrate();
            Console.WriteLine("✅ Migrações aplicadas!");
        }
        
        db.Database.OpenConnection();
        db.Database.CloseConnection();
        Console.WriteLine("✅ Banco conectado com sucesso!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Falha na conexão ou migração: {ex.Message}");
    }
}

// 5. Swagger disponível também em Produção (Útil para debugar no Render)
app.UseSwagger();
app.UseSwaggerUI(c => {
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
    c.RoutePrefix = string.Empty; // Faz o Swagger abrir na raiz da URL do Render
});

app.Use(async (context, next) =>
{
    try { await next(context); }
    catch (BadHttpRequestException ex)
    {
        context.Response.StatusCode = 400;
        var mensagem = ex.InnerException switch
        {
            System.Text.Json.JsonException json when json.Message.Contains("DateOnly")
                => "Prazo inválido. Use o formato yyyy-MM-dd.",
            _ => "Erro na requisição. Verifique os dados."
        };
        await context.Response.WriteAsJsonAsync(new { erro = mensagem });
    }
});

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

// Importante: Remova ou comente o HttpsRedirection se o Render reclamar de loop infinito
// app.UseHttpsRedirection(); 

app.MapTarefaEndpoints();
app.MapAuthEndpoints();

app.Run();

public partial class Program { }