using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace ListaDeTarefas.Filters;

public class ValidationFilter<T> : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next)
    {
        // Tenta obter o argumento do tipo T
        T? argument = default;
        foreach (var arg in context.Arguments)
        {
            if (arg is T typed)
            {
                argument = typed;
                break;
            }
        }

        if (argument is null)
            return Results.ValidationProblem(new Dictionary<string, string[]>
            {
                ["geral"] = ["Corpo da requisição inválido!"]
            });

        var errors = new Dictionary<string, List<string>>();

        // Em records posicionais, os atributos ficam nos parâmetros do construtor,
        // não nas propriedades — por isso precisamos ler dali.
        var ctor = typeof(T).GetConstructors().FirstOrDefault();
        if (ctor is not null)
        {
            foreach (var param in ctor.GetParameters())
            {
                // Busca a propriedade correspondente ao parâmetro
                var prop = typeof(T).GetProperty(
                    char.ToUpper(param.Name![0]) + param.Name[1..]);
                var value = prop?.GetValue(argument);

                // Valida cada atributo de validação do parâmetro do construtor
                foreach (var attr in param.GetCustomAttributes<ValidationAttribute>())
                {
                    if (!attr.IsValid(value))
                    {
                        var key = prop?.Name ?? param.Name;
                        if (!errors.ContainsKey(key))
                            errors[key] = [];
                        errors[key].Add(attr.ErrorMessage ?? $"{key} inválido");
                    }
                }
            }
        }

        if (errors.Count > 0)
            return Results.ValidationProblem(
                errors.ToDictionary(e => e.Key, e => e.Value.ToArray()));

        return await next(context);
    }
}