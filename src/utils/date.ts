export function formatDate(timestamp: string, format: string = 'DD.MM.YYYY HH:mm') {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return format
    .replace('HH', hours)
    .replace('mm', minutes)
    .replace('DD', day)
    .replace('MM', month)
    .replace('YYYY', String(year));
}