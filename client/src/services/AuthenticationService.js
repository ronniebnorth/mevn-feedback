import Api from '@/services/Api'

export default {
	register (credentials) {
		return Api().post('register', credentials)
	},

	feedbackMessage (credentials) {
		return Api().post('feedback_message', credentials)
	}
}

// AuthenticationService.register({
// 	email: 'testing@gmail.com',
// 	password: '123456'
// })
