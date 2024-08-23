export const formatDate = (date: string | Date): string => {
  const toParse = typeof date === 'string' ? new Date(date) : date;

  return new Intl.DateTimeFormat(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(toParse);
};
