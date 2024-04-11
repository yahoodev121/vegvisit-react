
export default function isValidNumber(value) {
  return (typeof value === 'number' && !Number.isNaN(value));
}

