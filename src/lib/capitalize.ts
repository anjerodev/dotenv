export function capitalize(text: string) {
  if (typeof text !== 'string' || text.length === 0) {
    return text
  }

  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}
