<template>
  <div>
    <el-table-column
      v-for="(item, ind) in list"
      :key="ind"
      :prop="item.prop"
      :label="item.label"
      :min-width="item.minWidth"
      :align="item.align"
      :fixed="item.fixed"
    >
      <column
        v-if="item.children && item.children.length"
        :list="item.children"
      ></column>
    </el-table-column>
  </div>
</template>

<script>
export default {
  name: 'column',
  props: {
    list: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>
