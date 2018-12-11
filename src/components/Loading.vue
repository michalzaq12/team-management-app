<template>
  <transition :name="animation">
    <div
      class="loading-overlay is-active"
      :class="{ 'is-full-page': isFullPage }"
      v-if="isActive">
      <div class="loading-background" @click="cancel"/>
      <div class="loading-icon"/>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'v-loading',
    props: {
      active: {
        type: Boolean,
        required: true
      },
      isFullPage: {
        type: Boolean,
        default: false
      },
      animation: {
        type: String,
        default: 'fade'
      },
      canCancel: {
        type: Boolean,
        default: false
      },
      onCancel: {
        type: Function,
        default: () => {}
      }
    },
    data() {
      return {
        isActive: this.active || false
      }
    },
    watch: {
      active(value) {
        this.isActive = value
      }
    },
    methods: {
      cancel() {
        if (!this.canCancel || !this.isActive) return;
        this.close()
      },
      close() {
        this.onCancel.apply(null, arguments);
        this.$emit('close');
        this.$emit('update:active', false);
      }
    }
  }
</script>


<style lang="scss" scoped>
  @mixin overlay($offset: 0){
    bottom: $offset;
    left: $offset;
    position: absolute;
    right: $offset;
    top: $offset;
  }

  @keyframes spinAround{
    from{
      transform: rotate(0deg);
    }
    to{
      transform: rotate(359deg);
    }
  }


  @mixin loader{
    animation: spinAround 500ms infinite linear;
    border: 2px solid $brand-primary;
    border-radius: 999999px;
    border-right-color: transparent;
    border-top-color: transparent;
    content: "";
    display: block;
    height: 1em;
    position: relative;
    width: 1em;
  }

  .loading-overlay {
    @include overlay;
    align-items: center;
    display: none;
    justify-content: center;
    overflow: hidden;
    z-index: 999;
  &.is-active {
     display: flex
   }
  &.is-full-page {
     position: fixed;
  .loading-icon {
  &:after {
     top: calc(50% - 2.5em);
     left: calc(50% - 2.5em);
     width: 5em;
     height: 5em;
   }
  }
  }
  .loading-background {
    @include overlay;
    pointer-events: none;
    background:#7f7f7f;
    background:rgba(255,255,255,0.4);
  }
  .loading-icon {
    position: relative;
  &:after {
     @include loader;
     position: absolute;
     top: calc(50% - 1.5em);
     left: calc(50% - 1.5em);
     width: 3em;
     height: 3em;
     border-width: 0.25em;
   }
  }
  }
</style>
