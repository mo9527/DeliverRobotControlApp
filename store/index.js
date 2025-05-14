import { createStore } from 'vuex';
 
export default createStore({
  state() {
    return {
      count: 0,
	  codeLeftTotal: 0,
	  cargoLeftTotal: 0,
	  cargoTookTotal: 0
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
	changeCodeLeftTotal(state, val) {
		state.codeLeftTotal = val;
	},
	changeCargoLeftTotal(state, val) {
		state.cargoLeftTotal = val;
	},
	changeCargoTookTotal(state, val) {
		state.cargoTookTotal = val;
	}
  },
  actions: {
    increment({ commit }) {
      commit('increment');
    },
	changeCodeLeftTotal({ commit }, codeLeftTotal) {
		commit('changeCodeLeftTotal', codeLeftTotal)
	},
	changeCargoLeftTotal({ commit }, cargoLeftTotal) {
		commit('changeCargoLeftTotal', cargoLeftTotal)
	},
	changeCargoTookTotal({ commit }, cargoTookTotal) {
		commit('changeCargoTookTotal', cargoTookTotal)
	}
  }
});