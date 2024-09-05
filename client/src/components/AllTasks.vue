<template>
  <div>
    <div class="header-container">
      <h1 class="header-title">Category (TODO)</h1>
      <div class="action-container">
        <div class="search">
          <input placeholder="Search" type="search" id="site-search" name="q" />
        </div>
        <div>
          <button 
            class="add-button"
            @click="addTask()"
          >➕</button>
        </div>  
      </div>
    </div>
      <div class="list-container">
      <div 
        v-for="task in tasks"
        :key="task.id"
        class="list-item" 
        :class="{ expanded: isActive == task.id }" 
        @click="toggleExpand(task.id)"
        >
        <div class="general-info">
          <div class="general-info-icon">{{ task.icon }}</div>
          <div class="general-info-text">{{ task.title }}</div>  
        </div>
        <div 
          v-if="isActive == task.id" 
          class="additional-info"
          >
          <p>{{task.description}}</p>
          <div 
            v-for="sub_task in task['sub_tasks']"
            :key="sub_task.id"
            class="subtasks"
            @click.stop="cycleSubTaskState(sub_task)"
            >
            <div class="icon">{{ subTaskStates[sub_task.status].icon }}</div>
            <div class="title">{{ sub_task.title }}</div>
          </div>
          <div class="task-priority-info">
            Due Date: {{task.deadline}}
            Urgency: {{task.urgency}}
            Benefit: {{task.benefit}}
            Cost: {{task.cost}}
        </div>
        </div>
        
      </div>
    </div>
    <div v-if="showCreatePopup" class="create-popup">
      <CreatePopup
        class="popup-content"
        :tasks=tasks
        @close-popup="showCreatePopup = false"
        @create-task="onCreateTask"
      />  
    </div>
    
  </div>
</template>

<script>
import axios from 'axios'

// Components
import CreatePopup from './CreatePopup.vue'

export default {
  name: 'AllTasks',
  components: {
      CreatePopup
  },
  data() {
    return {
      tasks: [],
      isActive: false,
      subTaskStates: [
        { icon: '⏳', title: 'Pending' },
        { icon: '✅', title: 'Done' },
        { icon: '❌', title: 'Rejected' }
      ],
      showCreatePopup: false
    }
  },
  methods: {
    async onCreateTask(newTask){

      console.log("New Task:")
      console.log(JSON.parse(JSON.stringify(newTask)))

      var data = JSON.parse(JSON.stringify(newTask))

      try{
        await axios({
          method: 'post',
          url: `http://localhost:${3000}/tasks/v1/create`,
          data
        })

      }catch (error) {
        console.log(error.response);
      }



      try{
        const tasks_req = await axios({
          method: "get",
          url: `http://localhost:${3000}/tasks/v1/all-tasks`,
        })  

        this.tasks = tasks_req.data
      }catch (error) {
        console.log(error.response);
      }
      
      this.showCreatePopup = false
    },
    toggleExpand(id) {
      if(this.isActive == id){
        this.isActive = false;
      }else{
        this.isActive = id;
      }
    },
    cycleSubTaskState(subtask) {
      if(subtask){
        subtask.status = (subtask.status + 1) % 3
      } 
    },
    addTask(){
      this.showCreatePopup = true
      console.log("Add item!")
    }
  },
  async mounted() {
    try{
      const tasks_req = await axios({
        method: "get",
        url: `http://localhost:${3000}/tasks/v1/all-tasks`,
      })  

      this.tasks = tasks_req.data
    }catch (error) {
      console.log(error.response);
    }
  }
}
</script>

<style>

  .header-container {
    text-align: center; /* Center the header text */
    margin: 0 auto;
    width: 100%;
  }

  .header-title {
    margin-bottom: 20px; /* Space below the header */
  }

  /* Align the search input and add button horizontally */
  .action-container {
    display: flex;
    justify-content: space-between; /* Distribute space between search and button */
    align-items: center;
    max-width: 600px; /* Limit the width of the container */
    margin: 0 auto; /* Center the action container */
    padding: 10px;
  }

  #site-search {
    flex-grow: 1;
    padding: 8px;
    margin-right: 10px;
  }

  .add-button {
    background-color: #ebebeb;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
  }

  .add-button:hover {
    background-color: #e4e8df;
  }

  .list-container {
    padding-top: 25px;
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .list-item:hover {
    background-color: #ebebeb;
  }

  .header{
      display: flex;
      align-items: center;
  }

  .list-item {
    display: flex;
    flex-direction: column; /* Ensure content stacks vertically */
    align-items: flex-start; /* Align items to the start of the container */
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
  } 

  .list-item.expanded {
    background-color: #f0f0f0;
    transform: scale(1.05);
  }

  .subtasks:hover {
    background-color: #ebebeb;
  }

  .subtasks{
    display: flex;
    align-items: center;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 5px;
    background-color: white;
  }

  .general-info{
    display: flex;
    align-items: center;
  }



  .general-info-icon{
    margin-right: 10px;
    font-size: 20px;
  }

  .general-info-text{
    flex-grow: 1;
  }

  .icon {
    margin-right: 10px;
    font-size: 15px;
  }

  .text {
    flex-grow: 1;
  }

  .additional-info {
    margin-top: 10px;
    font-size: 14px;
    color: #666;
    width: 100%;
  }

  .task-priority-info{
    padding-top: 40px;
  }

  .create-popup {
    position: fixed; /* Make it float above everything and stay in position even when scrolling */
    top: 0;
    left: 0;
    width: 100vw; /* Full width of the viewport */
    height: 100vh; /* Full height of the viewport */
    backdrop-filter: blur(10px); /* Apply blur effect to the background */
    background-color: rgba(0, 0, 0, 0.3); /* Optional semi-transparent background color for better visibility */
    display: flex; /* Center the popup using Flexbox */
    justify-content: center;
    align-items: center;
    z-index: 9999; /* High z-index to ensure it's above all other elements */
    overflow: auto; /* Make the popup scrollable if content exceeds the height */
  }

  .popup-content {
    background-color: white; /* Background color of the popup content */
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional shadow for a nice effect */
    max-height: 90vh; /* Limit the maximum height of the popup to make it scrollable */
    overflow: auto; /* Ensure the popup content is scrollable */
    min-width: 550px;
  }
</style>
