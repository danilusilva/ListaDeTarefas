namespace ListaDeTarefas.DTOs;

public record TarefaResponse(
    int Id,
    string Titulo,
    DateOnly Prazo,
    bool Concluido,
    DateTime CreatedAt
);
