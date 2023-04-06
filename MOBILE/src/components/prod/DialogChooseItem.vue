<template>
  <q-dialog
      v-model="dialog"
      persistent
      :maximized="maximizedToggle"
      transition-show="slide-up"
      transition-hide="slide-down"
    >
      <q-card class="bg-primary text-white">
        <q-bar>
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip content-class="bg-white text-primary">Close</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <div class="text-h6">Chọn qui cách tinh</div>
        </q-card-section>

        <q-card-section>
          <div class="row">
              <q-option-group
                    v-model="groupItemTypeSelected"
                    :options="groupItemTypes"
                    color="primary"
                    inline
                    dense
                />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script>
export default {
    props:{
        dialog:{
            type:Boolean
        },
        items:{
            type: Object
        },
        maximizedToggle:{
            type:Boolean
        },
        groupItemTypes:{
            type: Array
        },
        groupItemTypeSelected:{
            type:String
        }
    },
    data() {
        return {
            allItems:{}
        }
    },
    mounted(){
        console.log(this.items)
        // this.getGroupItemTypesNotDUpplicate()
    },
    methods:{
        getGroupItemTypesNotDUpplicate(){
            console.log(this.items)
            this.allItems = this.items
        }
    }
    
}
</script>

<style>

</style>