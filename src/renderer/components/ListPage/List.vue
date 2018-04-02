<template>
  <div class="rule-list">
    <div class="header">
      <p class="select">启用</p>
      <p class="desc">描述</p>
      <p class="path">路径</p>
      <p class="action">操作</p>
    </div>
    <div class="lists">
      <SingleRule v-for="list in schemaLists" :list="list" :key="list.index"/>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SingleRule from './SingleRule'
export default {
  name: 'rule-list',
  components: {
    SingleRule
  },
  computed: mapState({
    // 箭头函数可使代码更简练
    schemaLists: state => state.SchemaList.schemaLists

  })
}
</script>

<style lang="less" scoped>
.rule-list{
  display: flex;
  flex-direction: column;
  flex: 9;
  overflow: auto;
  .header{
    display: flex;
    height: 32px;
    background-color: #ccc;
    align-items: center;
    p{
      color:#909399;
    }
    .select{
      width: 60px;
      text-align: center;
    }
    .desc,.path{
      flex-grow: 1;
    }
    .action{
      width: 150px;
      text-align: center;
    }
  }
}
</style>
