import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'
import { defaultConfig, plugin } from '@formkit/vue'
import { createProPlugin, inputs } from '@formkit/pro'
import '@formkit/themes/genesis'
import '@formkit/pro/genesis'
import '@/assets/styles.scss'

import AutoComplete from 'primevue/autocomplete'
import Accordion from 'primevue/accordion'
import AccordionTab from 'primevue/accordiontab'
import Avatar from 'primevue/avatar'
import AvatarGroup from 'primevue/avatargroup'
import Badge from 'primevue/badge'
import BadgeDirective from 'primevue/badgedirective'
import BlockUI from 'primevue/blockui'
import Button from 'primevue/button'
import Breadcrumb from 'primevue/breadcrumb'
import Calendar from 'primevue/calendar'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import CascadeSelect from 'primevue/cascadeselect'
import Carousel from 'primevue/carousel'
import Checkbox from 'primevue/checkbox'
import Chip from 'primevue/chip'
import Chips from 'primevue/chips'
import ColorPicker from 'primevue/colorpicker'
import Column from 'primevue/column'
import ColumnGroup from 'primevue/columngroup'
import ConfirmDialog from 'primevue/confirmdialog'
import ConfirmPopup from 'primevue/confirmpopup'
import ContextMenu from 'primevue/contextmenu'
import DataTable from 'primevue/datatable'
import DataView from 'primevue/dataview'
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import DeferredContent from 'primevue/deferredcontent'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Dock from 'primevue/dock'
import Dropdown from 'primevue/dropdown'
import DynamicDialog from 'primevue/dynamicdialog'
import Fieldset from 'primevue/fieldset'
import FileUpload from 'primevue/fileupload'
import Galleria from 'primevue/galleria'
import Image from 'primevue/image'
import InlineMessage from 'primevue/inlinemessage'
import Inplace from 'primevue/inplace'
import InputSwitch from 'primevue/inputswitch'
import InputText from 'primevue/inputtext'
import InputMask from 'primevue/inputmask'
import InputNumber from 'primevue/inputnumber'
import Knob from 'primevue/knob'
import Listbox from 'primevue/listbox'
import MegaMenu from 'primevue/megamenu'
import Menu from 'primevue/menu'
import Menubar from 'primevue/menubar'
import Message from 'primevue/message'
import MultiSelect from 'primevue/multiselect'
import OrderList from 'primevue/orderlist'
import OrganizationChart from 'primevue/organizationchart'
import OverlayPanel from 'primevue/overlaypanel'
import Paginator from 'primevue/paginator'
import Panel from 'primevue/panel'
import PanelMenu from 'primevue/panelmenu'
import Password from 'primevue/password'
import PickList from 'primevue/picklist'
import ProgressBar from 'primevue/progressbar'
import ProgressSpinner from 'primevue/progressspinner'
import Rating from 'primevue/rating'
import RadioButton from 'primevue/radiobutton'
import Ripple from 'primevue/ripple'
import Row from 'primevue/row'
import SelectButton from 'primevue/selectbutton'
import ScrollPanel from 'primevue/scrollpanel'
import ScrollTop from 'primevue/scrolltop'
import Skeleton from 'primevue/skeleton'
import Slider from 'primevue/slider'
import Sidebar from 'primevue/sidebar'
import SpeedDial from 'primevue/speeddial'
import SplitButton from 'primevue/splitbutton'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import Steps from 'primevue/steps'
import StyleClass from 'primevue/styleclass'
import TabMenu from 'primevue/tabmenu'
import TieredMenu from 'primevue/tieredmenu'
import Textarea from 'primevue/textarea'
import Toast from 'primevue/toast'

import Toolbar from 'primevue/toolbar'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Tag from 'primevue/tag'
import Terminal from 'primevue/terminal'
import Timeline from 'primevue/timeline'
import ToggleButton from 'primevue/togglebutton'
import Tooltip from 'primevue/tooltip'
import Tree from 'primevue/tree'
import TreeSelect from 'primevue/treeselect'
import TreeTable from 'primevue/treetable'
import TriStateCheckbox from 'primevue/tristatecheckbox'
import VirtualScroller from 'primevue/virtualscroller'
import ConfirmationService from 'primevue/confirmationservice'
import App from './App.vue'
import router from './router'

// remember, each Vue plugin needs its own .use()
// .use(router).use(plugin2)

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyC22_OTiG3QbF8Sf4VKLOhCMnwq8WLWGH4',
  authDomain: 'prjfood-dc319.firebaseapp.com',
  databaseURL: 'https://prjfood-dc319-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'prjfood-dc319',
  storageBucket: 'prjfood-dc319.appspot.com',
  messagingSenderId: '457362363488',
  appId: '1:457362363488:web:547d9bf7d0f434330d5f05',
  measurementId: 'G-Y9NQNWKET2',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const functions = getFunctions(app)
getAnalytics(app)

export default db
export { functions }

