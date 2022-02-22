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
					<span>&nbsp;Télécharger une image :&nbsp;</span
					><InputText
						class="uploadFile"
						type="file"
						name="image"
						@change="onFileChange"
					/>
					<Button
						label="Sauvegarder l'image"
						class="p-button-raised p-button-info envoi savefile"
						@click="saveFile"
					/>
				</div>
				<div id="select_poster">
					<div id="on_poster">
						<p>Cliquer sur une affiche pour la joindre à l'email :</p>
					</div>
					<div id="poster">
						<div class="post_butt">
							<img
								src="http://localhost:3001/images/affiche_un.jpg"
								alt="affiche cinéma"
								crossorigin="anonymous"
								width="250"
								height="340"
								id="first"
								@click="selectOne"
							/>
							<!-- <Button
							v-if="filename != 'affiche_un.jpg'"
							label="Sélectionner cette affiche"
							class="p-button-raised p-button-info selec"
							
						/> -->
						</div>
						<div class="post_butt">
							<img
								src="http://localhost:3001/images/affiche_de.jpg"
								alt="affiche cinéma"
								crossorigin="anonymous"
								width="250"
								height="340"
								id="second"
								@click="selectTwo"
							/>
							<!-- <Button
							v-if="filename != 'affiche_de.jpg'"
							label="Sélectionner cette affiche"
							class="p-button-raised p-button-info selec"
						/> -->
						</div>
						<div class="post_butt" @click="selectNo">
							<div id="no_post"><p>Ne pas joindre d'affiche</p></div>
						</div>
					</div>
					<!-- <div class="post_no">
						<Button
							label="Sans image jointe"
							class="p-button-raised p-button-info selec"
							@click="selectNo"
						/>
					</div> -->
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
		<div style="width: 30vw">
			<Toast position="center" :breakpoints="{ '400px': { width: '95%' } }">
				<template #message="slotProps">
					<div class="p-d-flex p-flex-row">
						<div class="p-text-center">
							<i class="pi pi-exclamation-triangle" style="font-size: 2rem"></i>
							<p>{{ slotProps.message.detail }}</p>
						</div>
					</div>
				</template>
			</Toast>
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
			console.log(this.filename);
			// const formData = new FormData();
			// // formData.append("image", this.image);
			// formData.append("title", this.object);
			// formData.append("content", this.body);

			// If no poster selected OR title OR contenu do not continue
			if (this.object == "") {
				this.$toast.add({
					severity: "error",
					detail: "Merci d'écrire un objet à votre email.",
					closable: false,
					life: 4000,
				});
			} else if (this.body == "") {
				this.$toast.add({
					severity: "error",
					detail: "Merci d'écrire un contenu dans le corps de votre email.",
					closable: false,
					life: 4000,
				});
			} else if (this.filename == "") {
				this.$toast.add({
					severity: "error",
					detail: "Merci de sélectionner un affiche.",
					closable: false,
					life: 4000,
				});

				console.log("g compris le message !");
			} else {
				this.emailSent = true;
				axios({
					method: "post",
					url: process.env.VUE_APP_API + "subscriber/sendemail",
					data: {
						title: this.object,
						content: this.body,
						filename: this.filename,
					},
					// data: formData,
					// headers: {
					// 	Authorization: `Bearer ${this.token}`,
					// },
				})
					.then(() => {
						this.dialog = true;
						this.emailSent = false;
					})
					.catch(() => {
						this.$toast.add({
							severity: "error",
							detail: "Un problème est survenu. L'envoi de l'email n'a pas été effectué.",
							closable: false,
							life: 4000,
						});
					});
			}
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
					location.reload();
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
			let doc3 = document.getElementById("no_post");
			doc3.setAttribute("style", "none");
		},
		selectTwo: function () {
			this.filename = "affiche_de.jpg";
			let doc1 = document.getElementById("first");
			doc1.setAttribute("style", "none");
			let doc2 = document.getElementById("second");
			doc2.setAttribute("style", "border:10px solid yellow");
			let doc3 = document.getElementById("no_post");
			doc3.setAttribute("style", "none");
		},
		selectNo: function () {
			this.filename = "baladimages.jpg";
			let doc1 = document.getElementById("first");
			doc1.setAttribute("style", "none");
			let doc2 = document.getElementById("second");
			doc2.setAttribute("style", "none");
			let doc3 = document.getElementById("no_post");
			doc3.setAttribute("style", "border:10px solid yellow");
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
#load > div {
	display: flex;
}
#load > div:nth-child(1) > span {
	background-color: rgb(25, 99, 196);
	padding-top: 0.8rem;
	padding-bottom: 0.8rem;
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
	margin-left: 1rem;
	margin-bottom: 1rem;
}
.post_butt {
	display: flex;
	flex-direction: column;
	margin-right: 1rem;
	cursor: pointer;
}

.selec {
	margin-top: 1rem;
}
.savefile {
	height: 100%;
	margin-left: 1rem;
	border: 3px solid rgb(25, 99, 196);
	background-color: rgb(214, 210, 210);
	color: rgb(70, 68, 68);
}
#on_poster {
	/* margin-bottom: 0.5rem; */
	text-align: left;
	margin-left: 1rem;
}
#no_post {
	background-color: grey;
	width: 250px;
	height: 340px;
	color: black;
	font-weight: bold;
	display: flex;
}
#no_post > p {
	margin: auto;
}
#select_poster {
	background-color: rgb(25, 99, 196);
	margin-top: 2rem;
	display: flex;
	flex-direction: column;
}
</style>
