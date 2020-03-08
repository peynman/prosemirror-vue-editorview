import ProseMirrorEditor from './ProseMirrorEditor.vue'

import Components from './components'
export const ProseMirrorComponents = Components;

export default ProseMirrorEditor;

export function install(Vue) {
    if (install.installed) return;
    install.installed = true;
    Vue.component(ProseMirrorEditor.name, ProseMirrorEditor);
}

// Create module definition for Vue.use()
const plugin = {
    install,
};

// Auto-install when vue is found (eg. in browser via <script> tag)
let GlobalVue = null;
if (typeof window !== 'undefined') {
    GlobalVue = window.Vue;
} else if (typeof global !== 'undefined') {
    GlobalVue = global.Vue;
}
if (GlobalVue) {
    GlobalVue.use(plugin);
}