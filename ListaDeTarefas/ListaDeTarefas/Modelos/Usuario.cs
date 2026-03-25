namespace ListaDeTarefas.Modelos;

public class Usuario
{
    public int Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string SenhaHash { get; set; } = string.Empty;
    public ICollection<Tarefa> Tarefas { get; set; } = [];
}