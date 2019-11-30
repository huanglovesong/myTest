<template>
  <div class="hot">
    <div class="hd"></div>
    <div class="hot-bg">
      <ul>
        <li v-for="(item, index) in hotCharge" :key="item.id" @click="goCenter(item.childCategoryId)">
          <span v-if="index>2" class="tag">{{index + 1}}</span>
          {{item.childCategoryName}}
          <span class="dis" v-if="item.cornerMark">{{item.cornerMark}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hotCharge: []
    };
  },
  mounted() {
    this.hotCategories();
  },
  methods: {
    hotCategories() {
      this.$http
        .get("/Category/GetChildCategory", {
          params: {
            categoryId: this.hotId
          },
          headers: this.headers
        })
        .then(res => {
         // console.log(res.data.data.list,"热门充值");
          this.hotCharge = res.data.data.list;
        });
    },
    goCenter(val){
        this.$store.commit('changeChildCategoryId', val)
        this.$router.push({
          name: "center",
          params: {
          ccid: val
          }
        })
        .catch(err => {err});
        this.$emit('updatedata',val)
    },
  }
};
</script>