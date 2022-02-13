<template>
	<div id="nav">
		<router-link to="/">Home</router-link> | <router-link to="/abonnes">Abonnés</router-link> |
		<router-link to="/about">About</router-link>
	</div>
	<div id="router"><router-view /></div>
</template>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: white;
}

#nav {
	margin-top: 2rem;
	z-index: 1;
	position: absolute;
	top: 0;
	/* background-color: yellow; */
	width: 100%;
}
#router {
	z-index: 10;
}

#nav a {
	font-weight: bold;
	color: white;
}

#nav a.router-link-exact-active {
	color: #42b983;
}
</style>
