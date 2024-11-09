<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="card login-card p-4">
      <div class="logo text-center mb-3">
        <img src="../assets/img/logo.png" alt="Logo">
      </div>
      <div class="text-center mt-2 name">
        Perpustakaan SMK NJ
      </div>
      <form @submit.prevent="login" class="p-3 mt-3">
        <div class="form-field input-group mb-3">
          <span class="input-group-text far ti-rocket"></span>
          <input type="text" class="form-control" v-model="username" placeholder="Username" required>
        </div>
        <div class="form-field input-group mb-3">
          <span class="input-group-text ti-key"></span>
          <input type="password" class="form-control" v-model="password" placeholder="Password" required>
        </div>
        <button type="submit" class="btn btn-primary w-100 mt-3">Login</button>
      </form>
      <div class="text-center fs-6 mt-2">
        <a href="#">Forget password?</a> or <router-link to="/register" class="text-decoration-none">Sign up</router-link>
      </div>
      <!-- Tombol Logout -->
      <button v-if="isLoggedIn" class="btn btn-danger w-100 mt-3" @click="confirmLogout">Logout</button>
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
  background: #ffffff;
}

.login-card {
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

.btn-danger {
  background-color: #F44336;
  border: none;
}

.btn-danger:hover {
  background-color: #D32F2F;
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
import Swal from 'sweetalert2'; // Import SweetAlert

export default {
  data() {
    return {
      username: '',
      password: '',
      isLoggedIn: false // Status login
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          username: this.username,
          password: this.password
        });

        if (response.data.success) {
          // Show success alert with SweetAlert
          Swal.fire({
            title: 'Login successful!',
            icon: 'success',
            confirmButtonText: 'Ok'
          }).then(() => {
            localStorage.setItem('token', response.data.token); // Simpan token ke localStorage
            this.isLoggedIn = true; // Set status login
            this.$router.push('/dashboard'); // Redirect to dashboard
          });
        } else {
          Swal.fire({
            title: 'Login failed!',
            text: 'Please check your credentials.',
            icon: 'error',
            confirmButtonText: 'Ok'
          });
        }
      } catch (error) {
        console.error('Error during login:', error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error logging in. Please try again later.',
          icon: 'error',
          confirmButtonText: 'Ok'
        });
      }
    },
    confirmLogout() {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to logout?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'No, stay'
      }).then((result) => {
        if (result.isConfirmed) {
          this.logout();
        }
      });
    },
    logout() {
      localStorage.removeItem('token'); // Hapus token dari localStorage
      this.isLoggedIn = false; // Reset status login
      this.$router.push('/login'); // Arahkan ke halaman login
      Swal.fire({
        title: 'Logged out!',
        text: 'You have been logged out successfully.',
        icon: 'success',
        confirmButtonText: 'Ok'
      });
    }
  }
};
</script>
