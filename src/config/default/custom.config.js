const map = {
  'active-bg-color': ['#BDBDBD', '#2C2E2F'],
  'hover-bg-color': ['#D9D9D9', '#353739'],

  'editor-border-color': ['#D1D1D1', '#323232'],
  'editor-bg-color': ['#F2F2F2', '#3C3F41'],
  // 灰色
  'editor-tree-icon1-color': ['#AFB9C0', '#88939A'],
  // 蓝色
  'editor-tree-icon2-color': ['#91D3EE', '#4586A2'],
  // 灰色选中
  'editor-tree-icon3-color': ['#859DB4', '#859AB6'],
  // 蓝色选中
  'editor-tree-icon4-color': ['#4EB6E3', '#4396DA'],
  // 选中
  'editor-tree-active-color': ['#2F76C2', '#3467CE'],
  'editor-tree-hover-color': ['#D5D5D5', '#10293F'],
  'editor-tree-title-color': ['#0F0F0F', '#BBBBBB'],
  'editor-button-hover-color': ['#DFDFDF', '#4C5052'],
  'editor-icon-color': ['#BDC3C6', '#5A6266'],
  'editor-icon2-color': ['#6E6E6E', '#AFB1B3'],

  'editor-origin-color': ['#f2935e', '#B85A21'],
  'editor-yellow-color': ['#f5c66f', '#C0933A'],
  'editor-green-color': ['#a5d28a', '#5C913C'],
  'editor-green2-color': ['#60A766', '#519B50'],

  'editor-red-color': ['#E58886', '#AB4F4D'],
  'editor-red2-color': ['#D6595D', '#C2544D'],
  'editor-yellow2-color': ['#F5C66F', '#BB8E33'],
  'editor-gray-color': ['#C0C0C0', '#595959'],
  'editor-blue-color': ['#3F93C7', '#44A0D9'],
  // tooltip bg
  'editor-bg2-color': ['#F7F7F7', '#4B4D4D']
}

function getRes() {
  const res = { light: [], night: [] }
  Object.keys(map).forEach(key => {
    const arr = map[key]
    res.light.push(arr[0])
    res.night.push(arr[1])
  })
  return res
}

module.exports = getRes()

// custom.config.js ==> custom.less
// '(.+?)': \['(.+?)', '(.+')\],? ==> @$1: $2; //$3