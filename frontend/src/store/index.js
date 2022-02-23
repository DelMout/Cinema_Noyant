import { createStore } from "vuex";
import jwt_decode from "jwt-decode";
import moment from "moment";

export default createStore({
	state: {
		volunteerId: null,
		isAdmin: 0,
		connected: false,
		token: null,
		infoHome: "",
		expired: false,
	},
	mutations: {
		setUserId(state, volunteerId) {
			state.volunteerId = volunteerId;
		},
		setToken(state, token) {
			state.token = token;
		},
		setAdmin(state, isAdmin) {
			state.isAdmin = isAdmin;
		},

		setInfo(state) {
			state.infoHome = "Ta session a expiré.";
		},
		setExpired(state, expired) {
			state.expired = expired;
		},
		IS_TRUE(state) {
			state.connected = true;
		},
		IS_FALSE(state) {
			state.connected = false;
		},
	},
	getters: {
		dateNow() {
			moment.locale("fr");
			return Date.now();
		},
		decoded(state) {
			return jwt_decode(state.token);
		},
		dateExp(state, getters) {
			return new Date(getters.decoded.exp * 1000);
		},
	},
	actions: {
		checkConnect(context) {
			context.commit("setToken", localStorage.getItem("token"));
			context.commit("setUserId", localStorage.getItem("volunteerId"));
			if (context.state.token) {
				if (this.getters.dateExp > this.getters.dateNow) {
					context.commit("IS_TRUE");
				} else {
					context.commit("IS_FALSE");
					context.commit("setInfo");
					context.commit("setExpired", true);
					localStorage.clear();
				}
			} else {
				context.commit("IS_FALSE");
			}
		},
		disconnect(context) {
			context.commit("IS_FALSE");
			context.commit("setAdmin", 0);
		},
	},
});
