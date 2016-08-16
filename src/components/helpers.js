export function serialize (str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/\W+/g, '-');
}

export function capitalizeFirstLetters (phrase) {
  return phrase
    .toLowerCase()
    .replace('/', ' / ')
    .split(' ')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

export function getMonthYear (dateStr) {
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[+dateStr.slice(5, 7) - 1] + ' ' + dateStr.slice(0, 4);
}
