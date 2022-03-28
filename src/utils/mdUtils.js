import matter from 'gray-matter'

// workaround to include buffer
global.Buffer = global.Buffer || require("buffer").Buffer; // eslint-disable-line

export const $matter = matter

export const mdToObject = (mdRaw, options) => {
  // console.log('\nU > mdToObject > mdRaw : \n', mdRaw)
  // console.log('U > mdToObject > options : ', options)
  const mdData = matter(mdRaw)
  const fileData = {
    data: mdData.data,
    content: mdData.content
  }
  return fileData
}
