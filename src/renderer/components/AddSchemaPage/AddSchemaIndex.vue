<template>
  <div class="container">
    <Schema :schema="schema"/>
    <ServerPath :path="path" :desc="desc" @pathChange="pathChange" @descChange="descChange"/>
    <Buttons @confirm="confirm" @importConfig="importConfig"/>
  </div>
</template>

<script>
import { remote } from 'electron'
import fs from 'fs'
import { mapActions, mapState } from 'vuex'
import Schema from './Schema.vue'
import Buttons from './Buttons.vue'
import ServerPath from './Path.vue'
import defaultSchema from './config/defaultSchema'
export default {
  components: {
    Schema,
    Buttons,
    ServerPath
  },
  data () {
    return {
      id: '',
      schema: defaultSchema,
      path: '',
      desc: ''
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
    confirm () {
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
        type: 'schema',
        schema: this.schema,
        isSelect: true
      }
      if (this.id === '') {
        this.addList(list)
      } else {
        const id = this.id
        this.updateList({id, list})
      }
    },
    importConfig () {
      const options = {
        filters: [
          { name: 'JSON', extensions: ['json'] }
        ]
      }
      remote.dialog.showOpenDialog(remote.getCurrentWindow(), options, (filepath) => {
        fs.readFile(filepath[0], 'utf8', (err, value) => {
          if (err) {
            this.$notify.error({message: err, duration: 1200})
          } else {
            const config = JSON.parse(value)
            if (config.hasOwnProperty('iammvp') === false || config['iammvp'] !== true) {
              this.$notify.error({message: '配置文件不对', duration: 1200})
            } else {
              this.desc = config.desc
              this.isSelect = config.isSelect
              this.path = config.path
              this.schema = config.schema
            }
          }
        })
      })
    }
  },
  computed: mapState({
    schemaLists: state => state.SchemaList.schemaLists
  }),
  mounted () {
    this.id = this.$route.query.hasOwnProperty('id') ? this.$route.query.id : ''
    if (this.id !== '') {
      const currentData = this.schemaLists.filter(s => s._id === this.id)[0]
      this.schema = currentData.schema
      this.path = currentData.path
      this.desc = currentData.desc
    }
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
