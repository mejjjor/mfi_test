This is a [Next.js](https://nextjs.org/) project with [OpenLayer library](https://openlayers.org/)

## Getting Started

Install dependencies

```bash
npm i
# or
yarn
```

Copy env and set secrets

```
cp .env.example .env
```

Run dev server:

```
yarn dev
```

Frontend is listening on http://localhost:3000

## Deployment

Set secrets in `docker-compose.yml` file

Run :

```
docker-compose up
```

Frontend is listening on http://localhost:8080

## Infos

We use beta features "app directory" from nextjs v13 https://beta.nextjs.org/docs/getting-started
