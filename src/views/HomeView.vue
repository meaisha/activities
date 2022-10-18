<template>
  <div class="home">
    <el-container>
      <el-main id="activities-section">
        <el-row :gutter="20" justify="center">
          <el-col :xs="24" :md="20"><MyActivity /></el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import MyActivity from '@/components/MyActivity.vue'

export default {
  name: 'HomeView',
  components: {
    MyActivity
  }
}
</script>

