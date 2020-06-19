import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)



const user = {
	state : {
		isBind: false, 
		direction: 'forward',
		routeName: '',
		openid:'',
		loading: false,
		showBack: window.history.length,
		showMore: false,
		title: '',
		rightComponent: null,
		keepPages: ['Invoicebill'],
	},
	mutations: {
		updateBind (state, status) {
			state.isBind = status 
		},
		updateDirection (state, direction) {
			state.direction = direction
		},
		updateRouteName (state, status) {
			state.routeName = status
		},
		updateOpenid (state, status) {
			state.openid = status
		},
		updateLoading (state, loading) {
			state.loading = loading
		},
		updateShowBack (state, showBack) {
			state.showBack = showBack
		},
		updateShowMore (state, showMore) {
			state.showMore = showMore
		},
		updateTitle (state, title) {
			state.title = title
		},
		updateKeepPages (state, pages) {
			state.keepPages = pages
		},
		updateRightComponent( state, component) {
			state.rightComponent = component
		}
	}
}

export const store = new Vuex.Store({
	modules: {
		user
	}
})
