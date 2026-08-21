/**
 * Pull the invite token from a pasted /join URL or a bare token string.
 * Used by the no-building notice so a resident can open the join screen.
 */
export function extractInviteToken(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    const token = url.searchParams.get("token");
    if (token?.trim()) return token.trim();
  } catch {
    // Not a full URL — treat the whole string as the token.
  }
  if (/^[A-Za-z0-9_-]{8,}$/.test(value)) return value;
  return null;
}
