export const formatTimeInput = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')
  
  // Format as HH:MM
  if (digits.length <= 2) {
    return digits
  }
  
  const hours = digits.slice(0, 2)
  const minutes = digits.slice(2, 4)
  
  // Validate hours and minutes
  const hoursNum = parseInt(hours)
  const minutesNum = parseInt(minutes)
  
  if (hoursNum > 23) {
    return '23' + (minutes ? `:${minutes}` : '')
  }
  
  if (minutesNum > 59) {
    return `${hours}:59`
  }
  
  return `${hours}${minutes ? `:${minutes}` : ''}`
} 