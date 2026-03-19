/**
 * Converts a time string like "19h", "19h30", "0h30", "1h30" to minutes.
 * Times between 0h and 5h are treated as post-midnight (next day),
 * so they sort after 23h59 for festival chronological ordering.
 */
export function timeStringToMinutes(time: string | null | undefined): number {
  if (!time) return Infinity;

  const match = time.match(/^(\d+)h(\d+)?$/);
  if (!match) return Infinity;

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2] ?? "0", 10);
  const total = hours * 60 + minutes;

  // Post-midnight times (0h–5h59) → add 24h so they sort after 23h59
  if (hours < 6) {
    return total + 24 * 60;
  }

  return total;
}

export function formatTimeRange(
  timeStart: string | null | undefined,
  timeEnd: string | null | undefined
): string {
  if (!timeStart) return "";
  if (!timeEnd) return timeStart;
  return `${timeStart}—${timeEnd}`;
}
