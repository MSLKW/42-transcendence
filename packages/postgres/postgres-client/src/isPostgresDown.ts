// regex test
// i === ignore upper/lower case
// The text between the slashes is the pattern
// checks whether the error message contains that phrase.
// needed coz when the pool can't get a connection within the 2-second connectionTimeoutMillis, pg throws a plain error with that message and no code.
export function isPostgresDown(err: any): boolean {
  const e = err?.cause ?? err;                // newer Drizzle wraps the original pg error in .cause
  return POSTGRES_DOWN_CODES.has(e?.code) 
    || /connection terminated|timeout exceeded when trying to connect/i.test(e?.message ?? '');   
}

// 7. Recognise "Postgres is down / restarting / unreachable" errors, 
//    so services can answer 503 (retry later) instead of 500 (bug). 
const POSTGRES_DOWN_CODES = new Set([
  'ECONNREFUSED', 'ECONNRESET', 'ETIMEDOUT',  // network-level failures (nothing listening, connection dropped, timed out)
  'ENOTFOUND', 'EAI_AGAIN',                   // postgresql stopped, Docker's DNS can't find the container
  '57P01', '57P03',                           // Postgres's err codes for "shutting down" and "starting up, not ready"
  '08000', '08001', '08003', '08006',         // Postgres's "connection exception" family
]);
