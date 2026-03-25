FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Como você já está dentro da pasta ListaDeTarefas, o .csproj está na raiz ou em ./ListaDeTarefas/
# Se o .csproj estiver na mesma pasta que o Dockerfile, use:
COPY *.csproj ./
RUN dotnet restore

# Copia tudo da pasta atual para o container
COPY . ./
RUN dotnet publish -c Release -o /app/publish

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:10000
EXPOSE 10000

ENTRYPOINT ["dotnet", "ListaDeTarefas.dll"]