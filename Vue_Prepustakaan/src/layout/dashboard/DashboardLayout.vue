<template>
  <div class="wrapper">
    <!-- Sidebar hanya muncul jika bukan di halaman login atau register -->
    <side-bar v-if="!isAuthPage" ref="sidebar">
      <template v-slot:links>
        <sidebar-link to="/dashboard" name="Beranda" icon="ti-panel" />
        <sidebar-link to="/stats" name="Profil" icon="ti-user" />
        <sidebar-link to="/table-list" name="Data Buku" icon="ti-view-list-alt" />
        <sidebar-link to="/typography" name="Data Anggota Perpus" icon="ti-text" />
        <sidebar-link to="/table-list" name="Data Peminjaman" icon="ti-pencil-alt2" />
        <button @click="logout" class="btn w-100 mt-3">Logout</button>
      </template>
    </side-bar>

    <side-bar v-else>
      <template v-slot:links>
        <sidebar-link to="/login" name="Login" icon="ti-bell" />
        <sidebar-link to="/register" name="Register" icon="ti-bell" />
      </template>
    </side-bar>

    <div class="main-panel">
      <!-- Top Navbar hanya muncul jika bukan di halaman login atau register -->
      <top-navbar v-if="!isAuthPage"></top-navbar>

      <!-- Konten utama -->
      <dashboard-content @click.native="toggleSidebar"></dashboard-content>

      <!-- Footer hanya muncul jika bukan di halaman login atau register -->
      <content-footer v-if="!isAuthPage"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from "./TopNavbar.vue";
import ContentFooter from "./ContentFooter.vue";
import DashboardContent from "./Content.vue";
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
  components: {
    TopNavbar,
    ContentFooter,
    DashboardContent,
  },
  computed: {
    isAuthPage() {
      // Mengembalikan true jika berada di halaman login atau register
      return this.$route.name === 'login' || this.$route.name === 'register';
    },
  },
  methods: {
    toggleSidebar() {
      // Mengakses sidebar menggunakan ref
      if (this.$refs.sidebar && this.$refs.sidebar.showSidebar) {
        this.$refs.sidebar.displaySidebar(false);
      }
    },
    logout() {
      const token = localStorage.getItem('token'); // Mengambil token dari local storage
      axios.post('http://localhost:3000/logout', {}, {
        headers: {
          Authorization: `${token}` // Menambahkan token ke header
        }
      })
        .then(response => {
          Swal.fire('Berhasil', response.data.message, 'success').then(() => {
            // Hapus token setelah logout berhasil
            localStorage.removeItem('token');
            // Redirect ke halaman login setelah logout berhasil
            this.$router.push('/login');
          });
        })
        .catch(error => {
          Swal.fire('Error', error.response?.data?.message || 'Terjadi kesalahan', 'error');
          console.error('Logout error:', error);
        });
    }
  },
};
</script>
