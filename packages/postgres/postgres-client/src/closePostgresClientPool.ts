import { pool } from "./createPostgresClient";


// 5. Closes the pool. Each service calls this from its own shutdown handler.

//    Safe to call twice: pool.end() throws if called twice, so the Promise is stored and reused.
let closing: Promise<void> | undefined;

export function closePostgresClientPool(): Promise<void>
{
  // closing ??= pool.end(); same syntax meaning as 2 lines below
  if (closing === undefined)
    closing = pool.end();
  return closing;
}


