<template>
  <div class="single-rule">
    <div class="select">
      <input v-model="isSelect" type="checkbox">
    </div>
    <p class="desc">{{list.desc}}</p>
    <p class="path">{{list.path}}</p>
    <p class="action">
      <span class="delete" @click="removeList">删除</span>
      <span class="edit" @click="editSchema">编辑</span>
      <!-- schema 类型才能导出 -->
      <span v-if="list.type === 'schema'" class="export" @click="exportConfig">导出配置</span> 
      <span class="visit" :class="{notVisitable:!isVisitable}" @click="visit">访问</span>
    </p>
  </div>
</template>

<script>
import {ipcRenderer, shell, remote} from 'electron'
import fs from 'fs'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'single-rule',
  props: ['list'],
  methods: {
    ...mapActions({
      deleteList: 'deleteList', // 加载数据库中的数据
      toggleSelect: 'toggleSelect'// 选择开关
    }),
    removeList () {
      this.deleteList(this.list._id)
    },
    editSchema () {
      // pass _id to new page, two types of page based on list.type
      const path = this.list.type === 'json' ? `add-json?id=${this.list._id}` : `add-schema?id=${this.list._id}`
      ipcRenderer.send('openAddWindow', {path: path})
    },
    exportConfig () {
      const options = {
        defaultPath: `~/${this.list.desc}配置.json`
      }
      remote.dialog.showSaveDialog(remote.getCurrentWindow(), options, (filename) => {
        if (filename === undefined) {
          return
        }
        fs.writeFile(filename, JSON.stringify({...this.list, 'iammvp': true}), (err) => {
          if (err) {
            this.$notify.error(err)
          } else {
            this.$notify.success({message: '配置导出成功', duration: 1200})
          }
        })
      })
    },
    visit () {
      if (this.isVisitable) {
        shell.openExternal(`http://localhost:9999${this.list.path}`)
      }
    }
  },
  computed: {
    ...mapState({
      isServerStarted: state => state.SchemaList.isServerStarted,
      startedLists: state => state.SchemaList.startedLists,
      isVisitable () {
        return this.startedLists.find(s => s._id === this.list._id) !== undefined
      }
    }),
    isSelect: {
      get () {
        return this.list.isSelect
      },
      set (value) {
        this.toggleSelect(this.list)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.single-rule{
  font-size: 13px;
  display: flex;
  height: 32px;
  align-items: center;
  .select{
    width: 60px;
    display: flex;
    justify-content: center;
  }
  .desc,.path{
    flex: 1;
  }
  .action{
    width: 150px;
    display: flex;
    justify-content: space-around;
    span{
      color: #409eff;
      cursor: pointer;
      &:hover{
        color: #66b1ff;
      }
      &.notVisitable{
        color: #000;
      }
    }
  }
  &:nth-child(odd){
    background: #eee;
  }
}
</style>

