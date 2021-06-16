import DTable from '../packages/d-table/index.js'

const components = [DTable]

const install = function (Vue, opts = {}) {
  components.forEach((component) => {
    Vue.component(component.name, component)
  })
}
// if (typeof window !== 'undefined' && window.Vue) {
//   install(window.Vue)
// }
export { install, DTable }
