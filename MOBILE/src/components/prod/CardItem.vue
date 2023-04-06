<template>
  
    <q-card :class="cardClass">
            <q-card-section>
                <div class="text-h6">{{item.height +' '+item.width+' '+item.length}}</div>
                <div class="prodTextTitle">{{item.name}}</div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
                <q-btn outline @click="chooseItem(item)" rounded color="primary prodButtonText" label="Chọn" />
            </q-card-actions>
            </q-card>
</template>

<script>
export default {
    props:{
        item:{
            type:Object
        },
        chooseItem:{
            type:Function
        },
        cardClass:{
            type:String,
            default:'q-mt-md'
        }
    }
}
</script>

<style>

</style>