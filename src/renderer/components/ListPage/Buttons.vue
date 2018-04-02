<template>
  <div class="buttons">
    <p class="addJSON" @click="addJSON">添加JSON</p>
    <p class="create" @click="addSchema">添加规则</p>
    <p class="start" @click="toggleServer">{{this.serverStatusDesc}}</p>
  </div>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex'
import { ipcRenderer } from 'electron'
export default {
  name: 'buttons',
  methods: {
    ...mapMutations({
      changeServerStatus: 'CHANGE_SERVER_STATUS'
    }),
    ...mapActions({
      addList: 'addList'// 添加到数据库
    }),
    addSchema () {
      ipcRenderer.send('openAddWindow', {path: 'add-schema'})
    },
    addJSON () {
      ipcRenderer.send('openAddWindow', {path: 'add-json'})
    },
    toggleServer () {
      if (this.isServerStarted === false) {
        const selectSchemaLists = this.schemaLists.filter(s => s.isSelect === true)
        if (this.schemaLists.length === 0) {
          this.$notify.error({message: '没有规则,请添加规则', duration: 1200})
        } else if (selectSchemaLists.length === 0) {
          this.$notify.error({message: '请选择规则', duration: 1200})
        } else if (this.hasSamePath(selectSchemaLists)) {
          this.$notify.error({message: '同一个路径只能选择一个规则开启', duration: 1200})
        } else {
          ipcRenderer.send('startServer')
        }
      } else {
        ipcRenderer.send('stopServer')
      }
    },
    hasSamePath (selectSchemaLists) { // whether selectSchemaLists has same path
      const len = selectSchemaLists.length
      const dict = {}
      for (let i = 0; i < len; i++) {
        if (dict.hasOwnProperty(selectSchemaLists[i].path)) {
          return true
        } else {
          dict[selectSchemaLists[i].path] = true
        }
      }
      return false
    }
  },
  computed: {
    serverStatusDesc () { // 开启服务器按钮描述
      if (this.isServerStarted === true) {
        return '关闭服务器'
      } else {
        return '开启服务器'
      }
    },
    ...mapState({
    // 箭头函数可使代码更简练
      schemaLists: state => state.SchemaList.schemaLists,
      isServerStarted: state => state.SchemaList.isServerStarted
    })
  }
}
</script>

<style lang="less" scoped>
.buttons{
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
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
