export function parseLyrics(lyricStr) {
  const lines = lyricStr.split('\n')
  const timeReg = /\[(\d{2}):(\d{2}\.\d{2})\]/
  const result = []

  for (const line of lines) {
    const match = timeReg.exec(line)
    if (match) {
      const min = parseInt(match[1])
      const sec = parseFloat(match[2])
      const time = min * 60 + sec
      const text = line.replace(timeReg, '').trim()
      if (text) result.push({ time, text })
    }
  }
  return result
}
