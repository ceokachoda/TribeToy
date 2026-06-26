export function maskEmail(email: string | null | undefined): string {
  if (!email) return "—";
  const [name, domain] = email.split("@");
  if (!domain) return email;
  const maskedName = name.length > 2 ? `${name.substring(0, 2)}***` : `*`;
  return `${maskedName}@${domain}`;
}

export function maskAddress(address: string | null | undefined): string {
  if (!address) return "—";
  if (address.length <= 10) return "***";
  return `${address.substring(0, 10)}...`;
}
