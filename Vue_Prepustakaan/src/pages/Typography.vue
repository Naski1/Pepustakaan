<template>
  <div class="container mt-5">
    <div class="card   shadow-lg">
      <div class="card-header bg-primary text-white text-center">
        <h3>Peminjaman Buku</h3>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitPeminjaman">
          <div class="mb-3">
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
          <div class="mb-3">
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
          <div class="mb-3">
            <label for="tanggalPeminjaman" class="form-label">Tanggal Peminjaman</label>
            <input
              type="date"
              id="tanggalPeminjaman"
              v-model="tanggalPeminjaman"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label for="tanggalPengembalian" class="form-label">Tanggal Pengembalian</label>
            <input
              type="date"
              id="tanggalPengembalian"
              v-model="tanggalPengembalian"
              class="form-control"
              required
            />
          </div>
          <button type="submit" class="btn btn-primary w-100">
            Pinjam Buku
          </button>
        </form>
      </div>
    </div>
    <div v-if="successMessage" class="alert alert-success mt-4" role="alert">
      {{ successMessage }}
    </div>
  </div>
</template>

<script>
export default {
  name: "PeminjamanBuku",
  data() {
    return {
      judulBuku: "",
      namaPeminjam: "",
      tanggalPeminjaman: "",
      tanggalPengembalian: "",
      successMessage: "",
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
        this.successMessage = `Buku "${this.judulBuku}" berhasil dipinjam oleh ${this.namaPeminjam}!`;
        // Reset form
        this.judulBuku = "";
        this.namaPeminjam = "";
        this.tanggalPeminjaman = "";
        this.tanggalPengembalian = "";
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
}

.card {
  border-radius: 15px;
  overflow: hidden;
}

.card-header {
  font-weight: bold;
}

button[type="submit"] {
  transition: background-color 0.3s, transform 0.3s;
}

button[type="submit"]:hover {
  background-color: #0056b3;
  transform: scale(1.05);
}

.alert {
  font-size: 1.1em;
  text-align: center;
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