const vue = createApp(App)

const pro = createProPlugin('fk-909ffd77bc7', inputs)
vue.use(plugin, defaultConfig({ plugins: [pro] }))

vue.use(router)
vue.use(ToastService)
vue.use(PrimeVue)
vue.use(ConfirmationService)
vue.use(plugin, defaultConfig)

vue.directive('tooltip', Tooltip)
vue.directive('badge', BadgeDirective)
vue.directive('ripple', Ripple)
vue.directive('styleclass', StyleClass)

// vue.component('CodeHighlight', CodeHighlight)
// vue.component('BlockViewer', BlockViewer)

vue.component('Accordion', Accordion)
vue.component('AccordionTab', AccordionTab)
vue.component('AutoComplete', AutoComplete)
vue.component('Avatar', Avatar)
vue.component('AvatarGroup', AvatarGroup)
vue.component('Badge', Badge)
vue.component('BlockUI', BlockUI)
vue.component('Breadcrumb', Breadcrumb)
// eslint-disable-next-line vue/no-reserved-component-names
vue.component('Button', Button)
vue.component('Calendar', Calendar)
vue.component('Card', Card)
vue.component('Chart', Chart)
vue.component('Carousel', Carousel)
vue.component('CascadeSelect', CascadeSelect)
vue.component('Checkbox', Checkbox)
vue.component('Chip', Chip)
vue.component('Chips', Chips)
vue.component('ColorPicker', ColorPicker)
vue.component('Column', Column)
vue.component('ColumnGroup', ColumnGroup)
vue.component('ConfirmDialog', ConfirmDialog)
vue.component('ConfirmPopup', ConfirmPopup)
vue.component('ContextMenu', ContextMenu)
vue.component('DataTable', DataTable)
vue.component('DataView', DataView)
vue.component('DataViewLayoutOptions', DataViewLayoutOptions)
vue.component('DeferredContent', DeferredContent)
// eslint-disable-next-line vue/no-reserved-component-names
vue.component('Dialog', Dialog)
vue.component('Divider', Divider)
vue.component('Dock', Dock)
vue.component('Dropdown', Dropdown)
vue.component('DynamicDialog', DynamicDialog)
// eslint-disable-next-line vue/no-reserved-component-names
vue.component('Fieldset', Fieldset)
vue.component('FileUpload', FileUpload)
vue.component('Galleria', Galleria)
// eslint-disable-next-line vue/no-reserved-component-names
vue.component('Image', Image)
vue.component('InlineMessage', InlineMessage)
vue.component('Inplace', Inplace)
vue.component('InputMask', InputMask)
vue.component('InputNumber', InputNumber)
vue.component('InputSwitch', InputSwitch)
vue.component('InputText', InputText)
vue.component('Knob', Knob)
vue.component('Listbox', Listbox)
vue.component('MegaMenu', MegaMenu)
// eslint-disable-next-line vue/no-reserved-component-names
vue.component('Menu', Menu)
vue.component('Menubar', Menubar)
vue.component('Message', Message)
vue.component('MultiSelect', MultiSelect)
vue.component('OrderList', OrderList)
vue.component('OrganizationChart', OrganizationChart)
vue.component('OverlayPanel', OverlayPanel)
vue.component('Paginator', Paginator)
vue.component('Panel', Panel)
vue.component('PanelMenu', PanelMenu)
vue.component('Password', Password)
vue.component('PickList', PickList)
vue.component('ProgressBar', ProgressBar)
vue.component('ProgressSpinner', ProgressSpinner)
vue.component('RadioButton', RadioButton)
vue.component('Rating', Rating)
vue.component('Row', Row)
vue.component('SelectButton', SelectButton)
vue.component('ScrollPanel', ScrollPanel)
vue.component('ScrollTop', ScrollTop)
vue.component('Slider', Slider)
vue.component('Sidebar', Sidebar)
vue.component('Skeleton', Skeleton)
vue.component('SpeedDial', SpeedDial)
vue.component('SplitButton', SplitButton)
vue.component('Splitter', Splitter)
vue.component('SplitterPanel', SplitterPanel)
vue.component('Steps', Steps)
vue.component('TabMenu', TabMenu)
vue.component('TabView', TabView)
vue.component('TabPanel', TabPanel)
vue.component('Tag', Tag)
// eslint-disable-next-line vue/no-reserved-component-names
vue.component('Textarea', Textarea)
vue.component('Terminal', Terminal)
vue.component('TieredMenu', TieredMenu)
vue.component('Timeline', Timeline)
vue.component('Toast', Toast)
vue.component('Toolbar', Toolbar)
vue.component('ToggleButton', ToggleButton)
vue.component('Tree', Tree)
vue.component('TreeSelect', TreeSelect)
vue.component('TreeTable', TreeTable)
vue.component('TriStateCheckbox', TriStateCheckbox)
vue.component('VirtualScroller', VirtualScroller)

vue.mount('#app')
