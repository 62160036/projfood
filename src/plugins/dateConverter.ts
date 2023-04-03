export function dateConverter(timestamp: any) {
  const myDate = new Date(timestamp.seconds * 1000)
  return myDate.toLocaleDateString('en-CA')
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
