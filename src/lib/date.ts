export const formatDate = (date: string | Date): string => {
  const toParse = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(toParse);
};
