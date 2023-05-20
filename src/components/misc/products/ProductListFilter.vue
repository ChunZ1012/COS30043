<template>
  <!-- Filtering Panel Card -->
  <v-card
    :variant="showOutline ? 'outlined' : null"
    :flat="!showOutline ? true : null"
    rounded
    :width="isMobile ? '100&%' : '98%'"
  >
    <!-- By Category Filtering -->
    <v-card-item density="compact">
      <p class="fs-5">By Category</p>

      <v-checkbox
        v-for="category in categories"
        v-model="selectedCategory"
        :label="category.title"
        :value="category.name"
        density="compact"
        hide-details
      >
      </v-checkbox>
    </v-card-item>
    <div class="px-2">
      <v-divider :thickness="3" class="mt-0"></v-divider>
    </div>
    <v-card-item density="compact">
      <p class="fs-5">By Price</p>
      <v-range-slider
        v-model="range"
        strict
        hide-details
        :max="priceMax"
        :min="0"
        :steps="0.01"
        density="compact"
        thumb-size="12"
      >
      </v-range-slider>

      <div class="d-flex flex-row">
        <v-text-field
          :model-value="range[0].toFixed(2)"
          hide-details
          single-line
          class="col-auto"
          type="number"
          variant="flat"
          density="compact"
          @update:model-value="$set(range, 0, $event)"
        ></v-text-field>
        <v-text-field
          :model-value="range[1].toFixed(2)"
          hide-details
          single-line
          class="col-auto"
          type="number"
          variant="flat"
          density="compact"
          @update:model-value="$set(range, 1, $event)"
        ></v-text-field>
      </div>
    </v-card-item>
  </v-card>
</template>

<script>
export default {
  name: "ProductListFilter",
  props: {
    isMobile: {
      type: Boolean,
      default: false,
    },
    showOutline: {
      type: Boolean,
      default: true,
    },
    categories: {
      type: Array,
      default: [],
    },
    priceRange: {
      type: Array,
      default: [0, 0],
    },
    priceMax: {
      type: Number,
      default: 0,
    },
  },
  created() {
    this.range = this.priceRange;
  },
  data: function () {
    return {
      selectedCategory: [],
      range: [],
    };
  },
  watch: {
    selectedCategory() {
      this.$emit("onSelectedCategoryChange", this.selectedCategory);
    },
    range() {
      this.$emit("onPriceRangeChange", this.range);
    },
  },
};
</script>
