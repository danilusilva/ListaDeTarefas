using System.ComponentModel.DataAnnotations;

namespace ListaDeTarefas.DTOs;

public record AtualizarTarefaRequest(
    [Required(ErrorMessage = "Título é obrigatório")]
    [MinLength(3, ErrorMessage = "Título deve ter no mínimo 3 caracteres")]
    [MaxLength(100, ErrorMessage = "Título deve ter no máximo 100 caracteres")]
    string? Titulo,

    [Required(ErrorMessage = "Prazo é obrigatório")]
    DateOnly Prazo,

    bool Concluido
);
