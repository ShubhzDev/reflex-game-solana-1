type ClassName = string | string[] | undefined | null | boolean | { [key: string]: boolean };

export function cn(...inputs: ClassName[]): string {
  const classes = inputs.flatMap(input => {
    if (!input) return [];
    if (Array.isArray(input)) return input;
    if (typeof input === 'string') return input.split(' ');
    if (typeof input === 'object') {
      return Object.entries(input)
        .filter(([_, value]) => value)
        .map(([key]) => key);
    }
    return [];
  });

  return [...new Set(classes)].filter(Boolean).join(' ');
}