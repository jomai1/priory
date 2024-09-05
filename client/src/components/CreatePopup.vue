<template>
  <div>
    <div>
      <div class="popup-header">
        <div class="title">Create New Task</div>
        <button 
          class="close-button"
          @click="closePopup()"
        >
          ✖️
        </button>
      </div>



      <div class="input">
        <div>
          <label class="input-label">Chose a title
            <input 
              placeholder="title"
              v-model="newTask.title"
              class="input-field"
              type="text" 
              name="title"
            >  
          </label>
        </div>
        
        <hr class="divider">

        <div>
          <label class="input-label">Pick a Icon:
            <EmojiPicker 
              class="input-field"
              :native="true" 
              :hide-search="false"
              @select="onSelectEmoji" 
            />  
          </label>

          <br>
          <div 
            class="input-label"
            v-if="newTask.icon"
            >
            Selected Icon: {{newTask.icon}}
          </div>
        </div>
        
        <hr class="divider">

        <div>
          <label class="input-label">Chose a description:
            <input 
              placeholder="description"
              v-model="newTask.description"
              class="input-field"
              type="text" 
              name="description"
            >
          </label>
        </div>

        <hr class="divider">

        <div>
          <label class="input-label">Add to Todo list:

            <ul>
              <li
                v-for="subtask in newTask.sub_tasks"
                :key="subtask.title"
              >{{subtask.title}}
                <button
                  class="remove-button"
                  @click.stop.once="removeSubTask(subtask)"
                >
                  ✖️
                </button>
              </li>
            </ul>

            <input 
              placeholder="Sub task"
              type="text" 
              name="sub_tasks"
              v-model="newSubTasks"
              @click.self.stop
              @keyup.enter.prevent="storeSubTask"
            >
          </label>
        </div>

        <hr class="divider">


        <div>
          <label class="input-label">Chose a deadline:
            <input 
              v-model="newTask.deadline"
              class="input-field"
              type="datetime-local" 
              name="deadline"
            >
          </label>
        </div>

        <hr class="divider">

        <div>
          <div class="slider-container">
            <label class="slider-label">Urgency
              <input 
                v-model="newTask.urgency"
                type="range" 
                name="urgency" 
                min="0" 
                max="4" 
              >
            </label>

            <label  class="slider-label">Benefit
              <input 
                v-model="newTask.benefit"
                type="range" 
                name="benefit" 
                min="0" 
                max="4" 
              >
            </label>
          </div>
        </div>

        <div>
          <div class="slider-container">
            <label  class="slider-label">Effort
              <input 
                v-model="newTask.effort"
                type="range" 
                name="effort" 
                min="0" 
                max="4" 
              >
            </label>

            <label class="slider-label">Cost
              <input 
                v-model="newTask.cost"
                type="range" 
                name="cost" 
                min="0" 
                max="4" 
              >
            </label>
          </div>
        </div>

        <hr class="divider">

        <div>
          <label class="input-label">Estimate time (h):
            <input 
              placeholder=0
              v-model="newTask.time_required"
              class="input-field"
              type="number" 
              name="time_required"
            >
          </label>
        </div>

        <div>
          <label class="input-label">Chose categories:
            <div class="categories">
              <div>
                <div 
                  v-for="category in categories"
                  :key="category.name"
                  class="checkbox-container"
                >
                  <label class="checkbox-label">
                    <input
                      class="input-checkbox"
                      type="checkbox"
                      name="categories"
                      :value="category.name"
                      v-model="newTask.categories"
                    >
                    {{category.name}}
                  </label>  
                  <button
                    v-if="category.new"
                    class="remove-button"
                    @click.stop.once="removeCategory(category)"
                  >
                    ✖️
                  </button>
                </div>
              </div>
              <button
                @click.prevent="toggleCreateCategory()"
                v-if="!showCreateCategory"
                class="add-category-button"
              >
                New Category
              </button>

              <label 
                v-if="showCreateCategory"
                class="input-label"
              >New Category:
                <input 
                  type="text" 
                  name="category"
                  v-model="newCategory" 
                  @click.stop
                  @keyup.enter.prevent.stop="storeCategory"
                >
              </label>  
            </div>
          </label>
        </div>

        <hr class="divider">

        <div>
          <label class="input-label">Select dependencies:
            <div 
              class="input-field"
            >
              <div 
                v-for="task in taskNames"
                :key="task.id"
                class="checkbox-container"
              >
                <label class="checkbox-label">
                  <input
                    class="input-checkbox"
                    type="checkbox"
                    name="categories"
                    :value="{title: task.title, task_id: task.id, type: 'no_order'}"
                    v-model="newTask.dependencies"
                  >
                  {{task.title}}
                </label>  
              </div>
            </div>
          </label>
        </div>

        <hr class="divider">
      </div>



      <div>
        <button 
          class="submit-button" 
          @click="submitNewTask"
        >Submit</button>
      </div>

    </div>

    

