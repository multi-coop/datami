export const createStyleLink = (node, url) => {
  const link = document.createElement('link')
  link.href = url
  link.type = 'text/css'
  link.rel = 'stylesheet'
  node.appendChild(link)
}
