import importX from "eslint-plugin-import-x";
import tsParser from "@typescript-eslint/parser";

const workspaces = [ // TODO: may include contacts ones too 
  "packages/postgres/auth-schema",
  "packages/postgres/friends-schema",
  "packages/postgres/game-stats-schema",
  "packages/postgres/party-schema",
  "packages/postgres/postgres-client",
  "packages/postgres/profile-schema",
  "packages/types/friends-types",
  "packages/types/profile-types",
  "services/authentication",
  "services/friends",
  "services/game",
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