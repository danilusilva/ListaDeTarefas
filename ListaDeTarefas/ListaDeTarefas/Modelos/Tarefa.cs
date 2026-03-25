using System.ComponentModel.DataAnnotations.Schema;

namespace ListaDeTarefas.Modelos;

public class Tarefa
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public DateOnly Prazo { get; set; }

    public bool Concluido { get; set; }
    public DateTime CreatedAt { get; set; }
    public int UsuarioId { get; set; }
    public Usuario Usuario { get; set; } = null!;
}