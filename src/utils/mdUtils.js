import matter from 'gray-matter'

export const $matter = matter

export const mdToObject = (mdRaw) => {
  const mdData = matter(mdRaw)
  const fileData = {
    data: mdData.data,
    content: mdData.content
  }
  return fileData
}
