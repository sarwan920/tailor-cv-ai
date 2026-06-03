<template>
  <component
    :is="componentType"
    v-bind="componentProps"
    :class="[
      'inline-flex items-center justify-center gap-2 font-sans font-medium text-[0.75rem] uppercase tracking-[0.16em] rounded-full border transition-all duration-150 select-none cursor-pointer disabled:cursor-not-allowed',
      variantClass,
      sizeClass,
      { 'btn-liquid': liquid, 'opacity-70': loading }
    ]"
    :disabled="componentType === 'button' ? (disabled || loading ? true : null) : null"
  >
    <span v-if="loading" class="w-3.5 h-3.5 border-2 border-current border-b-transparent rounded-full inline-block animate-spin"></span>
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
  switch (props.variant) {
    case 'primary':
      return 'bg-primary text-on-primary border-primary hover:bg-tertiary hover:border-tertiary disabled:bg-hairline disabled:border-hairline disabled:text-secondary disabled:opacity-50 active:translate-y-[1px]';
    case 'danger':
      return 'bg-danger text-white border-danger hover:bg-danger/90 disabled:opacity-50';
    case 'secondary':
    default:
      return 'bg-transparent text-primary border-hairline hover:bg-surface hover:border-hairline disabled:opacity-40';
  }
});

const sizeClass = computed(() => {
  switch (props.size) {
    case 'xs':
      return 'px-3 py-1.5 text-[0.65rem] tracking-[0.14em]';
    case 'sm':
      return 'px-4 py-2 text-[0.7rem] tracking-[0.16em]';
    case 'lg':
      return 'px-7 py-3.5 text-[0.8rem] tracking-[0.18em]';
    case 'md':
    default:
      return 'px-5 py-2.5 text-[0.72rem] tracking-[0.16em]';
  }
});
</script>
