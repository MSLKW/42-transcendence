import importX from "eslint-plugin-import-x";
import tsParser from "@typescript-eslint/parser";

const workspaces = [ // TODO: include new ones too dont forget
  "infra/drizzle-gateway",
  "infra/migrator",
  "infra/nginx",
  "infra/postgresql",
  "infra/redis",
  "packages/postgres/auth-schema",
  "packages/postgres/friends-schema",
  "packages/postgres/game-stats-schema",
  "packages/postgres/party-schema",
  "packages/postgres/postgres-client",
  "packages/postgres/profile-schema",
  "packages/types/badge-types",
  "packages/types/friends-types",
  "packages/types/game-stats-types",
  "packages/types/game-types",
  "packages/types/profile-types",
  "services/authentication",
  "services/chat",
  "services/friends",
  "services/game-bot",
  "services/game-server",
  "services/game-stats",
  "services/party",
  "services/profile",
  "services/website",
];

export default [
  { ignores: ["**/dist/**", "**/.tsbuildinfo", "**/node_modules/**"] },
  {
    files: ["**/*.ts"],
    languageOptions: { parser: tsParser },
  },
  ...workspaces.map((dir) => ({
    files: [`${dir}/**/*.ts`],
    plugins: { "import-x": importX },
    rules: {
      "import-x/no-extraneous-dependencies": ["error", { packageDir: `./${dir}` }],
    },
  })),
];