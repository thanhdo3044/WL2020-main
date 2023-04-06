<template>
  <div id="card-button">
      <q-btn id="cbutton" @click="click" :color="bgColor" class="full-width full-height" :text-color="textColor" :label="text" />
  </div>
</template>

<script>
export default {
    props:{
        bgColor:{
            type:String,
            default:'chocolate'
        },
        textColor:{
            type:String,
            default:'black'
        },
        text:{
            type:String,
            default:'....'
        },
        click:{
            type:Function,
            default:function(){
               console.log('aa')
            }
        }
    },
    methods:{
        
    }
}
</script>

<style>
#card-button{
    height: 200px;
    border: 10px solid transparent;
    -webkit-border-image: url('/statics/border.png') 30 round; /* Safari 3.1-5 */
    -o-border-image: url('/statics/border.png') 30 round; /* Opera 11-12.1 */
    border-image: url('/statics/border.png') 30 round;
}
#cbutton {
    font-family: 'Time New Roman';
    font-size: 30px;
    font-weight: 800;
}
</style>