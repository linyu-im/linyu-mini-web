export function formatSize(size) {
  if (size < 1024) {
    return size + ' B'
  }
  let units = ['KB', 'MB', 'GB', 'TB']
  let i = -1
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return size.toFixed(1) + ' ' + units[i]
}
