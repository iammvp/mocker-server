/* pass vue route path(no /), get url */
function getUrl (path) {
  return process.env.NODE_ENV === 'development' ? `http://localhost:9080/#/${path}` : `file://${__dirname}/index.html#${path}`
}
export default getUrl
