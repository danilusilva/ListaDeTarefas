using System.ComponentModel.DataAnnotations;

namespace ListaDeTarefas.DTOs;

public record RegistrarRequest(
    [Required, EmailAddress(ErrorMessage = "E-mail inválido")]
    string? Email,
    [Required, MinLength(6, ErrorMessage = "Senha deve ter no mínimo 6 caracteres")]
    string? Senha
);

public record LoginRequest(
    [Required] string? Email,
    [Required] string? Senha
);

public record AuthResponse(string Token, string Email);