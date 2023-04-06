<template>
  <q-page>
    <order-header :order="order" />
    <q-card>
      <order-lines-todo
        v-if="order.ProposalForm.slug === 'mua-hang'"
        :orderLines="getMetaValue()"
      />
      <thanh-toan
        v-else-if="order.ProposalForm.slug === 'thanh-toan'"
        :disable="true"
        :metaValue="getMetaValue()[0]"
      ></thanh-toan>
      <cars-order
        :oneOrder="getOneRequest()"
        v-else-if="order.ProposalForm.slug === 'dang-ky-xe'"
      />
      <q-card-section v-if="!request.completed && parentOrder.length">
        <div class="q-gutter-md">
          <!-- <q-badge color="secondary" multi-line> Model: "{{ banTGD }}" </q-badge> -->

          <q-select
            filled
            v-model="banTGD"
            :options="options"
            label="Ban tổng giám đốc"
            color="teal"
            clearable
            options-selected-class="text-deep-orange"
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label v-html="scope.opt.label" />
                  <q-item-label caption>
                    {{ scope.opt.description }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
      </q-card-section>

      <q-card-actions v-if="!request.completed" class="float-right">
        <div v-if="!parentOrder.length || banTGD">
          <q-btn
            @click="promptToDelete(request)"
            color="red"
            icon="clear"
            label="Hủy"
          />
          <q-btn
            @click="completedRequest(request)"
            color="primary"
            icon="done"
            label="Duyệt"
          />
        </div>
      </q-card-actions>

      <q-card-section v-else-if="request.completed">
        <div class="text-h6">Đã duyệt</div>
        <div class="text-subtitle2">{{ request.updatedAt | luc }}</div>
      </q-card-section>
      <q-card-section v-else>
        <div class="text-h6">Không đồng ý</div>
        <div class="text-subtitle2">{{ request.updatedAt | luc }}</div>
      </q-card-section>
    </q-card>
    <send-message v-if="request.showMessages" :order="order" />
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import OrderHeader from "components/eof/Shared/OrderHeader.vue";
import OrderLinesTodo from "components/eof/OrderLines/OrderLinesTodo.vue";
import ThanhToan from "components/eof/ThanhToan.vue";
import CarsOrder from "components/eof/DatXeCongTac/CarsOrder.vue";
import SendMessage from "components/eof/Shared/SendMessage.vue";
export default {
  data() {
    return {
      dataTest: "",
      banTGD: null,
      options: [
        {
          label: "Vũ Hải Bằng",
          value: "100400",
          description: "Chủ tịch HĐQT"
        },
        {
          label: "Trần Thị Thu Hàn",
          value: "100400",
          description: "Tổng giám đốc"
        }
      ]
    };
  },
  components: {
    OrderHeader,
    OrderLinesTodo,
    ThanhToan,
    SendMessage,
    CarsOrder
  },
  methods: {
    ...mapActions("requests", [
      "getOneRequest",
      "addRequest",
      "completedRequest",
      "cancelRequest"
    ]),
    ...mapActions("orders", ["getOneOrder"]),
    promptToDelete(request) {
      this.$q
        .dialog({
          title: "Xác nhận",
          message: "Bạn thực sự muốn Hủy?",
          ok: {
            push: true
          },
          cancel: {
            color: "negative"
          },
          persistent: true
        })
        .onOk(() => {
          this.cancelRequest(request);
          this.$router.go(-1);
        });
    },
    getMetaValue() {
      const { OrderMeta } = this.order;
      return JSON.parse(OrderMeta[0].metaValue);
    }
  },
  computed: {
    ...mapGetters("requests", ["request"]),
    ...mapGetters("base", ["userInfo"]),
    ...mapGetters("orders", ["order"]),
    parentOrder() {
      return this.order.Requests.filter(
        r => r.parentId === this.request.id && r.position === "Ban TGĐ"
      );
    }
  },
  async created() {
    if (this.$route.query.id) {
      this.dataTest = await this.getOneRequest(this.$route.query.id).then(
        request => {
          this.getOneOrder(request.orderId);
        }
      );
      console.log("this.dataTest", this.dataTest);
    }
  }
};
</script>
