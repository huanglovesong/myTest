<template>
  <div class="page-section">
    <div class="server">
      <div class="paging" v-if="categoryArr.length!=''">
        <span @click="getChildCategory">全部</span>
        <span v-for="chars in nameCharArr" :key="chars.id" @click="filterNames(chars)">{{chars.letter}}</span>
      </div>
      <div class="paging" v-else>
        <span @click="getChildCategory">全部</span>
        <span>A</span><span>B</span><span>C</span><span>D</span><span>E</span><span>F</span><span>G</span><span>H</span><span>I</span><span>J</span><span>K</span><span>L</span><span>M</span><span>N</span><span>O</span><span>P</span><span>Q</span><span>R</span><span>S</span><span>T</span><span>W</span><span>X</span><span>Y</span><span>Z</span>
      </div>
      <div class="fw-main">
        <div class="server-list">
          <ul>
            <li v-for="item in filterResult" :key="item.id" @click="goCenter(item.childCategoryId)">
              <img :src="item.iconPath" />
              <span>{{item.childCategoryName}}</span>
              <span class="discount">{{item.cornerMark}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <hot></hot>
  </div>
</template>
<script>
import hot from "@/components/common/hot";
export default {
  components: {
    hot
  },
  data() {
    return {
      cid: this.$route.params.id,
      categoryArr: [],
      nameCharArr:[],
      filterResult:[]
    };
  },
  mounted() {
    this.getChildCategory();
  },
  methods: {
    goCenter(idx) {
      this.$store.commit("changeChildCategoryId", idx);
      this.$router.push({
        name: "center",
        params: {
          ccid: idx
        }
      });
    },
    getChildCategory() {
      this.$http
        .get("/Category/GetChildCategory", {
          params: {
            categoryId: this.cid,
            pageIndex: 1,
            pageSize: 10
          },
          headers: this.headers
        })
        .then(res => {
         // console.log(res.data.data.list,'二级分类')
          this.categoryArr = res.data.data.list;
          this.filterResult = this.categoryArr
          this.nameCharArr = this.pySort(this.categoryArr)
          // console.log(this.nameCharArr)
        });
    },
    // 字母排序
    pySort(arr, empty) {
      var $this = this;
      if (!String.prototype.localeCompare) return null;
      var letters = "ABCDEFGHJKLMNOPQRSTWXYZ".split("");
      var zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split("");
      var arrList = [];
      for (var m = 0; m < arr.length; m++) {
        arrList.push(arr[m].childCategoryName);
      }
      var result = [];
      var curr;
      for (var i = 0; i < letters.length; i++) {
        curr = { letter: letters[i], data: [] };
        if (i != 26) {
          for (var j = 0; j < arrList.length; j++) {
            var initial = arrList[j].charAt(0); //截取第一个字符
            if (
              arrList[j].charAt(0) == letters[i] ||
              arrList[j].charAt(0) == letters[i].toLowerCase()
            ) {
              //首字符是英文的
              curr.data.push(arrList[j]);
            } else if (zh[i] != "*" && $this.isChinese(initial)) {
              //判断是否是无汉字,是否是中文
              if (
                initial.localeCompare(zh[i]) >= 0 &&
                (!zh[i + 1] || initial.localeCompare(zh[i + 1]) < 0)
              ) {
                //判断中文字符在哪一个类别
                curr.data.push(arrList[j]);
              }
            }
          }
        } else {
          for (var k = 0; k < arrList.length; k++) {
            var ini = arrList[k].charAt(0); //截取第一个字符
            if (!$this.isChar(ini) && !$this.isChinese(ini)) {
              curr.data.push(arrList[k]);
            }
          }
        }
        if (empty || curr.data.length) {
          result.push(curr);
          //curr.data.sort(function(a,b){
          //    return b.localeCompare(a);       //排序,英文排序,汉字排在英文后面
          //});
        }
      }
      return result;
    },
    isChinese(temp) {
      var re = /[^\u4E00-\u9FA5]/;
      if (re.test(temp)) {
        return false;
      }
      return true;
    },
    isChar(char) {
      var reg = /[A-Za-z]/;
      if (!reg.test(char)) {
        return false;
      }
      return true;
    },
    filterNames(arr1){
      let newArr = [];
      for (let i = 0; i <  this.categoryArr.length; i++) {
          for (let j = 0; j <  arr1.data.length; j++) {
              if(arr1.data[j] ===  this.categoryArr[i].childCategoryName){
                  newArr.push( this.categoryArr[i]);
              }
          }
      }
      this.filterResult = newArr
    } 
  }
}
</script>
<style scoped>
.paging {
  height: 35px;
  line-height: 35px;
  text-align: center;
  background: linear-gradient(
    -90deg,
    rgba(6, 8, 8, 0.447),
    rgba(45, 71, 83, 0.584) 50%,
    rgba(6, 8, 8, 0.447)
  );
  background: -webkit-linear-gradient(
    left,
    rgba(6, 8, 8, 0.447),
    rgba(45, 71, 83, 0.584) 50%,
    rgba(6, 8, 8, 0.447)
  );
  margin: 0 auto 10px;
  font-size: 14px;
  color: #909699;
}
.paging span {
  margin: 0 5px;
  cursor: pointer
}
.fw-main {
  flex: 1;
  font-size: 14px;
  color: #909699;
  height: 600px;
  overflow-y: auto;
}
.server {
  flex: 1;
}
.server-list ul {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  margin-left: 20px;
}
.server-list li {
  width: 170px;
  margin: 15px 0;
  position: relative;
  cursor: pointer;
}
.server-list li span {
  display: block;
}
.server-list li .discount {
  position: absolute;
  top: -5px;
  left: 90px;
  background: #ffa800;
  border-radius: 3px;
  color: #fff;
  font-size: 12px;
  padding: 0 5px;
  line-height: 1.5;
  width: 40px;
}
.server-list li img {
  width: 60px;
  height: 60px;
  border-radius: 7px;
}
</style>