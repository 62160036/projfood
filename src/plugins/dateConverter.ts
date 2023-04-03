export function dateConverter(timestamp: any, format: string) {
  const myDate = new Date(timestamp.seconds * 1000)
  return myDate.toLocaleDateString(format, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function datetimeConverter(timestamp: any, format: string) {
  const myDate = new Date(timestamp.seconds * 1000)
  return myDate.toLocaleDateString(format, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  })
}
