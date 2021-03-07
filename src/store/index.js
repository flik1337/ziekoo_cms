import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {
        userOrderType: 0,
    },
    getters: {
        // userOrderType: state => userOrderType
    },
    mutations: {
        SET_USER_ORDER_TYPE(state, payload) {
            state.userOrderType = payload
        }
    },
    actions: {
        setUserOrderType(context, payload) {
            context.commit('SET_USER_ORDER_TYPE', payload)
        }
    }
})

export default store