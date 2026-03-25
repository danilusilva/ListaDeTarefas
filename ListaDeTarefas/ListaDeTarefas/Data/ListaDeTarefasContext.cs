using System.Dynamic;
using ListaDeTarefas.Modelos;
using Microsoft.EntityFrameworkCore;

namespace ListaDeTarefas.Data;

public class ListaDeTarefasContext : DbContext
{
    public ListaDeTarefasContext(DbContextOptions<ListaDeTarefasContext> options) 
            : base(options)
    {
    }

    public DbSet<ListaDeTarefas.Modelos.Tarefa> Tarefa { get; set; } = default!;
    public DbSet<Usuario> Usuario => Set<Usuario>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Tarefa>()
            .Property(t => t.Concluido)
            .HasColumnType("boolean");

        modelBuilder.Entity<Tarefa>()
            .HasOne(t => t.Usuario)
            .WithMany(u => u.Tarefas)
            .HasForeignKey(t => t.UsuarioId);
    }
}
