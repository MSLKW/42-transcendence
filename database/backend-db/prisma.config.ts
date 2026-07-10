// import { defineConfig } from 'prisma';

// export default defineConfig({
//   datasources: {
//     db: {
//       url: process.env.DATABASE_URL, // This matches the 'db' in schema.prisma
//     },
//   },
// });

import 'dotenv/config';
import { defineConfig } from 'prisma/config';

declare const process: {
  env: {
    DATABASE_URL?: string;
  };
};

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL!, // Prisma 7 will read this here
  },
});