var params = new URLSearchParams(window.location.search)
function sendTo(_0x12e2ca) {
  const _0x2d2110 = window.location.search
  window.location.href = './' + _0x12e2ca + '.html' + _0x2d2110
}
document.querySelectorAll('.bottom_element_grid').forEach((_0x137d77) => {
  _0x137d77.addEventListener('click', () => {
    const _0xf5e619 = _0x137d77.getAttribute('send')
    sendTo(_0xf5e619)
  })
})
function getMobileOperatingSystem() {
  var _0x1a29a6 = navigator.userAgent || navigator.vendor || window.opera
  if (/windows phone/i.test(_0x1a29a6)) {
    return 1
  }
  if (/android/i.test(_0x1a29a6)) {
    return 2
  }
  if (/iPad|iPhone|iPod/.test(_0x1a29a6) && !window.MSStream) {
    return 3
  }
  return 4
}
getMobileOperatingSystem() == 2 &&
  (document.querySelector('.bottom_bar').style.height = '70px')
