<template>
  <q-card flat bordered :class="cardClass" class="bg-blue-grey-7" style="border:2px solid white">
    <q-card-section>
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="text-h6 text-white">
            {{ item.height + " " + item.width + " " + item.length }}
          </div>
          <div class="prodTextTitle text-white">{{ item.name }}</div>
        </div>
        <div class="col-auto">
          <q-icon
            @click="removeItem(item)"
            style="font-size: 3rem; color: red"
            name="delete_forever"
          />
        </div>
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="row justify-center">
        <!-- <div class="col-2">
                    <q-icon style="font-size: 3rem;color:red" name="remove_circle_outline"/>
                </div> -->
        <div class="col-6">
          <q-input
          dark
            type="number"
            v-model.number="itemChooseQty"
            @input="updateQty"
            label="Số lượng"
          />
        </div>
        <div class="col-3">
          <q-input
          dark
            readonly
            style="padding-left: 10px"
            type="number"
            v-model.number="item.ton"
            label="Tồn"
          />
        </div>
        <!-- <div class="col-2">
                    <q-icon style="font-size: 3rem;color:green" name="add_circle_outline"/>
                </div> -->
      </div>
    </q-card-section>
    <q-card-actions>
      <slot name="actions"></slot>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
    },
    removeItem: {
      type: Function,
    },
    cardClass: {
      type: String,
      default: "",
    },
    typeMaterial: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      itemChooseQty: "",
    };
  },
  mounted() {
    this.itemChooseQty = this.item.qty;
  },
  methods: {
    updateQty() {
      const payload = {
        item: this.item,
        qty: this.itemChooseQty,
      };
      if (this.typeMaterial) {
        this.$store.dispatch("production/ACTION_UPDATE_MATERIAL_QTY", payload);
      } else {
        this.$store.dispatch("production/ACTION_UPDATE_QTY", payload);
      }
    },
  },
};
</script>

<style>
</style>