<template>
  <div class="file-area">
    <div class="drop-container" :class="{'file-over':isOver}" 
    @dragover.stop.prevent="dragOver" 
    @dragenter="dragEnter" 
    @dragleave="dragLeave" 
    @drop.stop.prevent="dropFile($event)"
    @click="selectFile"
    >
      <p class="desc">{{fileBoxDesc}}</p>
    </div>
  </div>
</template>

<script>
import {remote} from 'electron'
export default {
  name: 'file',
  props: ['getFilePath', 'fileBoxDesc'],
  data () {
    return {
      isOver: false // is draged file over container
    }
  },
  methods: {
    dragOver () {
      return false
    },
    dragEnter () {
      this.isOver = true
    },
    dragLeave () {
      this.isOver = false
    },
    dropFile (e) {
      this.isOver = false
      const {path, type} = e.dataTransfer.files[0]
      if (type !== 'application/json') {
        this.$notify.error({message: '所选文件非json文件', duration: 1200})
      } else {
        this.$emit('getFilePath', path)
      }
    },
    selectFile () {
      const options = {
        filters: [
          { name: 'JSON', extensions: ['json'] }
        ]
      }
      remote.dialog.showOpenDialog(remote.getCurrentWindow(), options, (filepath) => {
        if (filepath) {
          const path = filepath[0]
          this.$emit('getFilePath', path)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.file-area{
  flex: 9;
  padding: 40px;
  .drop-container{
    width: 100%;
    height: 100%;
    border-radius: 25px;
    border: 10px dotted #ccc;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    &.file-over{
      opacity: 0.5;
    }
    .desc{
      font-size: 26px;
      color: #ccc;
    }
  }
}
</style>

