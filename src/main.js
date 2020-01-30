import Vue from 'vue'
import App from './App.vue'
import router from './router'
import auth from './auth'

// Register the modal
import Modal from './components/modal/Modal'
Vue.component('modal', Modal)

// Register the task overview component
import TaskOverview from './components/tasks/ShowTasks'
Vue.component('TaskOverview', TaskOverview)

// Add CSS
import './styles/vikunja.scss'

Vue.config.productionTip = false

// Notifications
import Notifications from 'vue-notification'
Vue.use(Notifications)

import config from './config'
config.initConfig()
    .then(() => {
        Vue.prototype.$config = config.getConfig()
    })

// Icons
import { library } from '@fortawesome/fontawesome-svg-core'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faListOl } from '@fortawesome/free-solid-svg-icons'
import { faTasks } from '@fortawesome/free-solid-svg-icons'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons'
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faTimes } from '@fortawesome/free-solid-svg-icons'
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons'
import { faCalendar } from '@fortawesome/free-solid-svg-icons'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faPowerOff } from '@fortawesome/free-solid-svg-icons'
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'
import { faTags } from '@fortawesome/free-solid-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import { faPaste } from '@fortawesome/free-solid-svg-icons'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { faCalendarAlt } from '@fortawesome/free-regular-svg-icons'
import { faCloudDownloadAlt } from '@fortawesome/free-solid-svg-icons'
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'
import { faPercent } from '@fortawesome/free-solid-svg-icons'
import { faStar } from '@fortawesome/free-regular-svg-icons'
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons'
import { faPaperclip } from '@fortawesome/free-solid-svg-icons'
import { faClock } from '@fortawesome/free-regular-svg-icons'
import { faHistory } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faSignOutAlt)
library.add(faPlus)
library.add(faListOl)
library.add(faTasks)
library.add(faCog)
library.add(faAngleRight)
library.add(faLayerGroup)
library.add(faTrashAlt)
library.add(faUsers)
library.add(faUser)
library.add(faLock)
library.add(faPen)
library.add(faTimes)
library.add(faTachometerAlt)
library.add(faCalendar)
library.add(faTimesCircle)
library.add(faBars)
library.add(faPowerOff)
library.add(faCalendarWeek)
library.add(faCalendarAlt)
library.add(faExclamation)
library.add(faTags)
library.add(faChevronDown)
library.add(faCheck)
library.add(faPaste)
library.add(faPencilAlt)
library.add(faCloudDownloadAlt)
library.add(faCloudUploadAlt)
library.add(faPercent)
library.add(faStar)
library.add(faAlignLeft)
library.add(faPaperclip)
library.add(faClock)
library.add(faHistory)

Vue.component('icon', FontAwesomeIcon)

// Tooltip
import VTooltip from 'v-tooltip'
Vue.use(VTooltip)

// PWA
import './registerServiceWorker'

// Set focus
Vue.directive('focus', {
	// When the bound element is inserted into the DOM...
	inserted: function (el) {
		// Focus the element
		el.focus()
	}
})

// Check the user's auth status when the app starts
auth.checkAuth()

// Mixins
import moment from 'moment'
import message from './message'
Vue.mixin({
	methods: {
		formatDateSince: date => moment(date).fromNow(),
		formatDate: date => moment(date).format('LLL'),
		error: (e, context) => message.error(e, context),
		success: (s, context) => message.success(s, context),
	}
})

new Vue({
	router,
	render: h => h(App)
}).$mount('#app')
