# syntax=docker/dockerfile:1
FROM node:22.23.1-alpine@sha256:16e22a550f3863206a3f701448c45f7912c6896a62de43add43bb9c86130c3e2 AS dependencies
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node package.json package-lock.json ./
RUN npm ci --no-audit --no-fund && sha256sum package-lock.json | cut -d ' ' -f 1 > node_modules/.lock-hash

FROM dependencies AS development
COPY --chmod=755 docker/develop.sh /usr/local/bin/develop
EXPOSE 3000
ENTRYPOINT ["develop"]
CMD ["npm", "start", "--", "--port", "3000"]

FROM dependencies AS build
ARG DOCS_URL=https://docs.example.com
ARG DOCS_BASE_URL=/
ENV DOCS_URL=$DOCS_URL DOCS_BASE_URL=$DOCS_BASE_URL
COPY --chown=node:node . .
RUN npm run typecheck && npm run lint && npm run references:check && npm run build
RUN node scripts/prepare-static.mjs

FROM nginxinc/nginx-unprivileged:1.28.2-alpine@sha256:7377697a821c131a924a7105fafbe7414db4e9fcc77a6f08f776f33f141ec3f8 AS runtime
USER root
RUN rm -rf /usr/share/nginx/html/*
ARG VERSION=dev
ARG REVISION=unknown
LABEL org.opencontainers.image.title="Seagull documentation" \
      org.opencontainers.image.description="Static technical documentation for Seagull V2" \
      org.opencontainers.image.source="https://github.com/dynasmon/Seagull-wiki" \
      org.opencontainers.image.url="https://github.com/dynasmon/Seagull-wiki" \
      org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.revision=$REVISION \
      org.opencontainers.image.licenses="GPL-3.0-only"
COPY --from=build /app/.static-site/ /usr/share/nginx/html/
COPY --from=build /app/.nginx.conf /etc/nginx/nginx.conf
USER 101:101
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:8080/healthz || exit 1
ENTRYPOINT ["nginx"]
CMD ["-g", "daemon off;"]
