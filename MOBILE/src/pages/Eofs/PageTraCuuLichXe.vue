<template>
  <q-page>
    <q-card>
      <q-card-section>
        <q-btn icon="event" round color="primary" class="float-right q-mb-sm">
          <q-popup-proxy
            @before-show="updateProxy"
            transition-show="scale"
            transition-hide="scale"
          >
            <q-date
              v-model="proxyDate"
              title="Tìm theo ngày"
              subtitle="Lịch đặt xe từ ngày"
              :today-btn="true"
            >
              <div class="row items-center justify-end q-gutter-sm">
                <q-btn label="Hủy" color="primary" flat v-close-popup />
                <q-btn
                  label="Đồng ý"
                  color="primary"
                  flat
                  @click="save"
                  v-close-popup
                />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-btn>
        <div class="text-h6">Tra cứu lịch xe</div>
        <div class="q-mb-sm" v-if="date">
          <q-badge> Ngày: {{ date }} </q-badge>
        </div>
        <div class="text-subtitle2">by E-Office</div>
      </q-card-section>
    </q-card>
    <div class="q-pa-md" style="max-width: 350px">
      <q-list>
        <q-item clickable v-ripple @click="goToDetail('xem-lich-xe')">
          <q-item-section>
            <q-item-label>Đặt xe đi công tác</q-item-label>
            <q-item-label caption
              >Hành trình xe chạy từ Thuận Hưng đi Yên Sơn, Thái
              Bình</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-badge color="teal" label="10k" />
            <q-item-label caption>Đã duyệt!</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
        <q-item clickable v-ripple @click="goToDetail('xem-lich-xe')">
          <q-item-section>
            <q-item-label>Đặt xe đi công tác</q-item-label>
            <q-item-label caption
              >Hành trình xe chạy từ Thuận Hưng đi Yên Sơn, Thái
              Bình</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-badge color="teal" label="10k" />
            <q-item-label caption>Đã duyệt!</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
        <q-item clickable v-ripple @click="goToDetail('xem-lich-xe')">
          <q-item-section>
            <q-item-label>Đặt xe đi công tác</q-item-label>
            <q-item-label caption
              >Hành trình xe chạy từ Thuận Hưng đi Yên Sơn, Thái
              Bình</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-badge color="teal" label="10k" />
            <q-item-label caption>Đã duyệt!</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
        <q-item clickable v-ripple @click="goToDetail('xem-lich-xe')">
          <q-item-section>
            <q-item-label>Đặt xe đi công tác</q-item-label>
            <q-item-label caption
              >Hành trình xe chạy từ Thuận Hưng đi Yên Sơn, Thái
              Bình</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-badge color="teal" label="10k" />
            <q-item-label caption>Đã duyệt!</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
        <q-item clickable v-ripple @click="goToDetail('xem-lich-xe')">
          <q-item-section>
            <q-item-label>Đặt xe đi công tác</q-item-label>
            <q-item-label caption
              >Hành trình xe chạy từ Thuận Hưng đi Yên Sơn, Thái
              Bình</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-badge color="teal" label="10k" />
            <q-item-label caption>Đã duyệt!</q-item-label>
          </q-item-section>
        </q-item>

        <q-separator spaced inset />
        <q-item clickable v-ripple @click="goToDetail('xem-lich-xe')">
          <q-item-section>
            <q-item-label>Đặt xe đi công tác</q-item-label>
            <q-item-label caption
              >Hành trình xe chạy từ Thuận Hưng đi Yên Sơn, Thái
              Bình</q-item-label
            >
          </q-item-section>

          <q-item-section side top>
            <q-badge color="teal" label="10k" />
            <q-item-label caption>Đã duyệt!</q-item-label>
          </q-item-section>
        </q-item>

        <!-- <q-separator spaced inset /> -->
      </q-list>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      date: "2019/03/01",
      proxyDate: "2019/03/01"
    };
  },
  methods: {
    updateProxy() {
      this.proxyDate = this.date;
    },

    save() {
      this.date = this.proxyDate;
    },
    goToDetail(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style lang="scss" scoped></style>
