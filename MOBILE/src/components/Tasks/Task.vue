<template>
  <div>
    <q-item
      v-if="task.conThucHien && task.conThucHien > 0"
      @click="goDetail(task.code)"
      clickable
      v-ripple
    >
      <q-item-section>
        <q-item-label class="text-subtitle2">
          [{{ task.itemCode }}] - {{ task.itemName }} ({{ task.itemHeight }}*{{
            task.itemWidth
          }}*{{ task.itemLength }})
        </q-item-label>
        <q-item-label caption lines="2">
          <q-badge :color="!task.loiCongDon ? 'teal' : 'orange-10'">
            {{ task.number.toUpperCase()
            }}{{ task.market ? " * " + task.root : "" }}
          </q-badge>
        </q-item-label>
      </q-item-section>
      <!-- {{task}} -->
      <q-item-section side top>
        <q-item-label caption>{{
          moment(task.ngayDongGoi)
            .subtract(
              Math.ceil(task.thoiGianBatDau + +task.thoiGianCho),
              "days"
            )
            .format("L")
        }}</q-item-label>
        <q-badge
          :color="!task.loiCongDon ? 'teal' : 'orange-10'"
          :label="task.conThucHien"
        />
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
export default {
  props: ["task", "id", "completed", "searchQuery"],
  methods: {
    goDetail(po) {
      this.$router.push({
        name: "confirm-po",
        params: { code: po + "_" + this.task.number + "_" + this.searchQuery }
      });
    }
  }
};
</script>

<style></style>
