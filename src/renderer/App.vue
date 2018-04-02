<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'mocker-server',
  methods: {
    ...mapActions({
      load: 'loadLists'// 加载数据库中的数据
    })
  },
  mounted () {
    this.load()
  }
}
</script>

<style>
body,p{
  margin: 0px;
  padding: 0px;
}
html,body{
  height: 100%;
}
body{
  display: flex;
font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
}
#app{
  width: 100%;
}
</style>
