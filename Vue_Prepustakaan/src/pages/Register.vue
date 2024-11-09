<template>
    <div class="d-flex justify-content-center align-items-center vh-100">
      <div class="card register-card p-4">
        <div class="logo text-center mb-3">
          <img src="../assets/img/logo.png" alt="">
        </div>
        <div class="text-center mt-2 name">
          Perpustakaan Registration
        </div>
        <form @submit.prevent="register" class="p-3 mt-3">
          <div class="form-field input-group mb-3">
            <span class="input-group-text far ti-rocket"></span>
            <input type="text" class="form-control" v-model="username" placeholder="Username" required>
          </div>
          <div class="form-field input-group mb-3">
            <span class="input-group-text ti-key"></span>
            <input type="password" class="form-control" v-model="password" placeholder="Password" required>
          </div>
          <div class="form-field input-group mb-3">
            <span class="input-group-text ti-key"></span>
            <input type="password" class="form-control" v-model="confirmPassword" placeholder="Confirm Password" required>
          </div>
          <button type="submit" class="btn btn-primary w-100 mt-3">Register</button>
        </form>
        <div class="text-center fs-6 mt-2">
          Already have an account? <router-link to="/login" class="text-decoration-none">Login</router-link>
        </div>
      </div>
    </div>
  </template>
  <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  background: #ecf0f3;
}

.register-card {
  width: 100%;
  max-width: 380px;
  background-color: #ecf0f3;
  border-radius: 15px;
  box-shadow: 13px 13px 20px #cbced1, -13px -13px 20px #fff;
}

.logo img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0px 0px 3px #5f5f5f, 0px 0px 0px 5px #ecf0f3, 8px 8px 15px #a7aaa7, -8px -8px 15px #fff;
}

.name {
  font-weight: 600;
  font-size: 1.4rem;
  color: #555;
}

.form-field .input-group-text {
  background: #ecf0f3;
  border: none;
  box-shadow: inset 8px 8px 8px #cbced1, inset -8px -8px 8px #fff;
}

.form-control {
  border: none;
  outline: none;
  font-size: 1.1rem;
  padding: 10px;
}

.btn-primary {
  background-color: #03A9F4;
  border: none;
  box-shadow: 3px 3px 3px #b1b1b1, -3px -3px 3px #fff;
}

.btn-primary:hover {
  background-color: #039BE5;
}

a {
  text-decoration: none;
  font-size: 0.8rem;
  color: #03A9F4;
}

a:hover {
  color: #039BE5;
}
</style>
  <script>
  import axios from 'axios';
  import Swal from 'sweetalert2';
  
  export default {
    data() {
      return {
        username: '',
        password: '',
        confirmPassword: ''
      };
    },
    methods: {
      async register() {
        if (this.password !== this.confirmPassword) {
          Swal.fire('Error', 'Password tidak cocok', 'error');
          return;
        }
        try {
          const response = await axios.post('http://localhost:3000/register', {
            username: this.username,
            password: this.password
          });
  
          Swal.fire('Berhasil', response.data.message, 'success').then(() => {
            // Redirect to login page after successful registration
            this.$router.push('/login');
          });
        } catch (error) {
          Swal.fire('Error', error.response.data.message || 'Terjadi kesalahan', 'error');
        }
      }
    }
  };
  </script>
  