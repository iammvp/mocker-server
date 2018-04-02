<template>
  <div class="path">
    <input type="text" :value="desc" @change="handleDescChange($event)" placeholder="接口描述">
    <input type="text" :value="path" @change="handlePathChange($event)" placeholder="接口路径,包含/">
  </div>
</template>

<script>
export default {
  props: ['path', 'desc'],
  methods: {
    handlePathChange (e) {
      this.$emit('pathChange', e.target.value)
    },
    handleDescChange (e) {
      this.$emit('descChange', e.target.value)
    }
  }

}
</script>

<style lang="less" scoped>
.path{
  display: flex;
  justify-content: space-around;
  input{
    height: 30px;
    width: 258px;
    font-size: 14px;
    &:focus{
      outline: none;
    }
  }
}
</style>
