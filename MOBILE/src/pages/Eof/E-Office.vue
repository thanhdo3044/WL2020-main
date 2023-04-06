<template>
  <q-page class="q-mt-sm flex flex-center">
    <!-- <div id="animation" style="" class="text-center row " >Menu EOFFICE</div> -->

    <!-- <list-header bgcolor="bg-orange-4">Menu E-Office</list-header> -->
    <!-- <div class="view">
      <div class="plane main">
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
        <div class="circle"></div>
      </div>
    </div> -->
    <!-- <div class="wrapper">
      <div class="ring">
        <div class="coccoc-alo-phone coccoc-alo-green coccoc-alo-show">
          <div class="coccoc-alo-ph-circle"></div>
          <div class="coccoc-alo-ph-circle-fill"></div>
          <div class="coccoc-alo-ph-img-circle">
            <font-awesome-icon
              style="width:30px;height:30px"
              id="icon-notifi"
              color="orange"
              :icon="icon"
              size="lg"
            />
          </div>
        </div>
      </div>
    </div> -->

    <div class="row" style="margin-top:-2rem">
      <div class="row col-12 col-sm-6 flex flex-center">
        <div  class="col-6 col-sm-6 flex flex-center">
          <div>
            <div class="wrapper" @click="goDetail('tao-de-xuat')" id="hover-card-left">
              <div class="ring">
                <div class="row">
                  <div class=" flex ">
                    <div
                      class="coccoc-alo-phone coccoc-alo-green coccoc-alo-show"
                    >
                      <div class="coccoc-alo-ph-circle"></div>
                      <div class="coccoc-alo-ph-circle-fill"></div>
                      <div class="coccoc-alo-ph-img-circle">
                        <font-awesome-icon
                          style="width:30px;height:30px"
                          id="icon-notifi"
                          color="white"
                          :icon="iconFileSignature"
                          size="lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style="font-size:16px;"
                  class="text-primary q-pl-sm text-md-center text-center"
                >
                  Tạo phiếu đề xuất
                </div>
              </div>
            </div>
          </div>
        </div>
        <div  class=" col-6 flex flex-center">
          <div>
            <div class="wrapper" id="hover-card-left">
              <div class="ring">
                <div class="row">
                  <div class=" flex ">
                    <div
                      class="coccoc-alo-phone coccoc-alo-green coccoc-alo-show"
                    >
                      <div class="coccoc-alo-ph-circle"></div>
                      <div class="coccoc-alo-ph-circle-fill"></div>
                      <div class="coccoc-alo-ph-img-circle">
                        <font-awesome-icon
                          style="width:30px;height:30px"
                          id="icon-notifi"
                          color="white"
                          :icon="iconHouseUser"
                          size="lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style="font-size:16px;"
                  class="text-primary q-pl-sm text-md-center text-center"
                >
                  Đặt lịch phòng họp
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="row col-12 col-sm-6 ">
        <div  class="col-6 flex flex-center">
          <div>
            <div class="wrapper" @click="goDetail('lich-lam-viec')"  id="hover-card-left">
              <div class="ring">
                <div class="row">
                  <div class=" flex">
                    <div
                      class="coccoc-alo-phone coccoc-alo-green coccoc-alo-show"
                    >
                      <div class="coccoc-alo-ph-circle"></div>
                      <div class="coccoc-alo-ph-circle-fill"></div>
                      <div class="coccoc-alo-ph-img-circle">
                        <font-awesome-icon
                          style="width:30px;height:30px"
                          id="icon-notifi"
                          color="white"
                          :icon="iconCalendar"
                          size="lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style="font-size:16px;"
                  class="text-primary q-pl-sm text-md-center text-center"
                >
                  Đăng kí lịch làm việc
                </div>
              </div>
            </div>
          </div>
        </div>
        <div  class="col-6  flex flex-center">
          <div>
            <div class="wrapper"  id="hover-card-left">
              <div class="ring">
                <div class="row">
                  <div class=" flex ">
                    <div
                      class="coccoc-alo-phone coccoc-alo-green coccoc-alo-show"
                    >
                      <div class="coccoc-alo-ph-circle"></div>
                      <div class="coccoc-alo-ph-circle-fill"></div>
                      <div class="coccoc-alo-ph-img-circle">
                        <font-awesome-icon
                          style="width:30px;height:30px"
                          id="icon-notifi"
                          color="white"
                          :icon="iconCar"
                          size="lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style="font-size:16px;"
                  class="text-primary q-pl-sm text-md-center text-center"
                >
                  Đặt xe đi công tác
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <q-list separator bordered>
      <q-item
        @click="goDetail('tao-de-xuat')"
        class="bg-orange-1"
        clickable
        v-ripple
      >
        <q-item-section class="text-center">
          <q-item-label class="text-h5">Phê duyệt online</q-item-label>
        </q-item-section>
      </q-item>
      <q-item
        @click="goDetail('page-xe-cong-tac')"
        class="bg-orange-1"
        clickable
        v-ripple
      >
        <q-item-section class="text-center">
          <q-item-label class="text-h5">Đặt xe đi công tác</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="bg-orange-1" @click="goDetail('lich-lam-viec')" clickable v-ripple>
        <q-item-section class="text-center">
          <q-item-label class="text-h5">Lịch làm việc</q-item-label>
        </q-item-section>
      </q-item>
      <q-item class="bg-orange-1" clickable v-ripple>
        <q-item-section class="text-center">
          <q-item-label class="text-h5">Đặt lịch phòng họp</q-item-label>
        </q-item-section>
      </q-item>
    </q-list> -->
  </q-page>
