// Sorts two uuids so (alice, bob) and (bob, alice) always produce the same
// key — lets a friendship be treated as one fact, not two.
export function pairKey(a: string, b: string): string {
  return [a, b].sort().join("|");
}
