<template>
  <component
    :is="componentType"
    v-bind="componentProps"
    :class="[
      'btn',
      variantClass,
      sizeClass,
      { 'btn-liquid': liquid, 'is-loading': loading }
    ]"
    :disabled="componentType === 'button' ? (disabled || loading ? true : null) : null"
  >
    <span v-if="loading" class="btn-loader-spinner"></span>
    <slot v-else />
  </component>
</template>

<script setup>
import { computed, resolveComponent } from 'vue';

const props = defineProps({
  to: {
    type: String,
    default: ''
  },
  href: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'secondary',
    validator: (val) => ['primary', 'secondary', 'danger'].includes(val)
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['xs', 'sm', 'md', 'lg'].includes(val)
  },
  liquid: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'button'
  }
});

const componentType = computed(() => {
  if (props.to) {
    const isExternal = props.to.startsWith('http') || props.to.startsWith('mailto:') || props.to.startsWith('tel:') || props.to.startsWith('#');
    return isExternal ? 'a' : resolveComponent('NuxtLink');
  }
  if (props.href) {
    return 'a';
  }
  return 'button';
});

const componentProps = computed(() => {
  const isExternal = props.to && (props.to.startsWith('http') || props.to.startsWith('mailto:') || props.to.startsWith('tel:') || props.to.startsWith('#'));
  if (props.to && !isExternal) {
    return { to: props.to };
  }
  if (props.to || props.href) {
    return { href: props.to || props.href };
  }
  return { type: props.type };
});

const variantClass = computed(() => {
  return props.variant ? `btn-${props.variant}` : '';
});

const sizeClass = computed(() => {
  return props.size && props.size !== 'md' ? `btn-${props.size}` : '';
});
</script>

<style scoped>
.btn-loader-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  animation: rotation 0.8s linear infinite;
}

.is-loading {
  cursor: not-allowed;
  opacity: 0.7;
}

@keyframes rotation {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