</template>
<script>
import {
  FontAwesomeIcon,
  FontAwesomeLayers,
  FontAwesomeLayersText
} from "@fortawesome/vue-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { faFileSignature } from "@fortawesome/free-solid-svg-icons";
import { faCarSide } from "@fortawesome/free-solid-svg-icons";
import { faHouseUser } from "@fortawesome/free-solid-svg-icons";
export default {
  components: {
    "list-header": require("components/Shared/ListHeader.vue").default,
    FontAwesomeIcon,
    FontAwesomeLayers,
    FontAwesomeLayersText
  },
  data() {
    return {
      iconCalendar: faCalendarAlt,
      iconFileSignature: faFileSignature,
      iconCar: faCarSide,
      iconHouseUser: faHouseUser
    };
  },
  methods: {
    goDetail(path) {
      this.$router.push({
        path
      });
    }
  }
};
</script>
<style scoped>
#animation {
   position: absolute;
  font-family: sans-serif;
  text-transform: uppercase;
  font-size: 1.5em;
  top:50%;
  letter-spacing: 4px;
  overflow: hidden;
  background: linear-gradient(90deg, blue, #fff, #000);
  background-repeat: no-repeat;
  background-size: 80%;
  animation: animate 3s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: rgba(255, 255, 255, 0);
} 

 @keyframes animate {
  0% {
    background-position: -500%;
  }
  100% {
    background-position: 500%;
  }
}
#hover-card-right {
  transition: width 2s, height 2s, transform 1.5s;
}
#hover-card-left {
  transition: width 2s, height 2s, transform 1.5s;
}

#text-shadow {
  /* text-shadow: 0px 4px 0px rgba(0, 0, 0, 0.4); */
}
#hover-card-right:hover {
  cursor: pointer;
  transform: scale(1.1);
}
#hover-card-left:hover {
  cursor: pointer;
  transform: scale(1.1);
}
.view {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  perspective: 400;
}

