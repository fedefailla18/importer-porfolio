# ---- Build stage ----
FROM node:22-alpine AS build
WORKDIR /app

RUN corepack enable

# Dependency layer first so it's cached across builds when only src/ changes.
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# ---- Runtime stage: serve the static build with nginx ----
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
