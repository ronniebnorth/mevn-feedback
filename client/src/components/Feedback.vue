<template>
  <div>
    <h1>Post Feedback</h1>
    <div>
      <select
        name="email"
        v-model="email">
        <option value="" selected disabled hidden>Please select</option>
        <option v-for="user in users">{{ user.fullname }}</option>
      </select><br />
      <textarea
        name="message"
        v-model="message"
        placeholder="message" /><br />
      <button
        @click="submitMessage">Submit</button>
    </div>
    <div>
      <h1>Feedbacks</h1>
    </div>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  name: 'register',
  data () {
    return {
      email: "",
      message: "",
      users: [
        { "fullname": "Aneeta Sharma", "email": "get.aneeta@gmail.com" }
      ],
      feedbacks: []
    }
  },
  created () {
    this.fetchUsers();
  },
  methods: {
    async submitMessage () {
      const response = await AuthenticationService.feedbackMessage({
        email: this.email,
        message: this.message
      })
      const response = await AuthenticationService.fetchUsers()
      this.feedbacks = response.data.users
    },
    async fetchUsers () {
      const response = await AuthenticationService.fetchUsers()
      this.users = response.data.users
    }
  }
}
</script>
