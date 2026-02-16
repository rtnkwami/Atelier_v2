FROM node:24-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

RUN pnpm add turbo --global

WORKDIR /app

COPY ./out/json/ ./
RUN pnpm install --frozen-lockfile

COPY .turbo ./
COPY ./out/full/ ./
RUN pnpm build

RUN pnpm --filter=inventory --prod deploy ./prod

FROM node:24-alpine AS runner

WORKDIR /app

COPY --from=base /app/prod/dist ./
COPY --from=base /app/prod/node_modules ./

EXPOSE 5000

CMD ["node", "dist/main.js"]