<template>
  <router-link
    :to="{ name: 'tabs', params: { id: item.id } }"
    :class="$style.item"
    :active-class="$style.active"
    :title="!showLabel && item.label"
    tag="button"
  >
    <div
      v-if="hasNotificationBadge"
      :class="[
        $style.badge,
        $style[`badgeColor_${badgeColor}`],
        $style[`badgeSize_${badgeSize}`],
      ]"
    />
    <div
      :class="{
        [$style.thumb]: true,
        [$style.thumbIsImage]: pageState.favicon,
        [$style.thumbIsIcon]: !pageState.favicon,
      }"
    >
      <img
        v-if="pageState.favicon"
        :src="pageState.favicon"
        :class="$style.image"
      >
      <app-icon
        v-else
        face="Tab"
      />
    </div>
    <div
      v-if="showLabel"
      :class="$style.label"
    >
      {{ item.label }}
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: () => ({}),
    },
    showLabel: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    pageState() {
      return this.$store.getters['Pages/state'](this.item.id);
    },
    hasNotificationBadge() {
      return this.pageState.hasNotificationBadge && this.badgeSize !== 'hidden';
    },
    badgeColor() {
      return this.$store.getters['Settings/byKey']('navigation.indicatorBadgeColor');
    },
    badgeSize() {
      return this.$store.getters['Settings/byKey']('navigation.indicatorBadgeSize');
    },
  },
};
</script>

<style lang="postcss" module>
.item {
  @apply
    flex flex-shrink-0 items-center p-2
    text-gray-600 text-left rounded-sm;
}

.item + .item {
  @apply mt-1;
}

.active {
  @apply text-gray-400 bg-gray-800 shadow;
}

.badge {
  @apply absolute left-0 rounded-full;
  transform: translateX(-50%);
}

.badgeColor_blue {
  @apply bg-blue-400;
}

.badgeColor_gray {
  @apply bg-gray-600;
}

.badgeColor_orange {
  @apply bg-orange-500;
}

.badgeColor_red {
  @apply bg-red-600;
}

.badgeColor_yellow {
  @apply bg-yellow-500;
}

.badgeSize_normal {
  @apply w-2 h-2;
}

.badgeSize_large {
  @apply w-3 h-3;
}

.thumb {
  @apply
    flex flex-shrink-0 justify-center items-center
    p-1 w-8 h-8 rounded-sm;
}

.thumbIsImage {
  @apply bg-gray-100;
}

.thumbIsIcon {
  @apply text-gray-500 bg-gray-700;
}

.image {
  @apply block max-w-full max-h-full;
}

.label {
  @apply ml-3 truncate;
  max-width: theme('width.40');
}
</style>
