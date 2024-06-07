export const sortByLastModified = (
  a: { filename: string; lastModified: Date },
  b: { filename: string; lastModified: Date }
) => {
  if (a.lastModified.getTime() === b.lastModified.getTime()) {
    return b.filename.localeCompare(a.filename)
  }
  return b.lastModified.getTime() - a.lastModified.getTime()
}
