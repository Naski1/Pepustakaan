<template>
    <div class="container mt-5">
      <div class="card shadow-lg p-4">
        <div class="card-header bg-primary text-white text-center rounded mb-3">
          <h3 class="text-center fw-bold">Peminjam an Buku</h3>
        </div>
        <div class="card-body">
          <form @submit.prevent="submitPeminjaman">
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="judulBuku" class="form-label">Judul Buku</label>
                <input
                  type="text"
                  id="judulBuku"
                  v-model="judulBuku"
                  class="form-control"
                  placeholder="Masukkan judul buku"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label for="namaPeminjam" class="form-label">Nama Peminjam</label>
                <input
                  type="text"
                  id="namaPeminjam"
                  v-model="namaPeminjam"
                  class="form-control"
                  placeholder="Masukkan nama peminjam"
                  required
                />
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-3">
                <label for="tanggalPeminjaman" class="form-label">Tanggal Peminjaman</label>
                <input
                  type="date"
                  id="tanggalPeminjaman"
                  v-model="tanggalPeminjaman"
                  class="form-control"
                  required
                />
              </div>
              <div class="col-md-6 mb-3">
                <label for="tanggalPengembalian" class="form-label">Tanggal Pengembalian</label>
                <input
                  type="date"
                  id="tanggalPengembalian"
                  v-model="tanggalPengembalian"
                  class="form-control"
                  required
                />
              </div>
            </div>
            <div class="d-flex justify-content-between mt-4">
              <button type="submit" class="btn btn-success w-45">
                Pinjam Buku
              </button>
              <button type="button" class="btn btn-danger w-45" @click="confirmCancel">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Swal from "sweetalert2";
  
  export default {
    name: "PeminjamanBuku",
    data() {
      return {
        judulBuku: "",
        namaPeminjam: "",
        tanggalPeminjaman: "",
        tanggalPengembalian: "",
      };
    },
    methods: {
      submitPeminjaman() {
        if (
          this.judulBuku &&
          this.namaPeminjam &&
          this.tanggalPeminjaman &&
          this.tanggalPengembalian
        ) {
          // Ambil data peminjaman dari localStorage
          let peminjamanList = JSON.parse(localStorage.getItem("peminjamanList")) || [];
  
          // Tambah data baru ke list
          peminjamanList.push({
            judulBuku: this.judulBuku,
            namaPeminjam: this.namaPeminjam,
            tanggalPeminjaman: this.tanggalPeminjaman,
            tanggalPengembalian: this.tanggalPengembalian,
          });
  
          // Simpan kembali ke localStorage
          localStorage.setItem("peminjamanList", JSON.stringify(peminjamanList));
  
          // Tampilkan SweetAlert2
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: `Buku "${this.judulBuku}" berhasil dipinjam oleh ${this.namaPeminjam}!`,
            confirmButtonText: 'OK',
          }).then(() => {
            // Kembali ke halaman list peminjaman setelah berhasil
            this.$router.push("/table-list");
          });
  
          // Reset form
          this.judulBuku = "";
          this.namaPeminjam = "";
          this.tanggalPeminjaman = "";
          this.tanggalPengembalian = "";
        }
      },
      confirmCancel() {
        // Tampilkan SweetAlert konfirmasi
        Swal.fire({
          title: 'Apakah anda yakin?',
          text: "Perubahan yang Anda buat tidak akan disimpan!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Ya, keluar',
          cancelButtonText: 'Batal',
        }).then((result) => {
          if (result.isConfirmed) {
            // Kembali ke halaman list peminjaman
            this.$router.push("/table-list");
          }
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .container {
    max-width: 800px;
  }
  
  .card {
    border-radius: 10px;
  }
  
  .card-header {
    font-weight: bold;
  }
  
  button[type="submit"],
  button[type="button"] {
    transition: background-color 0.3s, transform 0.3s;
  }
  
  button[type="submit"]:hover,
  button[type="button"]:hover {
    transform: scale(1.05);
  }
  
  button[type="submit"]:hover {
    background-color: #28a745;
  }
  
  button[type="button"]:hover {
    background-color: #bd2130;
  }
  
  @media (max-width: 576px) {
    h3 {
      font-size: 1.5rem;
    }
  
    .card-body {
      padding: 1.5rem;
    }
  }
  </style>
