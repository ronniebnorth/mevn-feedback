<template>
  <div>
    <div class="leftPanel">
      <h1>Post Feedback</h1>
      <div class="formWrapper">
        <label>Give feedback to:</label>
        <select
          name="email"
          v-model="email">
          <option value="" selected disabled hidden>Select a Person</option>
          <option v-for="user in users">{{ user.fullname }}</option>
        </select><br />
        <label>Message</label>
        <textarea
          name="message"
          v-model="message"
          placeholder="message" /><br />
        <button
          @click="submitMessage">Submit</button>
      </div>
    </div>
    <div class="rightPanel">
      <h1>Feedbacks To:</h1>
      <div v-for="feedback in feedbacks">
        <p>
          <span><b>{{ feedback.email }}</b></span><br />
          <span>{{ feedback.message }}</span>
        </p>
      </div>
    </div>
  </div>
</template>
<style type="text/css">
.leftPanel, .rightPanel {
  padding: 20px
}
.leftPanel {
  float: left;
  width: 50%;
  padding-left: 70px;
}
.rightPanel {
  float: right;
  width: 50%;
  height: 575px;
  overflow: scroll;
  background: #f5f5f5;
  position: fixed;
  right: 0
}
.rightPanel p {
  border-bottom: 1px dashed #ccc;
  padding-bottom: 20px;
}
.formWrapper {

}
select, textarea, button{
  margin-bottom: 50px;
  width: 450px;
  border: 1px solid #ccc;
}
select {
  height: 40px;
}
textarea{
  height: 150px;
  resize: none;
}
button {
  background: #08b;
  color: #fff;
  padding: 10px 0;
  font-size: 14px;
  cursor: pointer;
}
label {
  text-align: left;
  display: block;
}
</style>

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
      this.$swal(
        'Good job!',
        `Your feedback has been sent to ${this.email}!`,
        'success'
      )
      const response = await AuthenticationService.feedbackMessage({
        email: this.email,
        message: this.message
      })
      this.fetchFeedbacks();
      this.email = "";
      this.message = "";
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
