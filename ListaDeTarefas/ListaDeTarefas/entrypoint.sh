#!/bin/bash
# Executa migrações do banco
dotnet ef database update --no-build
# Inicia a aplicação
exec dotnet ListaDeTarefas.dll