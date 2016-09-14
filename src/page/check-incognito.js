export const checkIncognito = () => {
  const fs = window.RequestFileSystem || window.webkitRequestFileSystem
  return !fs
}
