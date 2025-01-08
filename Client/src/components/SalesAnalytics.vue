<template>
  <div class="p-6 bg-white rounded-lg shadow">
    <div class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Sales Analytics</h2>
      
      <!-- Date Range Filter -->
      <div class="flex gap-4 mb-6">
        <div class="flex-1">
          <label class="block text-sm font-medium mb-1">Start Date</label>
          <input 
            type="date" 
            v-model="startDate"
            class="w-full p-2 border rounded"
            @change="fetchAnalytics"
          >
        </div>
        <div class="flex-1">
          <label class="block text-sm font-medium mb-1">End Date</label>
          <input 
            type="date" 
            v-model="endDate"
            class="w-full p-2 border rounded"
            @change="fetchAnalytics"
          >
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center p-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-4 bg-red-50 text-red-600 rounded">
        {{ error }}
      </div>

      <!-- Content -->
      <div v-else-if="analytics">
        <!-- Summary Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div class="p-4 bg-blue-50 rounded-lg">
            <h3 class="text-lg font-semibold text-blue-700">Total Revenue</h3>
            <p class="text-2xl font-bold">Rp {{ formatNumber(analytics.totalRevenue) }}</p>
          </div>
          <div class="p-4 bg-green-50 rounded-lg">
            <h3 class="text-lg font-semibold text-green-700">Total Orders</h3>
            <p class="text-2xl font-bold">{{ analytics.totalOrders }}</p>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <h3 class="text-lg font-semibold text-purple-700">Average Order Value</h3>
            <p class="text-2xl font-bold">Rp {{ formatNumber(analytics.averageOrderValue) }}</p>
          </div>
        </div>

        <!-- Sales Chart -->
        <div class="mb-12">
          <h3 class="text-xl font-semibold mb-4">Sales Trend</h3>
          <div class="relative" style="height: 400px; min-height: 400px;">
            <apexchart
              ref="chart"
              type="area"
              :options="chartOptions"
              :series="chartSeries"
              height="100%"
            ></apexchart>
          </div>
        </div>

        <!-- Products Table -->
        <div class="mt-12">
          <h3 class="text-xl font-semibold mb-4">Product Performance</h3>
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gray-50">
                  <th class="p-3 text-left border">Product Name</th>
                  <th class="p-3 text-right border">Units Sold</th>
                  <th class="p-3 text-right border">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in analytics.productPerformance" :key="product.id">
                  <td class="p-3 border">{{ product.name }}</td>
                  <td class="p-3 text-right border">{{ product.unitsSold }}</td>
                  <td class="p-3 text-right border">Rp {{ formatNumber(product.revenue) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import VueApexCharts from 'vue3-apexcharts';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:5000'; // Match your backend URL
axios.defaults.withCredentials = true; // Important for sending cookies

export default {
  name: 'SalesAnalytics',
  components: {
    apexchart: VueApexCharts,
  },
  
  setup() {
    const loading = ref(true);
    const error = ref(null);
    const analytics = ref(null);
    const chart = ref(null);
    
    // Initialize dates to last 30 days
    const startDate = ref(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));
    const endDate = ref(new Date().toISOString().slice(0, 10));

    // Chart options
    const chartOptions = {
      chart: {
        type: 'area',
        height: 400,
        zoom: {
          enabled: true
        },
        toolbar: {
          show: true
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2
      },
      xaxis: {
        type: 'datetime',
        labels: {
          format: 'dd MMM yyyy'
        }
      },
      yaxis: {
        title: {
          text: 'Revenue (Rp)',
        },
        labels: {
          formatter: (value) => `Rp ${formatNumber(value)}`
        }
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        },
        y: {
          formatter: (value) => `Rp ${formatNumber(value)}`
        }
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.7,
          opacityTo: 0.3,
          stops: [0, 100]
        }
      }
    };

    const chartSeries = computed(() => {
      if (!analytics.value?.dailyData) return [];
      
      return [{
        name: 'Revenue',
        data: analytics.value.dailyData.map(item => ([
          new Date(item.date).getTime(),
          item.revenue
        ]))
      }];
    });

    const formatNumber = (number) => {
      return new Intl.NumberFormat('id-ID').format(Math.round(number));
    };

    const fetchAnalytics = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Add authentication header if you're using token-based auth
    const headers = {
      'Content-Type': 'application/json'
      // Add any other necessary headers
    };
    
    const response = await axios.get('/api/orders/analytics', {
      params: {
        startDate: startDate.value,
        endDate: endDate.value
      },
      headers,
      withCredentials: true // Ensure credentials are sent
    });
    
    analytics.value = response.data;
  } catch (err) {
    console.error('Error details:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      message: err.message
    });
    
    // More specific error messages based on status
    if (err.response?.status === 401) {
      error.value = 'Please log in as an administrator to view analytics';
    } else if (err.response?.status === 403) {
      error.value = 'You do not have permission to view analytics';
    } else {
      error.value = err.response?.data?.message || 'Failed to fetch analytics data';
    }
  } finally {
    loading.value = false;
  }
};

    onMounted(() => {
      fetchAnalytics();
    });

    return {
      startDate,
      endDate,
      loading,
      error,
      analytics,
      chartOptions,
      chartSeries,
      formatNumber,
      fetchAnalytics,
      chart
    };
  }
};
</script>