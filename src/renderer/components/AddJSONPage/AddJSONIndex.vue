<template>
  <div class="addJson">
    <FileArea :fileBoxDesc="fileBoxDesc" @getFilePath="getFilePath"/>
    <ServerPath :path="path" :desc="desc" @pathChange="pathChange" @descChange="descChange"/>
    <Buttons @confirmAddJSON="confirmAddJSON"/>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import FileArea from './FileArea.vue'
import ServerPath from '../AddSchemaPage/Path.vue'
import Buttons from './Buttons'
export default {
  name: 'add-json',
  components: {
    FileArea,
    Buttons,
    ServerPath
  },
  data () {
    return {
      id: '',
      path: '',
      desc: '',
      filePath: ''
    }
  },
  methods: {
    ...mapActions({
      addList: 'addList', // 添加到数据库并更新state
      updateList: 'updateList'// 更新数据库并更新state
    }),
    pathChange (v) {
      this.path = v
    },
    descChange (v) {
      this.desc = v
    },
    getFilePath (filePath) {
      this.filePath = filePath
      console.log(filePath)
    },
    confirmAddJSON () {
      if (this.filePath === '') {
        this.$notify.error({message: '请选择JSON文件', duration: 1200})
        return
      }
      if (this.path === '') {
        this.$notify.error({message: '请输入接口路径', duration: 1200})
        return
      }
      if (this.desc === '') {
        this.$notify.error({message: '请输入接口描述', duration: 1200})
        return
      }
      if (this.path[0] !== '/') {
        this.path = '/' + this.path
      }
      const list = {
        path: this.path,
        desc: this.desc,
        type: 'json',
        filePath: this.filePath,
        isSelect: true
      }
      if (this.id === '') {
        this.addList(list)
      } else {
        const id = this.id
        this.updateList({id, list})
      }
    }
  },
  computed: mapState({
    schemaLists: state => state.SchemaList.schemaLists,
    fileBoxDesc () {
      return this.filePath === '' ? '将.json文件拖入或者点击选择' : `已选择文件:${this.filePath}`
    }
  }),
  mounted () {
    this.id = this.$route.query.hasOwnProperty('id') ? this.$route.query.id : ''
    if (this.id !== '') {
      const currentData = this.schemaLists.filter(s => s._id === this.id)[0]
      this.filePath = currentData.filePath
      this.path = currentData.path
      this.desc = currentData.desc
    }
  }
}
</script>

<style lang="less" scoped>
.addJson{
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>

