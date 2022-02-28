import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import store from "../store/index.js";

const routes = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},

	{
		path: "/abonnes",
		name: "Subscribers",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/Subscribers.vue"),
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Home" });
			} else {
				if (localStorage.getItem("isAdmin") == 0) {
					next({ name: "Home" });
				} else {
					next();
				}
			}
		},
	},
	{
		path: "/email_abonnes",
		name: "EmailSubscribers",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/EmailSubscribers.vue"),
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Home" });
			} else {
				if (localStorage.getItem("isAdmin") == 0) {
					next({ name: "Home" });
				} else {
					next();
				}
			}
		},
	},
	{
		path: "/email_benevoles",
		name: "EmailVolunteers",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/EmailVolunteers.vue"),
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Home" });
			} else {
				if (localStorage.getItem("isAdmin") == 0) {
					next({ name: "Home" });
				} else {
					next();
				}
			}
		},
	},
	{
		path: "/selection_seances",
		name: "Sessions",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/Sessions.vue"),
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Home" });
			} else {
				if (localStorage.getItem("isAdmin") == 0) {
					next({ name: "Home" });
				} else {
					next();
				}
			}
		},
	},
	{
		path: "/permanences",
		name: "Permanences",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/Permanences.vue"),
		beforeEnter: (to, from, next) => {
			store.dispatch("checkConnect");
			if (!store.state.connected) {
				next({ name: "Home" });
			} else {
				next();
			}
		},
	},
	{
		path: "/setpassword/:jeton",
		name: "Password",
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ "../views/Password.vue"),
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach((to, from, next) => {
	store.dispatch("checkConnect");
	if (to.meta.requiresAuth) {
		if (!store.state.connected) {
			next({ name: "Home" });
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;
