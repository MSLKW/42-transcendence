import importX from "eslint-plugin-import-x";
import tsParser from "@typescript-eslint/parser";

const workspaces = [ // TODO: include contacts ones too 
  "packages/postgres/auth-schema",
  "packages/postgres/friends-system-schema",
  "packages/postgres/game-schema", // TODO: change to game-stats-schema later
  "packages/postgres/party-manager-schema",
  "packages/postgres/postgres-client",
  "packages/postgres/profile-system-schema",
  "packages/types/friends-system-types",
  "packages/types/profile-system-types",
  "services/authentication",
  "services/friends-system",
  "services/game",
  "services/party-manager",
  "services/profile-system",
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