import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import {CURRENT_LIST, ERROR_MESSAGE, IS_FULLPAGE, LOADING, ONLINE} from './mutation-types'
import config from './modules/config'
import auth from './modules/auth'
import namespaces from './modules/namespaces'
import kanban from './modules/kanban'
import tasks from './modules/tasks'
import lists from './modules/lists'

export const store = new Vuex.Store({
	modules: {
		config,
		auth,
		namespaces,
		kanban,
		tasks,
		lists,
	},
	state: {
		loading: false,
		errorMessage: '',
		online: true,
		isFullpage: false,
		// This is used to highlight the current list in menu for all list related views
		currentList: 0,
	},
	mutations: {
		[LOADING](state, loading) {
			state.loading = loading
		},
		[ERROR_MESSAGE](state, error) {
			state.errorMessage = error
		},
		[ONLINE](state, online) {
			state.online = online
		},
		[IS_FULLPAGE](state, fullpage) {
			state.isFullpage = fullpage
		},
		[CURRENT_LIST](state, currentList) {
			state.currentList = currentList
		},
	},
})