</div>
</template>

<script>
// import axios from 'axios'
import EmojiPicker from 'vue3-emoji-picker'


// import css
import 'vue3-emoji-picker/css'


export default {
  name: 'CreatePopup',
  components: {
    EmojiPicker,
  },
  props: {
    tasks: {
      default: () => {
        return {}
      },
      type: Object
    }
  },
  data() {
    return {
      showCreateCategory: false,
      newCategory: "",
      newSubTasks: "",
      newTask: {
        title: "",
        icon: "",
        description: "",
        sub_tasks: [],
        deadline: null,
        urgency: 0,
        benefit: 0,
        effort: 0,
        cost: 0,
        time_required: 0,
        categories: [],
        dependencies: [],
      }
    }
  },
  methods: {
      submitNewTask(){


        //Todo: Check if all necessary fields are filled. If not, give error.



        this.$emit('create-task', this.newTask)
      },
      closePopup(){
        this.$emit("close-popup")
      },
      onSelectEmoji(emoji) {
        this.newTask.icon = emoji.i
        /*
          // result
          { 
              i: "😚", 
              n: ["kissing face"], 
              r: "1f61a", // with skin tone
              t: "neutral", // skin tone
              u: "1f61a" // without tone
          }
          */
      },
      storeSubTask(){
        if (this.newSubTasks.trim()) {
          this.newTask.sub_tasks.push({ "title": this.newSubTasks, "status": 0})
          this.newSubTasks = ""
        }        
      },
      storeCategory(){
        this.newTask.categories.push(this.newCategory)

        this.newCategory = ""
      },
      toggleCreateCategory(){
        this.showCreateCategory = true
      },
      removeSubTask(subTask){
        this.newTask.sub_tasks = this.newTask.sub_tasks.filter(
          (task) => task.title !== subTask.title
        );
      },
      removeCategory(category){
        var index = -1;

        for (var i = 0; i < this.newTask.categories.length; i++) {
          if(this.newTask.categories[i] === category.name && category.new){
            index = i
          }
        }

        if (index > -1) {
          this.newTask.categories.splice(index, 1);
        }
      },
      convertToDateTimeLocalString(date){
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        const hours = date.getHours().toString().padStart(2, "0");
        const minutes = date.getMinutes().toString().padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
      }
  },
  async mounted() {
    this.newTask.deadline = this.convertToDateTimeLocalString(new Date())
    console.log(this.newTask)    
  },
  computed: {
    taskNames(){
      var tempTasks = []

      if(this.tasks){
        for (const [, task] of Object.entries(this.tasks)) {
          if(task?.title && task?.id){
            tempTasks.push({title: task.title, id: task.id})
          }
        }  
      }

      return tempTasks
    },
    categories(){
      var tempCategories = []

      if(this.tasks){
        for (const [, task] of Object.entries(this.tasks)) {
          if(task?.categories){
            for (const [, category] of Object.entries(task.categories)) {
                tempCategories.push({name: category, new: false})
            }
          }
        }  
      }

      if(this.newTask.categories){
          for (const [, category] of Object.entries(this.newTask.categories)) {
            console.log(category)
            tempCategories.push({name: category, new: true})
          }
      }

      
      const uniqueEntries = tempCategories.reduce((acc, current) => {
      // Check if an entry with the same name already exists in the accumulator
      const existingEntryIndex = acc.findIndex(entry => entry.name === current.name);

      if (existingEntryIndex === -1) {
        // If no entry with the same name exists, add the current entry
        acc.push(current);
      } else {
        // If an entry with the same name exists, keep the one with new = false
        if (!acc[existingEntryIndex].new) {
          // If the existing entry has new = false, do nothing
          return acc;
        } else if (!current.new) {
          // If the current entry has new = false, replace the existing entry
          acc[existingEntryIndex] = current;
        }
      }

      return acc;
    }, []);


      return uniqueEntries
    }
  },
  // watch: {
  //   newTask: {
  //     handler(){
  //       console.log(this.newTask)
  //     },
  //     deep: true
  //   },
  // }
}
</script>

