<template>
  <div class="drag">
    <div ref="element" class="content" v-drag>
      <p>文字网页</p>
    </div>
    <!-- <div style="height:2000px;width:100%"></div> -->
    <div class="wqewe" v-drag>21321wqewqdsadsa3213</div>
  </div>
</template>
<script >
export default {
  data() {
    return {
      dd: "",
      inout: ""
    };
  },
  created() {
    console.log(this.suiji());
    console.log(this.sum(8563));
  },
  directives: {
    drag(el) {
      // console.log(el)
      //禁止选择网页上的文字
      document.onselectstart = function() {
        return false;
      };
      el.onmousedown = function(e) {
        // console.log(e)
        //鼠标按下，计算当前元素距离可视区的距离
        let disX = e.clientX - el.offsetLeft;
        let disY = e.clientY - el.offsetTop;
        document.onmousemove = function(e) {
          //通过事件委托，计算移动的距离
          let l = e.clientX - disX;
          let t = e.clientY - disY;
          //移动当前元素
          el.style.left = l + "px";
          el.style.top = t + "px";
        };
        document.onmouseup = function(e) {
          document.onmousemove = null;
          document.onmouseup = null;
        };
        //return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
        return false;
      };
    }
  },
  methods: {
    suiji() {
      let qq = [];
      var check = (num, arr) => {
        if (arr.indexOf(num) == -1) {
          arr.push(num);
          return;
        }
        num = Math.random().toFixed(1) * 10;
        check(num, arr);
      };
      for (let i = 0, j = 11; i < j; i++) {
        let ww = Math.random().toFixed(1) * 10;
        check(ww, qq);
      }
      for (let i = 0, len = qq.length; i < len; i++) {
        if (qq[i] == 0) {
          qq.splice(i, 1);
          break;
        }
      }
      // qq.sort(function(a,b){return a-b})
      return qq;
    },
    sum(num) {
      if (num <= 1) {
        return 1;
      } else {
        return num + this.sum(num - 1);
      }
    }
  }
};
</script>
<style>
.drag {
  position: relative;
}
/* position:absolute;这个还是要设的，不然拖动块定不了位置 */
.content {
  position: absolute;
  height: 100px;
  width: 100px;
  background-color: #67c23a;
  cursor: pointer;
}
.wqewe {
  position: absolute;
}
</style>