<template>  
    <q-page class="q-pa-md column justify-center">
        <div class="row justify-center">
            <div class="col-12 col-sm-6">
                <card-button :click="goSupplier"  :textColor="'white'" :bgColor="'blue'" :text="'Nhà cung cấp'"></card-button>
            </div>
        </div>
        <div class="row justify-center q-mt-md">
            <div class="col-12 col-sm-6">
                <card-button :click="goItem"  :textColor="'white'" :bgColor="'red'" :text="'Qui cách'"></card-button>
            </div>
        </div>
        <!-- <div class="row justify-center">
            <div class="col-12 col-sm-6">
                 <q-btn color="primary" @click="goSupplier" class="full-width" label="Nhà cung cấp" />
            </div>
        </div>
        <div class="row justify-center">
            <div class="col-12 col-sm-6">
                 <q-btn color="secondary" class="full-width" label="Qui cách" />
            </div>
        </div> -->
    </q-page>
</template>

<script>
import CardButton from '../../../components/wood/CardButton'
export default {
    components:{
        'card-button' :CardButton
    },
    data (){
        return {
            a:1
        }
    },
    methods:{
        goSupplier(){
            this.$router.push('/wood-setting-supplier')
        },
        goItem(){
            this.$router.push('/wood-setting-item')
        }
    }
}
</script>

<style>

</style>