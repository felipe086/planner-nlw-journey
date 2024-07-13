<h1 align="center">Plann.er</h1>

<p align="center">
O Plann.er é uma API desenvolvida durante o evento NLW Journey, um evento da Rocketseat realizado em 2024.

Com o Plann.er, os usuários encontram uma maneira prática e simples de organizar e gerenciar suas viagens, sejam elas sozinhos ou em grupo! Tornando o gerenciamento das viagens fácil e livrando os usuários de estresse.

</p>

<p align="center">
  <a href="#requisitos">Requisitos</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#configuração">Configuração</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#routes">Endpoints</a>
</p>

<h2 id="requisitos" align="center">Requisitos da aplicação</h2>

- A aplicação deve poder registrar uma nova viagem, com as seguintes informações:
  - Destino.
  - Data de início da viagem.
  - Data de término da viagem.
  - Nome do responsável.
  - Email do responsável.
  - Email para convite.
- Deve ser possível editar uma viagem, podendo alterar as seguintes informações:
  - Destino.
  - Data de início da viagem.
  - Data de término da viagem.
- A aplicação deve poder visualizar dados detalhados da viagem.
- A aplicação deve poder confirmar a viagem.
- A aplicação deve poder confirmar o participante na viagem.
- A aplicação deve poder visualizar os participantes.
- A aplicação deve poder visualizar um participante em específico.
- A aplicação deve poder criar atividades para a viagem, contendo as seguintes informações.
  - Título.
  - Ocorre em.
- A aplicação deve poder visualizar as atividades.
- A aplicação deve poder criar links para a viagem, contendo as seguintes informações.
  - Título.
  - URL.
- A aplicação deve poder visualizar os links.
- A aplicação deve poder criar um convite para a viagem, contendo as seguintes informações.
  - Email.

<h2 id="tecnologias" align="center">Tecnologias</h2>

- Typescript
- Fastify
- Prisma
- Nodemailer

<h2 id="configuração" align="center">Configuração</h2>

- Clone o repositório (`git clone https://github.com/felipe086/planner-nlw-journey`) e (`cd planner-nlw-journey`).
- Configure as variáveis de ambiente (`.env`) de acordo com o arquivo `.env.example` de exemplo.
- Instale as dependências (`npm install`).
- Rode as migrations do banco de dados (`npm run migrations`)
- Para desenvolvimento execute (`npm run dev`).
- Rode (`npm run build`) para gerar um build da aplicação, e (`npm run start`) para executar.

<h2 id="routes" align="center">Endpoints</h2>

### POST `/api/trips`

Cria uma viagem.

- Body:

```json
{
  "destination": "São Paulo, Brasil",
  "starts_at": "2024-08-18T14:25:35.892Z",
  "ends_at": "2024-08-24T14:25:35.892Z",
  "owner_name": "Felipe",
  "owner_email": "contato@fgo.com",
  "emails_to_invite": ["test@test.com"]
}
```

### GET `/api/trips/:tripId`

Lista os detalhes de uma viagem.

- Parâmetros:
  - `tripId` (string, uuid): Id da viagem.
- Resposta:

```json
{
  "trip": {
    "id": "4d7bc02d-3c40-4843-a510-0cab3cff36a8",
    "destination": "São Paulo, Brasil",
    "starts_at": "2024-08-18T14:25:35.892Z",
    "ends_at": "2024-08-24T14:25:35.892Z",
    "is_confirmed": false
  }
}
```

### GET `/api/trips/:tripId/confirm`

Confirma uma viagem.

- Parâmetros:
  - `tripId` (string, uuid): Id da viagem.

### PUT `/api/trips/:tripId`

Atualiza informaçÕes de uma viagem.

- Parâmetros:
  - `tripId` (string, uuid): Id da viagem.
- Body:

```json
{
  "destination": "São Paulo, Brasil",
  "starts_at": "2025-01-20T08:00:00.892Z",
  "ends_at": "2025-02-01T08:00:00.892Z"
}
```

### GET `/api/trips/:tripId/invite`

Convida um participante para uma viagem.

- Parâmetros:
  - `tripId` (string, uuid): Id da viagem.
- Body:

```json
{
  "email": "participante@email.com"
}
```

### POST `/api/trips/:tripId/activities`

Cria uma atividade para uma viagem.

- Parâmetros:
  - `tripId` (string, uuid): Id da viagem.
- Body:

```json
{
  "title": "Passeio liberdade",
  "occurs_at": "2025-01-21T08:00:00.892Z"
}
```

### GET `/api/trips/:tripId/activities`

Lista as atividades de uma viagem.

- Parâmetros:
  - `tripId` (string, uuid): Id da viagem.
- Resposta:

```json
{
  "activities": [
    {
      "date": "2025-01-20T08:00:00.892Z",
      "activities": []
    },
    {
      "date": "2025-01-21T08:00:00.892Z",
      "activities": [
        {
          "id": "2ee9357f-bed8-4b5f-8b0a-a24048324939",
          "title": "Passeio liberdade",
          "occurs_at": "2025-01-21T13:00:00.892Z",
          "trip_id": "4d7bc02d-3c40-4843-a510-0cab3cff36a8"
        }
      ]
    },
    ....
  ]
}
```

### POST `/api/trips/:tripId/links`

Cria um link conteúdo para uma viagem.

- Parâmetros:
  - `tripId` (string, uuid): Id da viagem.
- Body:

```json
{
  "title": "Japão - Liberdade - Mapa",
  "url": "https://maps.app.goo.gl/PRwPzXiCKP4XheKZ8"
}
```

### GET `/api/trips/:tripId/links`

Lista os links de uma viagem.

- Parâmetros:
  - `tripId` (string, uuid): Id da viagem.
- Resposta:

```json
{
  "links": [
    {
      "id": "f7b932b7-330c-4551-a846-d7b6b4a9e000",
      "title": "Japão - Liberdade - Mapa",
      "url": "https://maps.app.goo.gl/PRwPzXiCKP4XheKZ8",
      "trip_id": "4d7bc02d-3c40-4843-a510-0cab3cff36a8"
    }
  ]
}
```

### GET `/api/participants/:participantId/confirm`

Confirma a participação em uma viagem.

- Parâmetros:
  - `participantId` (string, uuid): Id da viagem.

### `/api/participants/:participantId`

Lista os detalhes de uma participante.

- Parâmetros:
  - `participantId` (string, uuid): Id da viagem.
- Resposta:

```json
{
  "participant": {
    "id": "b228fa2d-c281-45e8-9b23-a8989e0013ab",
    "name": "Felipe",
    "email": "contato@fgo.com",
    "is_confirmed": true
  }
}
```

### `/api/trips/:tripId/participants`

Lista os participantes de uma viagem.

- Parâmetros:
  - `tripId` (string, uuid): Id da viagem.
- Resposta:

```json
{
  "participants": [
    {
      "id": "b228fa2d-c281-45e8-9b23-a8989e0013ab",
      "name": "Felipe",
      "email": "contato@fgo.com",
      "is_confirmed": true
    },
    {
      "id": "c00b655c-b53a-4d4e-b00a-90180eee699a",
      "name": null,
      "email": "test@test.com",
      "is_confirmed": false
    }
  ]
}
```
