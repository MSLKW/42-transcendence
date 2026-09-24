// function purpose: reject arrays & undefined
// 1. rejects arrays => for every route it's used on, exactly one value is the only thing that makes sense
// 2. rejects undefined or null => we need the uuid before 
export function getRouteParam(value: unknown)
  : string | null {
  return typeof value === "string" ? value : null;
}

// any => 
// disables type checking entirely for that value by typescript, 
// compiles, but this is a landmine if someone edits the function later,
// but crashes at runtime if value isn't a string.

// unknown => 
// says "this could be anything, and I don't trust it yet." 
// compiler forces you to narrow before touching it,
// immediate compile error: Object is of type 'unknown'
// allowed to hold it, but not to use it — no property access, no method calls, no arithmetic — until it is narrowed with a check like typeof, instanceof, etc. 
// Only after typeof value === "string" does TypeScript let you treat it as a string.