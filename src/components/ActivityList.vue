<template>
  <template v-for="item in items" :key="item.id">
  <el-card v-if="item.description" class="box-card" shadow="never">
    <el-row :gutter="20">
      <el-col :span="4" class="d-none d-block-md text-nowrap">{{ item.date }}</el-col>
      <el-col :span="7">{{ item.description }}</el-col>
      <el-col :span="5" class="text-nowrap">
      <font-awesome-icon v-if="item.socialPlatform" :icon="socialPlatforms[item.socialPlatform]" /> {{ item.socialType }}</el-col>
      <el-col :span="5" class="text-center text-nowrap"><span class="gradient-text total-earned">+ {{ item.pointsEarned }}</span></el-col>
      <el-col :span="3" class="text-center">
        <div class="item-actions">
            <span><font-awesome-icon icon="fa-solid fa-pen-to-square" @click="editItem(item)" /></span>
            <span>
              <el-popconfirm
                confirm-button-text="Yes"
                cancel-button-text="No"
                icon-color="#626AEF"
                title="Are you sure to delete this?"
                @confirm="deleteItem(item)"
              >
                <template #reference>
                  <font-awesome-icon icon="fa-solid fa-trash" />
                </template>
              </el-popconfirm>
            </span>
        </div>
      </el-col>
    </el-row>
  </el-card>
  </template>

</template>

<script>
export default {
  name: "ActivityList",
  props: {
    items: Array,
  },
  data() {
    return {
      socialPlatforms: {
        Facebook: "fa-brands fa-facebook-f",
        Twitter: "fa-brands fa-twitter",
        Instagram: "fa-brands fa-instagram",
      }
    };
  },
  emits: ['editItem', 'deleteItem'],
  methods: {
    editItem(item) {
      console.log("Edit", item);
      this.$emit("editItem", item);
    },

    deleteItem(item) {
      console.log("Delete", item);
      this.$emit("deleteItem", item);
    }
  }
}
</script>

<style lang="scss">
  
</style>