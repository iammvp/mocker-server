<template>
  <div class="buttons">
    <p class="confirm" @click="confirmClicked">确认</p>
    <p class="import" @click="importClicked">导入配置</p>
  </div>
</template>

<script>
export default {
  props: ['confirm', 'importConfig'],
  methods: {
    confirmClicked () {
      this.$emit('confirm')
    },
    importClicked () {
      this.$emit('importConfig')
    }
  }
}
</script>

 <style lang="less" scoped>
.buttons{
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  p{
    width: 100px;
    height: 32px;
    cursor: pointer;
    border-radius: 5px;
    color: #fff;
    background-color: #5cb85c;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 20px;
    &:hover{
      background-color:#449d44;
    }
  }
}
</style>
