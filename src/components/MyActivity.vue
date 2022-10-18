<template>
  <el-card class="activity-list-wrap box-card">
    <template #header>
      <div class="card-header">
        <h1 class="heading--h1">{{ title }}</h1>
        <span class="text-nowrap">Total Earned: <span class="gradient-text total-earned">{{ totalEarned ? "+ " + totalEarned : totalEarned }}</span></span>
        <el-button class="button btn--create btn--medium" type="primary" @click="addItem">Create Activity</el-button>
      </div>
    </template>
    <el-row class="table-header">
      <el-col :span="4" class="d-none d-block-md">Date</el-col>
      <el-col :span="7">Activity</el-col>
      <el-col :span="5">&nbsp;</el-col>
      <el-col :span="5" class="text-center">Earned</el-col>
      <el-col :span="3" class="text-center">Actions</el-col>
    </el-row>
    <div class="activity-list" v-if="!isLoading && items.length > 0">
      <ActivityList :items="items" @editItem="editItem" @deleteItem="deleteItem" />
    </div>
    <div v-else-if="!isLoading && items.length < 1">
      <p>No activities.</p>
    </div>
    <div v-else-if="isLoading">
      <p>Loading...</p>
      <el-progress status="success" :duration="1" :percentage="100" :indeterminate="true" />
    </div>
  </el-card>
  <el-dialog class="activity-dialog" v-model="dialogFormVisible" :title="formTitle">
    <el-form 
      :model="editedItem" 
    >
      <el-form-item label="Description:" label-width="200">
        <el-input v-model="editedItem.description" />
        <span class="el-form-item__error" v-if="v$.editedItem.description.$error">Please enter description</span>
        
      </el-form-item>

      <el-form-item label="Social Platform:" label-width="200">
        <el-select v-model="editedItem.socialPlatform" placeholder="Select">
          <el-option label="Instagram" value="Instagram" />
          <el-option label="Facebook" value="Facebook" />
          <el-option label="Twitter" value="Twitter" />
        </el-select>
        <span class="el-form-item__error" v-if="v$.editedItem.socialPlatform.$error">Please select Social Platform.</span>
      </el-form-item>

      <el-form-item label="Social Type:" label-width="200">
        <el-select v-model="editedItem.socialType" placeholder="Select">
          <el-option label="Liked" value="Liked" />
          <el-option label="Shared" value="Shared" />
          <el-option label="Posted" value="Posted" />
        </el-select>
        <span class="el-form-item__error" v-if="v$.editedItem.socialType.$error">Please select Social Type.</span>
      </el-form-item>

      <el-form-item label="Points Earned:" label-width="200">
        <el-input-number v-model="editedItem.pointsEarned" :min="1" :step="stepPoints" :max="maxPoints" />
      </el-form-item>
      
      <span class="dialog-footer">
        <el-button class="btn--medium" @click="dialogFormVisible = false">Cancel</el-button>
        <el-button class="btn--medium" type="primary" @click="saveItem">Save</el-button>
      </span>
    </el-form>
  </el-dialog>
</template>

<script>
import ActivityList from '@/components/ActivityList.vue';
import ActivitiesService from '@/services/activities.service';
import moment from 'moment';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

export default {
  name: 'MyActivity',
  components: {
    ActivityList
  },
  setup () {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      title: "Your Activity",
      totalEarned: 0,
      items: [],
      isLoading: true,
      dialogFormVisible: false,
      editedIndex: -1,
      maxPoints: 1000,
      stepPoints: 5,

      defaultItem: {
        description: "",
        socialPlatform: "",
        socialType: "",
        pointsEarned: 10,
        date: ""
      },

      editedItem: {
        description: "",
        socialPlatform: "",
        socialType: "",
        pointsEarned: 10,
        date: ""
      },

      originalItem: {
        description: "",
        socialPlatform: "",
        socialType: "",
        pointsEarned: 10,
        date: ""
      },

    }
  },

  validations () {
    return {
      editedItem: {
        description: { required },
        socialPlatform: { required },
        socialType: { required },
      },
    }
  },

  created() {
    this.init();
  },

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Create New Activity" : "Edit Activity";
    }
  },

  methods: {

    async init() {
      try {
        // get and set the list of activities
        const response = await ActivitiesService.getItems();
        this.items = response.data;
        this.setTotalEarned();
        this.formatActivityDate();
        this.isLoading = false;
      } catch (e) {
        console.log("Error getting activities", e);
      }
    },

    async saveItem() {
      //validate form inputs
      const isFormCorrect = await this.v$.$validate();
      if (!isFormCorrect) return;

      // edit existing item
      if(this.editedIndex > -1) {
        const editedItem = this.items[this.editedIndex];

        // deduct the old points
        this.calculateTotalEarned(false, editedItem.pointsEarned);

        editedItem.description = this.editedItem.description;
        editedItem.socialPlatform = this.editedItem.socialPlatform;
        editedItem.socialType = this.editedItem.socialType;
        editedItem.pointsEarned = this.editedItem.pointsEarned;
      }
      // create new item
      else {
        try {
          //get current time and format it
          var localTime = moment().format('YYYY-MM-DD');
          var dateFormatted = localTime + "T05:00:00.000Z";

          const payload = {
            description: this.editedItem.description,
            socialPlatform: this.editedItem.socialPlatform,
            socialType: this.editedItem.socialType,
            pointsEarned: this.editedItem.pointsEarned,
            date: dateFormatted
          }
          const response = await ActivitiesService.createItem({ data: payload });

          // format the date
          this.formatDate(response.data);
          
          this.items.push(response.data);

          

        } catch (e) {
          console.log("Error creating activity", e);
        }
      }
      
      // update the total earned points
      this.calculateTotalEarned(true, this.editedItem.pointsEarned);

      this.dialogFormVisible = false;
      this.editedIndex = -1;
      this.v$.$reset();
    },

    editItem(item) {
      this.originalItem = Object.assign({}, item);
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogFormVisible = true;
    },

    addItem() {
      this.editedItem = Object.assign({}, this.defaultItem);
      this.dialogFormVisible = true;
    },

    deleteItem(item) {
      const index = this.items.indexOf(item);
      this.totalEarned -= Number(item.pointsEarned);
      this.items.splice(index, 1);
    },

    setTotalEarned() {
      for(let i=0; i < this.items.length; i++) {
        if(this.items[i].pointsEarned)
          this.totalEarned += Number(this.items[i].pointsEarned)
      }
    },

    formatActivityDate() {
      this.items.map(item => {
        return (item.date = moment(item.date).format("YYYY-DD-MM"));
      });
    },

    formatDate(item) {
      console.log("item", item);
      item.date = moment(item.date).format("YYYY-DD-MM");
    },

    calculateTotalEarned(add, points) {
      if(add)
        this.totalEarned += points;
      else this.totalEarned -= points;
    }
  }
}
</script>