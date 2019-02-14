<template>
  <div
    @click="handleOuterClick"
    class="cus-input"
  >
    <label v-if="label">{{label}}</label>
    <input
      v-bind="$attrs"
      ref="input"
      :style="{'width': label ? '80%' : '100%'}"
      :value="currentValue"
      @input="handleInput"
      :type="type"
      :maxlength="maxlength"
    >
    <div class="line"></div>
  </div>
</template>
<script>
export default {
  props: {
    label: {
      type: String
    },
    value: [String, Number],
    type: {
      type: String,
      default: "text"
    },
    maxlength: [String, Number]
  },
  data() {
    return {
      currentValue:
        this.value === undefined || this.value === null ? "" : this.value
    };
  },
  methods: {
    handleOuterClick() {
      this.$refs.input.focus();
    },
    handleInput(e) {
      let value = e.target.value;
      if (this.maxlength) {
        if (value.length > this.maxlength)
          value = value.slice(0, this.maxlength);
      }
      this.setCurrentValue(value);
      this.$emit("input", value);
    },
    setCurrentValue(value) {
      this.currentValue = value;
    }
  },
  watch: {
    value(val, oldValue) {
      this.setCurrentValue(val);
    }
  }
};
</script>
<style lang="less" scoped>
.cus-input {
  box-sizing: border-box;
  position: relative;
  width: 100%;
  height: 40px;
  background-color: #fff;
  padding: 0 0px;
  border-bottom: 2px solid #ccc;
  .line {
    width: 0;
    height: 2px;
    position: absolute;
    bottom: -2px;
    left: 0;
    background-color: #000;
    transition: all 0.2s ease;
  }
  label {
    color: #666;
    position: absolute;
    bottom: 0;
    width: 20%;
    float: left;
    display: block;
  }
  input {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 80%;
    float: left;
    font-size: 14px;
    border: none;
    outline: none;
    background-color: transparent;
  }
  input:focus + .line {
    width: 100%;
  }
}
</style>