.plane {
  width: 120px;
  height: 120px;
  transform-style: preserve-3d;
}
.plane.main {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  transform: rotateX(60deg) rotateZ(-30deg);
  -webkit-animation: rotate 20s infinite linear;
  animation: rotate 20s infinite linear;
}
.plane.main .circle {
  width: 120px;
  height: 120px;
  position: absolute;
  transform-style: preserve-3d;
  border-radius: 100%;
  box-sizing: border-box;
  box-shadow: 0 0 60px crimson, inset 0 0 60px crimson;
}
.plane.main .circle::before,
.plane.main .circle::after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: 10%;
  height: 10%;
  border-radius: 100%;
  background: crimson;
  box-sizing: border-box;
  box-shadow: 0 0 60px 2px crimson;
}
.plane.main .circle::before {
  transform: translateZ(-90px);
}
.plane.main .circle::after {
  transform: translateZ(90px);
}
.plane.main .circle:nth-child(1) {
  transform: rotateZ(72deg) rotateX(63.435deg);
}
.plane.main .circle:nth-child(2) {
  transform: rotateZ(144deg) rotateX(63.435deg);
}
.plane.main .circle:nth-child(3) {
  transform: rotateZ(216deg) rotateX(63.435deg);
}
.plane.main .circle:nth-child(4) {
  transform: rotateZ(288deg) rotateX(63.435deg);
}
.plane.main .circle:nth-child(5) {
  transform: rotateZ(360deg) rotateX(63.435deg);
}

@-webkit-keyframes rotate {
  0% {
    transform: rotateX(0) rotateY(0) rotateZ(0);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
  }
}

@keyframes rotate {
  0% {
    transform: rotateX(0) rotateY(0) rotateZ(0);
  }
  100% {
    transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
  }
}

/*  vòng tròn ngoài */
/* .coccoc-alo-ph-circle {
  width: 160px;
  height: 160px;
  top: 20px;
  left: 20px;
  position: absolute;
  background-color: transparent;
  -webkit-border-radius: 100%;
  -moz-border-radius: 100%;
  border-radius: 100%;
  border: 2px solid rgba(30, 30, 30, 0.4);
  opacity: 0.1;
  -webkit-animation: coccoc-alo-circle-anim 1.2s infinite ease-in-out;
  -moz-animation: coccoc-alo-circle-anim 1.2s infinite ease-in-out;
  -ms-animation: coccoc-alo-circle-anim 1.2s infinite ease-in-out;
  -o-animation: coccoc-alo-circle-anim 1.2s infinite ease-in-out;
  animation: coccoc-alo-circle-anim 1.2s infinite ease-in-out;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
} */

.coccoc-alo-phone {
  background-color: transparent;
  width: 200px;
  height: 160px;
  cursor: pointer;
  z-index: 2 !important;
  -webkit-backface-visibility: hidden;
  -webkit-transform: translateZ(0);
  -webkit-transition: visibility 0.5s;
  -moz-transition: visibility 0.5s;
  -o-transition: visibility 0.5s;
  transition: visibility 0.5s;
  right: 150px;
  top: 30px;
}

.coccoc-alo-phone.coccoc-alo-green .coccoc-alo-ph-circle-fill {
  background-color: rgba(0, 175, 242, 0.5);
  opacity: 0.75 !important;
}

.coccoc-alo-ph-circle-fill {
  width: 100px;
  height: 100px;
  top: 50px;
  left: 50px;
  position: absolute;
  background-color: #000;
  -webkit-border-radius: 100%;
  -moz-border-radius: 100%;
  border-radius: 100%;
  border: 2px solid transparent;
  opacity: 0.1;
  -webkit-animation: coccoc-alo-circle-fill-anim 2.3s infinite ease-in-out;
  -moz-animation: coccoc-alo-circle-fill-anim 2.3s infinite ease-in-out;
  -ms-animation: coccoc-alo-circle-fill-anim 2.3s infinite ease-in-out;
  -o-animation: coccoc-alo-circle-fill-anim 2.3s infinite ease-in-out;
  animation: coccoc-alo-circle-fill-anim 2.3s infinite ease-in-out;
  -webkit-transition: all 0.5s;
  -moz-transition: all 0.5s;
  -o-transition: all 0.5s;
  transition: all 0.5s;
}

