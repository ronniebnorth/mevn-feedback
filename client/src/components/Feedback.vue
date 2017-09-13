<template>
  <div>
    <div style="float: left; width: 50%">
      <h1>Post Feedback</h1>
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
    <div style="float: right;  width: 50%; height: 575px; overflow: scroll; background: #f5f5f5; position: fixed; right: 0">
      <h1>Feedbacks</h1>
      <div v-for="feedback in feedbacks">
        <p>
          <span><b>{{ feedback.email }}</b></span><br />
          <span>{{ feedback.message }}</span>
        </p>
      </div>
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
      feedbacks: [
        { "message": "asd asd aaa a bbba", "email": "get.aneeta@gmail.com" }
      ]
    }
  },
  created () {
    this.fetchUsers();
    this.fetchFeedbacks();
  },
  methods: {
    async submitMessage () {
      const response = await AuthenticationService.feedbackMessage({
        email: this.email,
        message: this.message
      })
      this.fetchFeedbacks()
    },
    async fetchUsers () {
      const response = await AuthenticationService.fetchUsers()
      this.users = response.data.users
    },
    async fetchFeedbacks () {
      const feedback_response = await AuthenticationService.fetchFeedbacks()
      this.feedbacks = feedback_response.data.feedbacks
    }
  }
}
</script>
