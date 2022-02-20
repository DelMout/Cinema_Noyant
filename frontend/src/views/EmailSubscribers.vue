<template>
	<div>
		<h1>Envoi email à tous les abonnés</h1>

		<div id="email">
			<p id="titre">
				<label for="object">Objet : </label
				><InputText type="text" id="object" v-model="object" />
			</p>
			<div id="window">
				<Editor v-model="body" editorStyle="height: 50vh;">
					<template #toolbar>
						<span class="ql-formats">
							<button class="ql-bold"></button>
							<button class="ql-italic"></button>
							<button class="ql-underline"></button>
							<button class="ql-list" value="ordered"></button>
							<button class="ql-list" value="bullet"></button>
						</span>
					</template>
				</Editor>
			</div>
			<div id="load">
				<div>
					<span>&nbsp;Télécharger une image : </span
					><input class="uploadFile" type="file" name="image" @change="onFileChange" />
					<Button
						label="Save the file"
						class="p-button-raised p-button-primary envoi"
						@click="saveFile"
					/>
				</div>
				<div id="poster">
					<div class="post_butt">
						<img
							src="http://localhost:3001/images/affiche_un.jpg"
							alt="affiche cinéma"
							crossorigin="anonymous"
							width="250"
							id="first"
						/><Button
							v-if="filename != 'affiche_un.jpg'"
							label="Sélectionner cette affiche"
							class="p-button-raised p-button-info selec"
							@click="selectOne"
						/>
					</div>
					<div class="post_butt">
						<img
							src="http://localhost:3001/images/affiche_de.jpg"
							alt="affiche cinéma"
							crossorigin="anonymous"
							width="250"
							id="second"
						/><Button
							v-if="filename != 'affiche_de.jpg'"
							label="Sélectionner cette affiche"
							class="p-button-raised p-button-info selec"
							@click="selectTwo"
						/>
					</div>
				</div>
			</div>
			<div id="pied">
				<p>Merci de ne pas répondre à cet email.</p>
				<p>
					L'équipe Cinéma de Noyant<br />
					Familles Rurales
				</p>
			</div>
			<div id="send">
				<div v-if="!emailSent">
					<Button
						label="Envoyer l'email"
						class="p-button-raised p-button-primary envoi"
						@click="sendEmail"
					/>
				</div>
				<div v-if="emailSent">
					<ProgressSpinner />
				</div>
			</div>
		</div>
		<div>
			<Dialog header="Confirmation" v-model:visible="dialog" :style="{ width: '15vw' }"
				><p>Email envoyé à tous les abonnés !</p>
				<template #footer>
					<Button label="OK" @click="closeCreated" autofocus />
				</template>
			</Dialog>
		</div>
	</div>
</template>
<script>
import axios from "axios";
// import FormData from "form-data";
// import fse from "fs-extra";
// import fs from "fs";
// import { getAllFilesSync } from "get-all-files";

export default {
	data() {
		return {
			body: "",
			object: "",
			emailSent: false,
			dialog: false,
			image: null,
			filename: "",
		};
	},
	methods: {
		//* Show all available images (movie poster)
		showImages: function () {},

		//* Send email to all subscribers
		sendEmail: function () {
			this.emailSent = true;
			// const formData = new FormData();
			// // formData.append("image", this.image);
			// formData.append("title", this.object);
			// formData.append("content", this.body);

			axios({
				method: "post",
				url: process.env.VUE_APP_API + "subscriber/sendemail",
				data: {
					title: this.object,
					content: this.body,
					filename: this.filename,
					// affiche: this.image,
				},
				// data: formData,
				// headers: {
				// 	Authorization: `Bearer ${this.token}`,
				// },
			}).then(() => {
				this.dialog = true;
				this.emailSent = false;
			});
		},

		//* Close dialog box
		closeCreated: function () {
			this.dialog = false;
			location.reload();
		},

		//* Select a photo
		onFileChange: function (event) {
			this.image = event.target.files[0];
			// var path = this.image.webkitRelativePath;
			// var path = (window.URL || window.webkitURL).createObjectURL(this.image);

			// const image = this.image;
			// const files = event.target.files;
			console.log(this.image);
			console.log(this.image.name);
			// console.log(path);
		},

		//*Save the file
		saveFile: function () {
			console.log("save file");
			console.log(this.image.name);
			const formData = new FormData();
			formData.append("image", this.image.name);
			axios({
				method: "post",
				url: process.env.VUE_APP_API + "subscriber/saveimage",
				data: formData,

				headers: {
					content_type: "multipart/form-data",
					// Authorization: `Bearer ${this.token}`,
				},
			})
				.then((rep) => {
					console.log(rep);
				})
				.catch((err) => {
					console.log(err);
				});
		},

		//* Select the  movie poster
		selectOne: function () {
			this.filename = "affiche_un.jpg";
			let doc1 = document.getElementById("first");
			doc1.setAttribute("style", "border:10px solid yellow");
			let doc2 = document.getElementById("second");
			doc2.setAttribute("style", "none");
		},
		selectTwo: function () {
			this.filename = "affiche_de.jpg";
			let doc1 = document.getElementById("first");
			doc1.setAttribute("style", "none");
			let doc2 = document.getElementById("second");
			doc2.setAttribute("style", "border:10px solid yellow");
		},
	},
};
</script>
<style scoped>
h1 {
	margin-top: 5rem;
}
#email {
	width: 60%;
	margin: auto;
	display: flex;
	flex-direction: column;
	align-items: flex-start;
}
#window {
	width: 100%;
}
#pied {
	text-align: left;
}
#send {
	margin-bottom: 5rem;
}
.envoi {
	font-weight: bold;
}
#load {
	/* background-color: rgb(25, 99, 196); */
	margin-top: 1rem;
}
#load > div:nth-child(1) {
	background-color: rgb(25, 99, 196);
}
.uploadFile {
	/* display: inline-block;
	position: relative;
	overflow: hidden; */
	background-color: rgb(25, 99, 196);
	color: white;
	cursor: pointer;
}
#poster {
	display: flex;
	margin-top: 2rem;
}
.post_butt {
	display: flex;
	flex-direction: column;
	margin-right: 2rem;
}
.selec {
	margin-top: 1rem;
}
</style>