.coccoc-alo-ph-img-circle {
  width: 60px;
  height: 60px;
  top: 70px;
  left: 70px;
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(30, 30, 30, 0.1) no-repeat center center;
  -webkit-border-radius: 100%;
  -moz-border-radius: 100%;
  border-radius: 100%;
  border: 2px solid transparent;
  opacity: 0.7;
  -webkit-animation: coccoc-alo-circle-img-anim 1s infinite ease-in-out;
  -moz-animation: coccoc-alo-circle-img-anim 1s infinite ease-in-out;
  -ms-animation: coccoc-alo-circle-img-anim 1s infinite ease-in-out;
  -o-animation: coccoc-alo-circle-img-anim 1s infinite ease-in-out;
  animation: coccoc-alo-circle-img-anim 1s infinite ease-in-out;
}

.coccoc-alo-phone.coccoc-alo-green .coccoc-alo-ph-img-circle {
  background-color: #00aff2;
}

.coccoc-alo-phone.coccoc-alo-green .coccoc-alo-ph-circle {
  border-color: #00aff2;
  opacity: 0.5;
}

.coccoc-alo-phone.coccoc-alo-green.coccoc-alo-hover .coccoc-alo-ph-circle,
.coccoc-alo-phone.coccoc-alo-green:hover .coccoc-alo-ph-circle {
  border-color: #75eb50;
  opacity: 0.5;
}

.coccoc-alo-phone.coccoc-alo-green.coccoc-alo-hover .coccoc-alo-ph-circle-fill,
.coccoc-alo-phone.coccoc-alo-green:hover .coccoc-alo-ph-circle-fill {
  background-color: rgba(117, 235, 80, 0.5);
  opacity: 0.75 !important;
}

.coccoc-alo-phone.coccoc-alo-green.coccoc-alo-hover .coccoc-alo-ph-img-circle,
.coccoc-alo-phone.coccoc-alo-green:hover .coccoc-alo-ph-img-circle {
  background-color: #75eb50;
}

@-moz-keyframes coccoc-alo-circle-anim {
  0% {
    transform: rotate(0) scale(0.5) skew(1deg);
    opacity: 0.1;
  }
  30% {
    transform: rotate(0) scale(0.7) skew(1deg);
    opacity: 0.5;
  }
  100% {
    transform: rotate(0) scale(1) skew(1deg);
    opacity: 0.1;
  }
}

@-webkit-keyframes coccoc-alo-circle-anim {
  0% {
    transform: rotate(0) scale(0.5) skew(1deg);
    opacity: 0.1;
  }
  30% {
    transform: rotate(0) scale(0.7) skew(1deg);
    opacity: 0.5;
  }
  100% {
    transform: rotate(0) scale(1) skew(1deg);
    opacity: 0.1;
  }
}

@-o-keyframes coccoc-alo-circle-anim {
  0% {
    transform: rotate(0) scale(0.5) skew(1deg);
    opacity: 0.1;
  }
  30% {
    transform: rotate(0) scale(0.7) skew(1deg);
    opacity: 0.5;
  }
  100% {
    transform: rotate(0) scale(1) skew(1deg);
    opacity: 0.1;
  }
}

@keyframes coccoc-alo-circle-anim {
  0% {
    transform: rotate(0) scale(0.5) skew(1deg);
    opacity: 0.1;
  }
  30% {
    transform: rotate(0) scale(0.7) skew(1deg);
    opacity: 0.5;
  }
  100% {
    transform: rotate(0) scale(1) skew(1deg);
    opacity: 0.1;
  }
}

@-moz-keyframes coccoc-alo-circle-fill-anim {
  0% {
    transform: rotate(0) scale(0.7) skew(1deg);
    opacity: 0.2;
  }
  50% {
    transform: rotate(0) scale(1) skew(1deg);
    opacity: 0.2;
  }
  100% {
    transform: rotate(0) scale(0.7) skew(1deg);
    opacity: 0.2;
  }
}

