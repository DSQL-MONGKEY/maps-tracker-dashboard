export function formatDate(
  date: Date | string | number | undefined | null,
  opts: Intl.DateTimeFormatOptions = {},
  timeZone: string = 'Asia/jakarta'
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone,
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts
    }).format(new Date(date));
  } catch (_err) {
    return '';
  }
}
