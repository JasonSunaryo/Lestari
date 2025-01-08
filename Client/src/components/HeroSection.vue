<template>
  <div className="relative  min-h-screen">
    <div
      className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-black/70 to-black/50 z-0"
    />
    <img
      className="absolute top-0 left-0 w-full h-full object-cover z-[-1] opacity-70"
      src="../assets//Hero.webp"
      alt="Elegant wooden furniture collection"
    />

    <div className="container mx-auto px-6 relative z-10">
      <div
        className="flex flex-col md:flex-row items-center justify-between py-20 md:py-32 gap-12"
      >
        {/* Left Content */}
        <div className="md:w-1/2 text-center md:text-left space-y-8">
          <div
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-white/90 text-sm">Terpercaya sejak 1995</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white space-y-2">
            <span className="block">Keanggunan Alami</span>
            <span className="block text-[#edaa67]">Furnitur Kayu</span>
          </h1>

          <p className="text-lg text-gray-200 max-w-xl">
            Temukan koleksi furnitur kayu berkualitas tinggi yang menghadirkan
            kehangatan dan keindahan alami ke dalam rumah Anda. Setiap potongan
            kayu dipilih dengan teliti dan dikerjakan oleh pengrajin ahli kami.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <button
              className="group bg-[#edaa67] hover:bg-[#543310] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-xl"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Belanja Sekarang</span>
              <ArrowRight
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              />
            </button>

            <button
              className="border-2 border-white/30 hover:border-[#edaa67] text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:bg-white/10"
            >
              Katalog Lengkap
            </button>
          </div>

          <div className="flex items-center gap-8 pt-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-[#edaa67]">25+</p>
              <p className="text-white/80 text-sm">Tahun Pengalaman</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#edaa67]">1000+</p>
              <p className="text-white/80 text-sm">Produk Terjual</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-[#edaa67]">100%</p>
              <p className="text-white/80 text-sm">Pelanggan Puas</p>
            </div>
          </div>
        </div>

        <div className="md:w-1/2 grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <img
                src="../assets/Chair.jpg"
                alt="Kursi Minimalis"
                className="w-full h-48 object-cover rounded-xl"
              />
              <div className="pt-3">
                <h3 className="text-white font-semibold">Kursi Minimalis</h3>
                <p className="text-[#edaa67]">Rp 2.500.000</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <img
                src="../assets/Table.jpg"
                alt="Meja Makan"
                className="w-full h-48 object-cover rounded-xl"
              />
              <div className="pt-3">
                <h3 className="text-white font-semibold">Meja Makan</h3>
                <p className="text-[#edaa67]">Rp 4.800.000</p>
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-8">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <img
                src="../assets/Cabinet.webp"
                alt="Lemari Pakaian"
                className="w-full h-48 object-cover rounded-xl "
              />

              <div className="pt-3">
                <h3 className="text-white font-semibold">Lemari Pakaian</h3>
                <p className="text-[#edaa67]">Rp 6.500.000</p>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <img
                src="../assets/BookShelf.jpg"
                alt="Rak Buku"
                className="w-full h-48 object-cover rounded-xl"
              />
              <div className="pt-3">
                <h3 className="text-white font-semibold">Rak Buku</h3>
                <p className="text-[#edaa67]">Rp 3.200.000</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "HeroSection",
};
</script>
