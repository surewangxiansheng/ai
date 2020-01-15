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
        data(){
            return {
                dd:"",
                inout:""
            }
        },
        directives: {
            drag(el){
              console.log(el)
                //禁止选择网页上的文字
                document.onselectstart = function() {
                    return false;
                };
                el.onmousedown = function(e){
                  console.log(e)
                    //鼠标按下，计算当前元素距离可视区的距离
                    let disX = e.clientX - el.offsetLeft;
                    let disY = e.clientY - el.offsetTop;
                    document.onmousemove = function(e){
                        //通过事件委托，计算移动的距离
                        let l = e.clientX - disX;
                        let t = e.clientY - disY;
                        //移动当前元素
                        el.style.left = l + "px";
                        el.style.top = t + "px";
                    }
                    document.onmouseup = function(e){
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                    //return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
                    return false;
                };
            }
        }
   }
</script>
<style>
.drag{
    position: relative;
}
/* position:absolute;这个还是要设的，不然拖动块定不了位置 */
.content{
    position:absolute;
    height:100px;
    width:100px;
    background-color: #67C23A;
    cursor: pointer;
}
.wqewe {
  position: absolute
}
</style>