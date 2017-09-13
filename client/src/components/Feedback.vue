<template>
  <div>
    <h1>Post Feedback</h1>
    <select
      name="email"
      v-model="email">
      <option value="" selected disabled hidden>Please select</option>
      <option value="raman.amatya@cloudfactory.com">Raman Amatya</option>
      <option value="aneeta.sharma@cloudfactory.com">Aneeta Sharma</option>
      <option value="anish.duwal@cloudfactory.com">Anish Duwal</option>
      <option value="trishna.shrestha@cloudfactory.com">Trishna Shrestha</option>
      <option value="prakash.regmi@cloudfactory.com">Prakash Regmi</option>
    </select><br />
    <textarea
      name="message"
      v-model="message"
      placeholder="message" /><br />
    <button
      @click="submitMessage">Submit</button>
  </div>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
export default {
  name: 'register',
  data () {
    return {
      email: "",
      feedback: ""
    }
  },
  methods: {
    async submitMessage () {
      const response = await AuthenticationService.feedbackMessage({
        email: this.email,
        feedback: this.feedback
      })
      console.log(response.data)
    }
  }
}
</script>
