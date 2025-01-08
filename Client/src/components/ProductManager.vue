<template>
  <div class="container mx-auto p-4">
    <!-- Header section - improved contrast and spacing -->
    <header class="bg-[#3E2723] text-white p-4 rounded-lg shadow-lg mb-6">
      <h1 class="text-2xl font-bold tracking-tight">Product Management</h1>
    </header>

    <!-- Add Product Button - enhanced with icon -->
    <button
      @click="showAddModal = true"
      class="bg-[#8B4513] hover:bg-[#654321] text-white px-4 py-2 rounded-lg mb-6 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md"
    >
      <span class="text-xl">+</span>
      Add New Product
    </button>

    <!-- Products Grid - improved spacing and responsiveness -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div
        v-for="product in products"
        :key="product._id"
        class="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-[#D7CCC8]"
      >
        <!-- Product Image Section - improved carousel -->
        <div class="relative h-56">
          <img
            :src="product.images[currentImageIndices[product._id] || 0] || '/placeholder-image.jpg'"
            class="w-full h-full object-contain p-2"
            :alt="product.name"
            @click="openImageViewer(product.images, currentImageIndices[product._id] || 0, product._id)"
          />
          
          <!-- Enhanced Navigation Arrows -->
          <template v-if="product.images.length > 1">
            <button
              @click.stop="previousImage(product._id)"
              class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors duration-300 opacity-0 group-hover:opacity-100"
            >
              <span class="block transform rotate-180">→</span>
            </button>
            <button
              @click.stop="nextImage(product._id)"
              class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 rounded-full transition-colors duration-300 opacity-0 group-hover:opacity-100"
            >
              <span>→</span>
            </button>
          </template>

          <!-- Enhanced Image Indicators -->
          <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            <button
              v-for="(_, index) in product.images"
              :key="index"
              @click.stop="setCurrentImage(product._id, index)"
              class="w-2 h-2 rounded-full transition-colors duration-300"
              :class="(currentImageIndices[product._id] || 0) === index 
                ? 'bg-[#8B4513]' 
                : 'bg-[#D7CCC8] hover:bg-[#8B4513]'"
            />
          </div>
        </div>

        <!-- Product Info Section - improved typography and spacing -->
        <div class="p-4">
          <h2 class="text-xl font-semibold text-[#3E2723] mb-2 line-clamp-1">
            {{ product.name }}
          </h2>
          <p class="text-[#5D4037] mb-3 line-clamp-2 text-base">
            {{ product.description }}
          </p>
          <div class="flex justify-between items-center text-[#795548] text-base font-medium mb-4">
            <p>Stock: {{ product.stock }}</p>
            <p>Rp {{ product.sellingPrice.toLocaleString("id-ID") }}</p>
          </div>

          <!-- Action Buttons - enhanced with icons -->
          <div class="flex justify-end gap-2">
            <button
              @click="editProduct(product)"
              class="bg-[#8B4513] hover:bg-[#654321] text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-sm transition-colors duration-300"
            >
              <span class="text-sm">✏️</span>
              Edit
            </button>
            <button
              @click="deleteProduct(product._id)"
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded flex items-center gap-1.5 text-sm transition-colors duration-300"
            >
              <span class="text-sm">🗑️</span>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Enhanced Add/Edit Product Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-[#3E2723]">
            {{ editingProduct ? "Edit Product" : "Add New Product" }}
          </h2>
          <button
            @click="showAddModal = false"
            class="text-[#795548] hover:text-[#3E2723]"
          >
            ✕
          </button>
        </div>

        <form @submit.prevent="saveProduct" class="space-y-4">
          <!-- Form Fields - enhanced styling -->
          <div class="space-y-4">
            <div>
              <label class="block text-[#5D4037] text-sm font-medium mb-1">Name</label>
              <input
                v-model="productForm.name"
                class="w-full border border-[#D7CCC8] rounded-md p-2.5 focus:ring-2 focus:ring-[#8B4513] focus:border-[#8B4513] transition-colors"
                required
              />
            </div>

            <div>
              <label class="block text-[#5D4037] text-sm font-medium mb-1">Description</label>
              <textarea
                v-model="productForm.description"
                class="w-full border border-[#D7CCC8] rounded-md p-2.5 focus:ring-2 focus:ring-[#8B4513] focus:border-[#8B4513] transition-colors"
                rows="3"
              ></textarea>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[#5D4037] text-sm font-medium mb-1">Cost Price</label>
                <input
                  v-model="productForm.costPrice"
                  type="number"
                  class="w-full border border-[#D7CCC8] rounded-md p-2.5 focus:ring-2 focus:ring-[#8B4513] focus:border-[#8B4513] transition-colors"
                  required
                />
              </div>
              <div>
                <label class="block text-[#5D4037] text-sm font-medium mb-1">Selling Price</label>
                <input
                  v-model="productForm.sellingPrice"
                  type="number"
                  class="w-full border border-[#D7CCC8] rounded-md p-2.5 focus:ring-2 focus:ring-[#8B4513] focus:border-[#8B4513] transition-colors"
                  required
                />
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-[#5D4037] text-sm font-medium mb-1">Category</label>
                <input
                  v-model="productForm.category"
                  class="w-full border border-[#D7CCC8] rounded-md p-2.5 focus:ring-2 focus:ring-[#8B4513] focus:border-[#8B4513] transition-colors"
                  required
                />
              </div>
              <div>
                <label class="block text-[#5D4037] text-sm font-medium mb-1">Stock</label>
                <input
                  v-model="productForm.stock"
                  type="number"
                  class="w-full border border-[#D7CCC8] rounded-md p-2.5 focus:ring-2 focus:ring-[#8B4513] focus:border-[#8B4513] transition-colors"
                  required
                />
              </div>
            </div>

            <!-- Enhanced Image Upload Section -->
            <div>
              <label class="block text-[#5D4037] text-sm font-medium mb-1">Images</label>
              <div class="border-2 border-dashed border-[#D7CCC8] rounded-lg p-4">
                <div class="flex flex-wrap gap-4">
                  <!-- Image Preview -->
                  <div
                    v-for="(image, index) in imagePreviewUrls"
                    :key="index"
                    class="relative w-24 h-24 group"
                  >
                    <img
                      :src="image"
                      class="w-full h-full object-cover rounded-md"
                      alt="Preview"
                    />
                    <button
                      @click.prevent="removeImage(index)"
                      class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <!-- Upload Button -->
                  <label
                    class="w-24 h-24 flex items-center justify-center border-2 border-dashed border-[#D7CCC8] rounded-md cursor-pointer hover:border-[#8B4513] transition-colors"
                  >
                    <input
                      type="file"
                      @change="handleImageUpload"
                      multiple
                      accept="image/*"
                      class="hidden"
                    />
                    <span class="text-4xl text-[#D7CCC8]">+</span>
                  </label>
                </div>
                <p class="text-sm text-gray-500 mt-2">
                  Upload up to 5 images (max 5MB each)
                </p>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-2 pt-4">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-[#8B4513] hover:bg-[#654321] text-white px-6 py-2 rounded-md transition-colors"
            >
              {{ editingProduct ? "Update" : "Save" }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Enhanced Image Viewer Modal -->
    <div
      v-if="showImageViewer"
      class="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
      @click="showImageViewer = false"
    >
      <img
        :src="currentViewerImage"
        class="max-w-[90vw] max-h-[90vh] object-contain"
        alt="Full size product image"
      />
      <button
        class="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
        @click="showImageViewer = false"
      >
        <span class="text-2xl">✕</span>
      </button>
    </div>
  </div>
</template>

<script>
import api from "../../api";

export default {
  name: "ProductManager",
  data() {
    return {
      products: [],
      showAddModal: false,
      showImageViewer: false,
      editingProduct: null,
      currentImageIndices: {}, // Object to track image index for each product
      currentViewerImage: "",
      imagePreviewUrls: [],
      productForm: {
        name: "",
        description: "",
        costPrice: "",
        sellingPrice: "",
        category: "",
        stock: "",
        images: [],
      },
      error: null,
    };
  },

  async created() {
    await this.fetchProducts();
  },

  methods: {
    async fetchProducts() {
      try {
        const response = await api.get("/products");
        this.products = response.data;
        // Initialize image indices for new products
        this.products.forEach((product) => {
          if (!this.currentImageIndices[product._id]) {
            this.currentImageIndices[product._id] = 0;
          }
        });
        this.error = null;
      } catch (error) {
        console.error("Error fetching products:", error);
        this.error = "Failed to load products";
      }
    },

    setCurrentImage(productId, index) {
      this.currentImageIndices[productId] = index;
    },

    previousImage(productId) {
      if (this.currentImageIndices[productId] > 0) {
        this.currentImageIndices[productId]--;
      }
    },

    nextImage(productId) {
      const product = this.products.find((p) => p._id === productId);
      if (
        product &&
        this.currentImageIndices[productId] < product.images.length - 1
      ) {
        this.currentImageIndices[productId]++;
      }
    },

    openImageViewer(images, index, productId) {
      this.currentViewerImage = images[index];
      this.showImageViewer = true;
      this.setCurrentImage(productId, index);
    },

    handleImageUpload(event) {
      const files = Array.from(event.target.files);
      const remainingSlots = 5 - this.productForm.images.length;

      if (remainingSlots > 0) {
        const newFiles = files.slice(0, remainingSlots);
        this.productForm.images = [...this.productForm.images, ...newFiles];

        newFiles.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.imagePreviewUrls.push(e.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
    },

    removeImage(index) {
      this.productForm.images.splice(index, 1);
      this.imagePreviewUrls.splice(index, 1);
    },

    editProduct(product) {
      this.editingProduct = product;
      this.productForm = { ...product };
      this.imagePreviewUrls = [...product.images];
      this.showAddModal = true;
    },

    async saveProduct() {
  try {
    const formData = new FormData();
    Object.keys(this.productForm).forEach((key) => {
      if (key !== "images") {
        formData.append(key, this.productForm[key]);
      }
    });

    // Tambahkan array URL gambar yang tetap dipertahankan
    formData.append("remainingImages", JSON.stringify(this.imagePreviewUrls));

    if (this.productForm.images && this.productForm.images.length) {
      Array.from(this.productForm.images).forEach((image) => {
        formData.append("images", image);
      });
    }

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    if (this.editingProduct) {
      await api.put(
        `/products/${this.editingProduct._id}`,
        formData,
        config
      );
    } else {
      await api.post("/products", formData, config);
    }

    await this.fetchProducts();
    this.showAddModal = false;
    this.resetForm();
    this.error = null;
  } catch (error) {
    console.error("Error saving product:", error);
    this.error = "Failed to save product";
  }
},

    async deleteProduct(id) {
      if (confirm("Are you sure you want to delete this product?")) {
        try {
          await api.delete(`/products/${id}`);
          await this.fetchProducts();
          this.error = null;
        } catch (error) {
          console.error("Error deleting product:", error);
          this.error = "Failed to delete product";
        }
      }
    },

    resetForm() {
      this.productForm = {
        name: "",
        description: "",
        costPrice: "",
        sellingPrice: "",
        category: "",
        stock: "",
        images: [],
      };
      this.imagePreviewUrls = [];
      this.editingProduct = null;
    },
  },
};
</script>
