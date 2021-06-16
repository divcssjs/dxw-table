<template>
  <el-table
    :data="tableData"
    ref="tableRef"
    :style="elConfig.style"
    :max-height="elConfig.maxHeight"
    :border="elConfig.border"
    :stripe="elConfig.stripe"
    class="myTable"
  >
    <Column :list="newHeadData" />
    <el-table-column
      :label="cellBox.label"
      :fixed="cellBox.fixed"
      :min-width="cellBox.width"
      :align="cellBox.align"
      v-if="cellBox.show"
    >
      <template slot-scope="scope">
        <el-button
          v-for="(item, ind) in cellBox.children"
          :size="item.size"
          :type="item.type"
          :key="ind"
          @click="
            $emit('onEvent', {
              scope,
              row: scope.row,
              evName: item.evName
            })
          "
          >{{ item.label }}</el-button
        >
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import Column from './column.vue'
export default {
  name: 'DTable',
  components: { Column },
  props: {
    dConfig: {
      type: Object,
      default: () => {
        return {
          saveDATA: [], // 请求回来的数据
          headData: [],
          start: 0,
          end: 30, // 3倍的pageList
          starts: 0, // 备份[保持与上一样]
          ends: 30, // 备份[保持与上一样]
          pageList: 10, // 一屏显示
          itemHeight: 53, // 每一行高度
          timeOut: 400 // 延迟
        }
      }
    },
    elConfig: {
      type: Object,
      default: () => {
        return {}
      }
    },
    cellBox: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      tableData: [],
      tableRef: null,
      tableWarp: null,
      fixLeft: null,
      fixRight: null,
      tableFixedLeft: null,
      tableFixedRight: null,
      scrollTop: 0,
      num: 0,
      newHeadData: []
    }
  },
  created() {
    this.newHeadData = this.deleteObjVal(this.dConfig.headData)
    this.init()
  },
  mounted() {
    this.$nextTick(() => {
      this.tableRef = this.$refs.tableRef.bodyWrapper
      this.tableFixedLeft = document.querySelector(
        '.el-table .el-table__fixed .el-table__fixed-body-wrapper'
      )
      this.tableFixedRight = document.querySelector(
        '.el-table .el-table__fixed-right .el-table__fixed-body-wrapper'
      )
      /**
       * fixed-left | 主体 | fixed-right
       */
      // 主体改造
      let divWarpPar = document.createElement('div')
      divWarpPar.style.height =
        this.dConfig.saveDATA.length * this.dConfig.itemHeight + 'px'
      let divWarpChild = document.createElement('div')
      divWarpChild.className = 'fix-warp'
      divWarpChild.append(this.tableRef.children[0])
      divWarpPar.append(divWarpChild)
      this.tableRef.append(divWarpPar)

      // left改造
      let divLeftPar = document.createElement('div')
      divLeftPar.style.height =
        this.dConfig.saveDATA.length * this.dConfig.itemHeight + 'px'
      let divLeftChild = document.createElement('div')
      divLeftChild.className = 'fix-left'
      this.tableFixedLeft &&
        divLeftChild.append(this.tableFixedLeft.children[0])
      divLeftPar.append(divLeftChild)
      this.tableFixedLeft && this.tableFixedLeft.append(divLeftPar)

      // right改造
      let divRightPar = document.createElement('div')
      divRightPar.style.height =
        this.dConfig.saveDATA.length * this.dConfig.itemHeight + 'px'
      let divRightChild = document.createElement('div')
      divRightChild.className = 'fix-right'
      this.tableFixedRight &&
        divRightChild.append(this.tableFixedRight.children[0])
      divRightPar.append(divRightChild)
      this.tableFixedRight && this.tableFixedRight.append(divRightPar)

      // 被设置的transform元素
      this.tableWarp = document.querySelector(
        '.el-table .el-table__body-wrapper .fix-warp'
      )
      this.fixLeft = document.querySelector(
        '.el-table .el-table__fixed .el-table__fixed-body-wrapper .fix-left'
      )
      this.fixRight = document.querySelector(
        '.el-table .el-table__fixed-right .el-table__fixed-body-wrapper .fix-right'
      )

      this.tableRef.addEventListener('scroll', this.onScroll)
    })
  },
  methods: {
    deleteObjVal(obj) {
      obj.forEach((k) => {
        if (k.children && k.children.length == 0) {
          k.children = null
        } else if (k.children && k.children.length) {
          k.children.unshift(k.children[k.children.length - 1])
          k.children.pop()
          this.deleteObjVal(k.children)
        }
      })
      return obj
    },
    init() {
      this.tableData = this.dConfig.saveDATA.slice(
        this.dConfig.start,
        this.dConfig.end
      )
    },
    onScroll() {
      this.scrollTop = this.tableRef.scrollTop
      this.num = Math.floor(
        this.scrollTop / (this.dConfig.itemHeight * this.dConfig.pageList)
      )
    }
  },
  watch: {
    num: function (newV) {
      if (newV > 1) {
        this.dConfig.start = (newV - 1) * this.dConfig.pageList
        this.dConfig.end = (newV + 2) * this.dConfig.pageList
        setTimeout(() => {
          this.tableData = this.dConfig.saveDATA.slice(
            this.dConfig.start,
            this.dConfig.end
          )
          this.tableWarp.style.transform = `translateY(${
            this.dConfig.start * this.dConfig.itemHeight
          }px)`
          if (this.fixLeft) {
            this.fixLeft.style.transform = `translateY(${
              this.dConfig.start * this.dConfig.itemHeight
            }px)`
          }
          if (this.fixRight) {
            this.fixRight.style.transform = `translateY(${
              this.dConfig.start * this.dConfig.itemHeight
            }px)`
          }
        }, this.dConfig.timeOut)
      } else {
        setTimeout(() => {
          this.tableData = this.dConfig.saveDATA.slice(
            this.dConfig.starts,
            this.dConfig.ends
          )
          this.tableWarp.style.transform = `translateY(0px)`
          if (this.fixLeft) {
            this.fixLeft.style.transform = `translateY(0px)`
          }
          if (this.fixRight) {
            this.fixRight.style.transform = `translateY(0px)`
          }
        }, this.dConfig.timeOut)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.myTable {
  /deep/ td {
    // padding: 6px 0 !important;
    div {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

/*滚动条样式*/

// /deep/ .el-table__body-wrapper::-webkit-scrollbar {
//   /*滚动条整体样式*/
//   width: 6px;
//   /*高宽分别对应横竖滚动条的尺寸*/
//   height: 8px;
// }

// /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
//   /*滚动条里面小方块*/
//   border-radius: 2px;
//   background: #666;
// }

// /deep/ .el-table__body-wrapper::-webkit-scrollbar-track {
//   /*滚动条里面轨道*/
//   background: #ccc;
// }
</style>