<style>
  input[type=range]{
    height: 8em;
    padding: 0 0 5 0px;
    margin-top: 4em;
    display: inline-block;
    width: 125px;
    position: relative;
    top: -3em;
  }

  .slider-container {
    display: flex;
    justify-content: center;
    gap: 1em;
  }
  

  .slider-label {
    align-items: center;
    text-align: center;
  }

  .input-label {
    text-align: left;
    font-size: 1.2em;
  }

  .input {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5em;
    margin-bottom: 40px;
}

.input > div {
    margin: 0;
    max-width: 400px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 75%;
}

.input-label,
.slider-label {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.input-field,
input[type="range"] {
    width: 100%;
    box-sizing: border-box;
    margin-top: 5px;
}

.slider-container {
    display: flex;
    justify-content: space-between;
    gap: 1em;
    width: 100%;
}

input[type=text], input[type=datetime-local], input[type=number], input[type=radio] {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.categories{
  padding: 10px;
  display: contents;
}

.checkbox-container {
    display: flex; /* Use flexbox to align checkbox and label horizontally */
    align-items: center; /* Center align items vertically */
    margin-bottom: 0.5em; /* Add space between checkboxes */
}

.checkbox-label {
    display: flex; /* Use flexbox to align checkbox and text */
    align-items: center; /* Center align items vertically */
    gap: 0.5em; /* Add some space between checkbox and label text */
    font-size: 1rem; /* Adjust font size if needed */
}

.input-checkbox {
    margin: 0; /* Remove any default margin around the checkbox */
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 500px;
  margin: 0 auto;
  padding: 10px;
}

.add-category-button {
  background-color: #bfbdbd;
  color: #f2f2f2;
  padding: 7px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.add-category-button:hover {
  background-color: #b2c7ad;
}

.close-button {
  background-color: #ebebeb;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.close-button:hover {
  background-color: #d1c7c7;
}

.divider {
  border: none; /* Remove any default border styling */
  height: 2px; /* Set a thicker height to make it more visible */
  background-color: #ddd; /* Set a visible background color for the divider */
  margin: 5px 0; /* Add spacing above and below the divider */
  width: 35%; /* Ensure it stretches across the container */

}


.submit-button {
  appearance: button;
  background-color: #1899D6;
  border: solid transparent;
  border-radius: 16px;
  border-width: 0 0 4px;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: din-round,sans-serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: .8px;
  line-height: 20px;
  margin: 0;
  margin-top: 20px;
  margin-bottom: 50px;
  outline: none;
  overflow: visible;
  padding: 13px 16px;
  text-align: center;
  text-transform: uppercase;
  touch-action: manipulation;
  transform: translateZ(0);
  transition: filter .2s;
  user-select: none;
  -webkit-user-select: none;
  vertical-align: middle;
  white-space: nowrap;
}

.submit-button:after {
  background-clip: padding-box;
  background-color: #1CB0F6;
  border: solid transparent;
  border-radius: 16px;
  border-width: 0 0 4px;
  bottom: -4px;
  content: "";
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: -1;
}

.submit-button:main,
.submit-button:focus {
  user-select: auto;
}

.submit-button:hover:not(:disabled) {
  filter: brightness(1.1);
  -webkit-filter: brightness(1.1);
}

.submit-button:disabled {
  cursor: auto;
}

.submit-button:active {
  border-width: 4px 0 0;
  background: none;
}


</style>
