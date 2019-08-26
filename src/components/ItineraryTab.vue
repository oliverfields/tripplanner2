<template>
	<div class="container mt-5">
		<div class="row justify-content-center">
			<div class="col-md-8">
				<div class="card">
					<div class="card-header">
						<h4>Form validation with Vue</h4>
					</div>
					<div class="card-body">
						<form @submit.prevent="validate">
							<div class="form-group">
								<input type="text" class="form-control" v-bind:class="{ 'is-invalid': nameError }" id="name" placeholder="Your name" v-model="name">
								<div class="invalid-feedback" id="feedback-1" v-if="errors[0]">
									{{ errors[0].message }}
								</div>
							</div>
							<div class="form-group">
								<input type="text" class="form-control" v-bind:class="{ 'is-invalid': emailError }" id="email" placeholder="Your email" v-model="email">
								<div class="invalid-feedback" id="feedback-2" v-if="errors[1]">
									{{ errors[1].message }}
								</div>
							</div>
							<div class="form-group">
								<textarea class="form-control" v-bind:class="{ 'is-invalid': commentError }" id="comment" placeholder="Your comment" v-model="comment"></textarea>
								<div class="invalid-feedback" id="feedback-3" v-if="errors[2]">
									{{ errors[2].message }}
								</div>
							</div>
							<button class="btn btn-primary" type="submit">Validate</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'ItineraryTab',
	data() {
		return {
			name: '',
			email: '',
			comment: '',
			nameError: false,
			emailError: false,
			commentError: false,
			errors: []
		}
	},
	methods: {
		validate() {
			this.errors = [];
			var len = this.name.length;
			if (len < 5 || len > 20) {
				this.nameError = true;
				this.errors.push({
					'message': 'Name must be between 5 to 20 characters long.'
				});
			} else {
				document.getElementById('name').className = "form-control is-valid";
				this.errors.push({
					'message': 'Validated.'
				});
				document.getElementById('feedback-1').className = "valid-feedback";
			}
			// email validate
			if(this.email.length < 10 || this.email.search('@') == -1) {
				this.emailError = true;
				this.errors.push({
					'message': 'Please provide a valid email address.'
				});
			} else {
				document.getElementById('email').className = "form-control is-valid";
				this.errors.push({
					'message': 'Validated.'
				});
				document.getElementById('feedback-2').className = "valid-feedback";
			}
			// comment validate
			var regex = /^[a-zA-Z0-9 .-]+$/;
			if(this.comment.length < 20 || this.comment.match(regex) == null) {
				this.commentError = true;
				this.errors.push({
					'field': 'comment',
					'message': 'Comment must be of 20 characters or more and use of special characters except . and - are restricted'
				});
			} else {
				document.getElementById('comment').className = "form-control is-valid";
				this.errors.push({
					'message': 'Validated.'
				});
				document.getElementById('feedback-3').className = "valid-feedback";
			}
		}
	}
}
</script>

<style>
</style>