export function pkr(amount: number): string {
  return "Rs " + Math.round(amount).toLocaleString("en-PK");
}

export function pkrCompact(amount: number): string {
  if (amount >= 100000) return "Rs " + (amount / 1000).toFixed(0) + "k";
  if (amount >= 1000) return "Rs " + (amount / 1000).toFixed(1) + "k";
  return "Rs " + Math.round(amount).toLocaleString("en-PK");
}

export function km(d: number): string {
  return Math.round(d).toLocaleString("en-PK") + " km";
}
