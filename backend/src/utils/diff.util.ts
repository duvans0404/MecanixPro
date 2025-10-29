/**
 * Build a diff of only changed fields between a Sequelize instance and a payload.
 * - Excludes id/createdAt/updatedAt by default
 * - Performs a relaxed comparison so 1 == '1' and Date equality by time
 */
export function getChangedFields(
  instance: any,
  payload: Record<string, any>,
  exclude: string[] = ['id', 'createdAt', 'updatedAt']
): { changes: Record<string, any>; changedKeys: string[] } {
  const changes: Record<string, any> = {};
  const changedKeys: string[] = [];
  if (!payload || typeof payload !== 'object') return { changes, changedKeys };

  const normalize = (v: any) => {
    if (v === undefined) return undefined;
    if (v === null) return null;
    if (v instanceof Date) return v.getTime();
    if (typeof v === 'object') {
      try { return JSON.stringify(v); } catch { return String(v); }
    }
    // Coerce numbers/booleans to string to allow '1' vs 1, 'true' vs true equality
    return String(v);
  };

  for (const key of Object.keys(payload)) {
    if (exclude.includes(key)) continue;
    const next = payload[key];
    if (next === undefined) continue; // ignore undefined assignments
    const current = typeof instance?.get === 'function' ? instance.get(key) : instance?.[key];
    const eq = normalize(current) === normalize(next);
    if (!eq) {
      changes[key] = next;
      changedKeys.push(key);
    }
  }

  return { changes, changedKeys };
}
