# Estágio de Build
FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# O segredo: Copiar a partir da estrutura que você tem
# Se o Dockerfile está na "pasta 1", o comando abaixo busca o .csproj na "pasta 2"
COPY ListaDeTarefas/*.csproj ./
RUN dotnet restore

# Copia o código fonte e publica
COPY ListaDeTarefas/ ./
RUN dotnet publish -c Release -o /app/publish

# Estágio de Runtime
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

# DICA PRO RENDER: Eles usam a porta 10000 por padrão
ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "ListaDeTarefas.dll"]