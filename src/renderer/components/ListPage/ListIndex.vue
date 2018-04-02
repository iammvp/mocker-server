<template>
  <div class="container">
    <List v-if="schemaLists.length !== 0" />
    <NoSchema v-else />
    <Buttons/>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import {ipcRenderer} from 'electron'
import List from './List'
import Buttons from './Buttons'
import NoSchema from './NoSchema'
export default {
  name: 'container',
  components: {
    List,
    Buttons,
    NoSchema
  },
  methods: {
    ...mapMutations({
      changeServerStatus: 'CHANGE_SERVER_STATUS'
    })

  },
  computed: mapState({
    // 箭头函数可使代码更简练
    schemaLists: state => state.SchemaList.schemaLists
  }),
  mounted () {
    ipcRenderer.on('serverStarted', (event, data) => {
      this.changeServerStatus()
      this.$notify.success({message: '服务器已开启', duration: 1200})
    })
    ipcRenderer.on('serverStoped', (event, data) => {
      this.changeServerStatus()
      this.$notify.success({message: '服务器已关闭', duration: 1200})
    })
    ipcRenderer.on('serverRestarted', (event, data) => {
      this.$notify.success({message: '服务器已自动重启', duration: 1200})
    })
    ipcRenderer.on('hasSamePath', (event, data) => {
      this.changeServerStatus()
      this.$notify.error({message: '检测到相同的路径同时启动,请检查配置', duration: 2000})
    })
    ipcRenderer.on('updateStatus', (event, message) => {
      this.$notify.success({message: message, duration: 2000})
    })
  }
}
</script>

<style lang="less" scoped>
.container{
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