@-webkit-keyframes coccoc-alo-circle-fill-anim {
  0% {
    transform: rotate(0) scale(0.7) skew(1deg);
    opacity: 0.2;
  }
  50% {
    transform: rotate(0) scale(1) skew(1deg);
    opacity: 0.2;
  }
  100% {
    transform: rotate(0) scale(0.7) skew(1deg);
    opacity: 0.2;
  }
}

@-o-keyframes coccoc-alo-circle-fill-anim {
  0% {
    transform: rotate(0) scale(0.7) skew(1deg);
    opacity: 0.2;
  }
  50% {
    transform: rotate(0) scale(1) skew(1deg);
    opacity: 0.2;
  }
  100% {
    transform: rotate(0) scale(0.7) skew(1deg);
    opacity: 0.2;
  }
}

@keyframes coccoc-alo-circle-fill-anim {
  0% {
    transform: rotate(0) scale(0.7) skew(1deg);
    opacity: 0.2;
  }
  50% {
    transform: rotate(0) scale(1) skew(1deg);
    opacity: 0.2;
  }
  100% {
    transform: rotate(0) scale(0.7) skew(1deg);
    opacity: 0.2;
  }
}

@-moz-keyframes coccoc-alo-circle-img-anim {
  0% {
    transform: rotate(0) scale(1) skew(1deg);
  }
  10% {
    transform: rotate(-25deg) scale(1) skew(1deg);
  }
  20% {
    transform: rotate(25deg) scale(1) skew(1deg);
  }
  30% {
    transform: rotate(-25deg) scale(1) skew(1deg);
  }
  40% {
    transform: rotate(25deg) scale(1) skew(1deg);
  }
  50% {
    transform: rotate(0) scale(1) skew(1deg);
  }
  100% {
    transform: rotate(0) scale(1) skew(1deg);
  }
}

@-webkit-keyframes coccoc-alo-circle-img-anim {
  0% {
    transform: rotate(0) scale(1) skew(1deg);
  }
  10% {
    transform: rotate(-25deg) scale(1) skew(1deg);
  }
  20% {
    transform: rotate(25deg) scale(1) skew(1deg);
  }
  30% {
    transform: rotate(-25deg) scale(1) skew(1deg);
  }
  40% {
    transform: rotate(25deg) scale(1) skew(1deg);
  }
  50% {
    transform: rotate(0) scale(1) skew(1deg);
  }
  100% {
    transform: rotate(0) scale(1) skew(1deg);
  }
}

@-o-keyframes coccoc-alo-circle-img-anim {
  0% {
    transform: rotate(0) scale(1) skew(1deg);
  }
  10% {
    transform: rotate(-25deg) scale(1) skew(1deg);
  }
  20% {
    transform: rotate(25deg) scale(1) skew(1deg);
  }
  30% {
    transform: rotate(-25deg) scale(1) skew(1deg);
  }
  40% {
    transform: rotate(25deg) scale(1) skew(1deg);
  }
  50% {
    transform: rotate(0) scale(1) skew(1deg);
  }
  100% {
    transform: rotate(0) scale(1) skew(1deg);
  }
}

@keyframes coccoc-alo-circle-img-anim {
  0% {
    transform: rotate(0) scale(1) skew(1deg);
  }
  10% {
    transform: rotate(-25deg) scale(1) skew(1deg);
  }
  20% {
    transform: rotate(25deg) scale(1) skew(1deg);
  }
  30% {
    transform: rotate(-25deg) scale(1) skew(1deg);
  }
  40% {
    transform: rotate(25deg) scale(1) skew(1deg);
  }
  50% {
    transform: rotate(0) scale(1) skew(1deg);
  }
  100% {
    transform: rotate(0) scale(1) skew(1deg);
  }
}
</style>
