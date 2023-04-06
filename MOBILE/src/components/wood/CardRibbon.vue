<template>
  <q-card>
              <q-card-section>
                  <div class="box-ribbon-wrapper">
                    <q-toolbar class="q-pb-md">
                       <card-back/>
                    <q-ribbon
                        position="right"
                        color="rgba(0,0,0,.58)"
                        background-color="primary"
                        leaf-color="#a0a0a0"
                        leaf-position="bottom"
                        decoration="point-in"
                        style="margin-right: -28px;position:relative"
                        
                    >
                        <q-toolbar-title
                        class="example-title"
                        >
                        {{name}}
                        </q-toolbar-title>
                    </q-ribbon>
                    </q-toolbar>
                  </div>
              </q-card-section>
              <q-card-section>
                  <div class="col-12">
                      <slot name="content"></slot>
                </div>
                
              </q-card-section>
          </q-card>
</template>

<script>
import BackRibbon from './CardRibbonBack'
export default {
    components:{
        'card-back':BackRibbon
    },
    props:{
        name:{
            type:String,
            default:'....'
        },
    }
}
</script>

<style>

</style>