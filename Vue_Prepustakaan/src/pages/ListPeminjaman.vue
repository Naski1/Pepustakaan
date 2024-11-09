<template>
  <div class="mt-4 align-content-center">
    <h2 class="text-center mb-4">Daftar Peminjaman Buku</h2>
    
    <div class="d-flex justify-content-between">
      <router-link to="/addPeminjaman" class="btn btn-primary me-2 h-50"> <!-- Mengatur padding dengan p-2 -->
        <i class="ti-plus"></i> <span class="ms-2">Tambah Peminjaman</span>
      </router-link>
      
      <!-- Input Pencarian dengan Ikon -->
      <div class="input-group w-25"> <!-- Menggunakan input-group untuk menampung ikon dan input -->
        <span class="input-group-text" id="search-addon">
          <i class="ti-search"></i> <!-- Ikon pencarian -->
        </span>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Cari..."
          class="form-control"
          aria-label="Cari..."
          aria-describedby="search-addon"
        />
      </div>
    </div>

    <table class="table table-bordered table-hover">
      <thead class="table-dark">
        <tr>
          <th>No</th>
          <th>Nama Peminjam</th>
          <th>Judul Buku</th>
          <th>Tanggal Peminjaman</th>
          <th>Tanggal Pengembalian</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(peminjaman, index) in paginatedPeminjaman" :key="index">
          <td>{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
          <td>{{ peminjaman.namaPeminjam }}</td>
          <td>{{ peminjaman.judulBuku }}</td>
          <td>{{ peminjaman.tanggalPeminjaman }}</td>
          <td>{{ peminjaman.tanggalPengembalian }}</td>
          <td>
            <button class="btn btn-danger" @click="deletePeminjaman(index + (currentPage - 1) * itemsPerPage)">
              Hapus
            </button>
          </td>
        </tr>
        <tr v-if="filteredPeminjaman.length === 0">
          <td colspan="6" class="text-center">Tidak ada data peminjaman</td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination Controls -->
    <nav aria-label="Page navigation" class="d-flex justify-content-center mt-4">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage">Sebelumnya</button>
        </li>
        
        <li class="page-item" v-for="page in pageCount" :key="page" :class="{ active: currentPage === page }">
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>

        <li class="page-item" :class="{ disabled: currentPage >= pageCount }">
          <button class="page-link" @click="nextPage">Berikutnya</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import Swal from 'sweetalert2';

export default {
  name: 'ListPeminjaman',

  data() {
    return {
      peminjamanBuku: [], // Akan diisi dari local storage
      currentPage: 1,      // Halaman aktif
      itemsPerPage: 15,    // Jumlah item per halaman
      searchQuery: '',      // Query pencarian
    };
  },
  created() {
    // Ambil data peminjaman dari localStorage
    const peminjamanData = localStorage.getItem("peminjamanList");
    if (peminjamanData) {
      this.peminjamanBuku = JSON.parse(peminjamanData);
    }
  },
  computed: {
    filteredPeminjaman() {
      // Memfilter peminjaman berdasarkan pencarian
      return this.peminjamanBuku.filter(peminjaman => {
        const namaPeminjam = peminjaman.namaPeminjam.toLowerCase();
        const judulBuku = peminjaman.judulBuku.toLowerCase();
        const query = this.searchQuery.toLowerCase();
        return namaPeminjam.includes(query) || judulBuku.includes(query);
      });
    },
    pageCount() {
      return Math.ceil(this.filteredPeminjaman.length / this.itemsPerPage);
    },
    paginatedPeminjaman() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredPeminjaman.slice(start, end);
    },
  },
  methods: {
    deletePeminjaman(index) {
      Swal.fire({
        title: 'Apakah Anda yakin?',
        text: "Anda tidak dapat mengembalikan data setelah menghapusnya!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, hapus!',
        cancelButtonText: 'Batal',
      }).then((result) => {
        if (result.isConfirmed) {
          this.peminjamanBuku.splice(index, 1);
          localStorage.setItem("peminjamanList", JSON.stringify(this.peminjamanBuku));
          Swal.fire('Terhapus!', 'Data peminjaman telah dihapus.', 'success');
        }
      });
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.pageCount) {
        this.currentPage++;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
  },
};
</script>

<style scoped>
.table {
  margin-top: 20px;
}
.pagination {
  list-style: none;
  padding: 0;
}
.page-item {
  margin: 0 5px;
}
.page-link {
  border: 1px solid #007bff;
  color: #007bff;
  border-radius: 5px;
}
.page-link:hover {
  background-color: #007bff;
  color: white;
}
.page-item.active .page-link {
  background-color: #007bff;
  color: white;
}
.page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
}
</style>
