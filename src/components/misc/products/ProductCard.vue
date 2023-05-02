<template>
  <v-card
    role="button"
    elevation="4"
    variant="plain"
    class="mx-auto p-1 text-dark"
    ripple="true"
    :md="variableWidth ? 200 : undefined"
    :lg="variableWidth ? 290 : undefined"
    :width="!variableWidth ? 300 : undefined"
    rounded="8"
    color="white"
    :to="{
      name:'ProductDetail',
      params: {
        id: this.pid,
      },
      query: {
        name:this.title
      }
    }"
  >
    <v-img height="250" cover aspect-ratio="1/1" :src="url">
      <template v-slot:placeholder>
        <div class="d-flex align-center justify-center fill-height">
          <v-progress-circular
            color="primary"
            indeterminate
          ></v-progress-circular>
        </div>
      </template>
    </v-img>

    <v-hover>
      <v-card-item v-bind="props" class="text-dark">
        <h4 class="fw-bold text-truncate">{{ title }}</h4>
        <div class="d-flex flex-row align-items-center" v-if="discount">
          <del>
            <span class="fs-6">RM {{ price }}</span>
          </del>
          <span class="fs-5 ms-2" style="color: chocolate"
            >RM {{ (price - distAmt).toFixed(2) }}</span
          >
        </div>

        <div class="d-flex flex-row align-items-center" v-else>
          <span class="fs-5" color="white">RM {{ price.toFixed(2) }}</span>
        </div>
      </v-card-item>
    </v-hover>
  </v-card>
</template>

<script>
export default {
  name: "ProductCard",
  props: {
    pid: {
      type:String || Number,
      default: -1
    },
    title: {
      type:String,
      default: ""
    },
    url: {
      type:String,
      default: ""
    },
    discount: {
      type:Boolean,
      default: false
    },
    price: {
      type:Number,
      default: 0
    },
    distAmt: {
      type:Number,
      default: 0
    },
    variableWidth: {
      type:Boolean,
      default:false
    }
  }
};
</script>