<template>
  <div>
    <header class="head">
      <div class="left-buttons">
        <i class="icon-back"></i>
      </div>
      <h1 class="head-title">智能客服</h1>
    </header>
      <section ref="addContent" class="content has-foot" :class="question.list.length>0?'':'has—no-words'" >
      <el-scrollbar style="height:100%" ref="myScrollbar">
      <div class="scroll">
        <p v-if="hasMore" @click.once="moreNew" class="has-more-text">点击可以查看历史消息哦</p>
        <div class="list-container">
          <ul class="list">
            <li v-for="(item,index) in list" :key="index">
              <div v-if="item.received" class="message-received">
                <p v-if="item.title" class="received-title">{{item.title}}</p>
                <p class="received-content">
                  <span class="content-bold" v-for="(say,index) in item.content" :key="index">{{say}}</span>
                </p>
                <button v-if="item.linkText" class="button-link"> <a class="title_btn" :href="href">{{item.linkText}}</a></button>
                <ul v-if="item.guessList.list" class="guess-list">
                  <li class="guess-title">{{item.guessList.title}}</li>
                  <li v-for="(guess,index) in item.guessList.list" :key="index" @click="send(guess)">
                    <a href="#">-&nbsp;{{guess}}</a>
                  </li>
                </ul>
                <!-- silver -->
                <dl class="feedback" v-if="item.feedback">
                  <dt>问题</dt>
                  <dd class="useful" :style="{ color: item.style }" @click.once="setUseful(item, true)">
                    已解决</dd>
                  <dd class="useless" :style="{ color: item.style2 }" @click.once="setUseful(item, false)">
                    未解决</dd>
                </dl>
                <div v-if="item.tel" class="tel-container">
                  <a href="tel:123456" class="button-tel">联系人工客服</a>
                </div>             
              </div>
              <div v-if="item.sent" class="message-sent">
                <p class="send-content">{{item.content}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </el-scrollbar>

    </section>
    <footer class="foot" id="footer" :class="question.list.length>0?'':'has—no-words'">
      <ul class="question-list" v-if="question.list.length>0">
        <li v-for="(item,index) in question.list" :key="index" @click="inputLine(item.hotwords)">{{item.hotwords}}</li>
      </ul>
      <form name="questionform">
        <div class="question flex">
          <input type="text" v-model="formData.word" class="flex-1" placeholder="请输入您要咨询的问题" @input="check" />
          <!-- <button class="button-add">+</button> -->
          <button type="button" class="button-send" :class="formData.word ? 'button-send-show' : ''"
            @click="send">发送</button>
        </div>
      </form>
    </footer>
  </div> 
</template>

<script>
  import { promised, Promise } from 'q';
  import { 
    getHotword,
    postWord
    }
  from '@/api/api.js';
  var db;
  export default {
    name: "aiservice",
    data() {
      return {
        toAlter:'checked',
        formData: {
          word: ""
        },
        scrollData: {
          node: null,
          scrollNode: null,
          position: {
            start: 0,
            diff: 0,
            oldDiff: 0,
            moveIndex: 0,
            roll: 10,
            spead: []
          }
        },
        list: [
          {
            received: true,
            content:
              ["Hi~您好，我是聪明的机器人，为您提供自助服务，请问有什么想对我说的吗？"],
            guessList: {
              title: '',
              list: []
            },
            feedback: false,
            useful: true,
            tel: false,
            style:'',
            style2:'',
            disabled: false
          }
        ],
        linkText: '',
        hasMore: true,
        hasFeedback: false,
        question: {
          list: []
        },
        database: {
          name: 'aiservice',
          store: 'message',
          version: 1
        },
        requestId: '',
        historymsg: true,
        secret:'',
        uid:'',
        sec:''
      };
    },
    mounted() {
      //动态获取，改变内容框bottom
      var scrolldom = this.$refs.addContent;
      setTimeout(function(){
        let contentHight = document.querySelector('.foot').clientHeight;
        scrolldom.style.bottom = contentHight/16+2 + "rem";
        }
        ,1000)
    },
    created() {
      this.getHotwordMethod();
      this.isIndexedDB()
    },
    methods: {
     getHotwordMethod(parma) {
        var that = this;
       getHotword(
          parma
          ).then((response) => {
            that.question.list = response.data.words||[];
            console.log(response)
          }).catch((err) => {
            var pushitem = {
                received: true,
                feedback: false,
                useful: false,
                tel: false,
                content: err.response.data?err.response.data.split('\n'):err.message.split('\n'),
                guessList: {
                list: []
              }
            }
            that.list.push(pushitem);
            that.save(that.list);
               })
      },
     postWordMethod(parma) {
        var that = this;
       postWord(
          parma
          ).then((res) => {
            res.data.jumps?that.href = res.data.jumps[0].uri:'';
            var say = res.data.say.replace(/\&nbsp/g, "");
            that.requestId = res.headers['x-request-id'];
            var pushitem = {
              received: true,
              feedback: true,
              useful: true,
              tel: true,
              linkText: res.data.jumps?res.data.jumps[0].title||'':res.data.jumps,
              content: say.split('\n'),
              guessList: {}
            }
            console.log(pushitem)
            res.data.guides ? pushitem.guessList = {
              title: '猜您想问：',
              list: res.data.guides
            } : '';
            that.list.push(pushitem);
            that.save(that.list);
          }).catch((err) => {
            var pushitem = {
                received: true,
                feedback: false,
                useful: false,
                tel: false,
                content: err.response.data?err.response.data.split('\n'):err.message.split('\n'),
                guessList: {
                list: []
              }
            }
            self.list.push(pushitem);
            self.save(self.list);
               })
      }, 
      isIndexedDB() {
        var self = this;
        this.openDatabase().then(function (db) {
          var request = db.transaction([self.database.store]).objectStore(self.database.store).get(self.uid);
          request.onsuccess = function (e) {
          request.result?self.hasMore = true:self.hasMore = false;
          }
        }, function (err) {
          console.log('open database error', err);
        });
      },
      moreNew() {
        if (!this.hasMore) return;
        this.historymsg = false;
        var self = this;
        this.openDatabase().then(function (db) {
          var request = db.transaction([self.database.store]).objectStore(self.database.store).get(self.uid);
          request.onsuccess = function (e) {
            if (request.result) {
              let historymsgList = request.result.message.reverse();
              for(var i=0,len=historymsgList.length;i<len;i++){
                self.list.unshift(historymsgList[i])
              }      
            }
          };
          request.onerror = function (err) {
            console.log(err);
          };
        }, function (err) {
          console.log('open database error', err);
        });
      },
      scrollTouch(e) {
        var self = this;
        var scroll = {
          start: function (e) {
            self.scrollData.position.start = (
              e.targetTouches[0] ||
              e.touches[0] ||
              e.changedTouches[0]
            ).screenY;
            self.scrollData.node = e.currentTarget;
            self.scrollData.scrollNode = e.currentTarget.firstElementChild;
            self.scrollData.position.diff = this.getTranslateY(
              self.scrollData.scrollNode
            );
            self.scrollData.position.spead.length = 0;
            self.scrollData.position.oldDiff = 0;
          },
          move: function (e) {
            var y = (e.targetTouches[0] || e.touches[0] || e.changedTouches[0])
              .screenY;
            var position = self.scrollData.position;
            var diffy = y - position.start + position.diff;
            position.moveIndex =
              position.moveIndex >= position.spead.length
                ? 0
                : position.moveIndex;
            position.spead[position.moveIndex] = diffy - position.oldDiff;
            position.oldDiff = diffy;
            position.moveIndex++;
            self.scrollData.scrollNode.style["-webkit-transform"] =
              "translate3d(0," + diffy + "px, 0)";
            self.scrollData.scrollNode.style.transform =
              "translate3d(0," + diffy + "px,0)";
          },
          end: function (e) {
            var scrollNode = self.scrollData.scrollNode;
            var position = self.scrollData.position;
            var y = (e.targetTouches[0] || e.touches[0] || e.changedTouches[0])
              .screenY;
            var diffy = y - position.start + position.diff;
            var spead = 0;
            var height = scrollNode.offsetHeight;
            var clientHeight = self.scrollData.node.offsetHeight;
            position.spead.forEach(function (item) {
              spead += spead * item < 0 ? 0 : item;
            });
            diffy += spead * position.roll;
            if (diffy > 0) {
              self.$emit('overflow', {
                direction: 'up',
                diffy: diffy
              });
              if (diffy > 20) self.loadMore();
              diffy = 0;
            }
            if (height < clientHeight) height = clientHeight;
            if (diffy + height - clientHeight < 0) {
              self.$emit('overflow', {
                direction: 'down',
                diffy: diffy
              });
              diffy = -height + clientHeight
            }
            scrollNode.classList.add("scroll-transition");
            scrollNode.style["-webkit-transform"] =
              "translate3d(0," + diffy + "px, 0)";
            scrollNode.style.transform = "translate3d(0," + diffy + "px,0)";
            setTimeout(function () {
              scrollNode.classList.remove("scroll-transition");
            }, 3000);
          },
          getTranslateY: function (node) {
            var style = window.getComputedStyle(node);
            var transform = style.transform || style["-webkit-transform"];
            var y = transform.replace(/\w+\(([,\ \-\d\.]+)\)/i, "$1");
            y = y.replace(/\s/g, "").split(",")[5] || 0;
            return y - 0;
          }
        };
        switch (e.type) {
          case "touchstart":
            scroll.start(e);
            break;
          case "touchmove":
            scroll.move(e);
            break;
          case "touchend":
            scroll.end(e);
            break;
        }
      },
      check() {
        if (!this.formData.word) return;
      },
      send(text) {
        // isdo = true;
        if (!text || typeof text !== 'string') {
          text = this.formData.word;
          this.formData.word = "";
        }
        this.list.push({
          sent: true,
          content: text
        });
        this.postWordMethod({text: text})
      },
      setUseful(item, type) {
        if(item.disabled){    
          return;
        }
        item.disabled = true;    
        if(type === true){ 
          item.style = '#477bef';item.style2 = 'silver'}
          else {
          item.style = 'silver';item.style2 = '#477bef'}
        this.list.push({
          sent: true,
          content: type ? '已解决' : '未解决'
        });
        var self = this;
        var url = type === true ? '/mb_api/jarvis/ai/v1/channel/' + this.key + '/useful?' : '/mb_api/jarvis/ai/v1/channel/' + this.key + '/unuseful?';
        url += "uid=" + '911';
        this.$axios.put(url, { headers: { 'X-Request-ID': self.requestId } }).then(success, error);
        function success(data) {
          console.log(data);
          var pushitem = {
            received: true,
            feedback: false,
            useful: false,
            tel: false,
            content: data.data.split('\n'),
            guessList: {
              list: []
            }
          }
          self.list.push(pushitem);
          self.save(self.list);
          console.log(item,type)
        }
        function error(err) {
          var pushitem = {
              received: true,
              feedback: false,
              useful: false,
              tel: false,
              content: err.response.data?err.response.data.split('\n'):err.message.split('\n'),
              guessList: {
              list: []
            }
          }
          self.list.push(pushitem);
          self.save(self.list);
        };
      },
      inputLine(text) {
        this.formData.word = text;
      },
      save(message) {
        var self = this;
        var database = this.database;
        this.openDatabase().then(function (db) {
          var request = db.transaction([database.store], 'readwrite')
            .objectStore(database.store)
            .put({
              id: self.uid,
              message: message
            });
          request.onsuccess = function () {
            console.log('save success');
          };
          request.onerror = function (err) {
            console.log('save error', err);
          };
          db.close();
        });
      },
      openDatabase() {
        var database = this.database;
        return new Promise(function (resolve, reject) {
          var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
          if (!indexedDB) {
            reject('not support');
            return;
          }
          var request = indexedDB.open(database.name, database.version);
          request.onsuccess = success;
          request.onerror = error;
          request.onupgradeneeded = createStore;
          function createStore(e) {
            var store;
            var db = e.currentTarget.result;
            if (db.objectStoreNames.contains(database.store)) {
              db.deleteObjectStore(database.store);
            }
            store = db.createObjectStore(database.store, { keyPath: 'id' });
            store.transaction.oncomplete = function () {
              resolve(db);
            };
            store.transaction.onerror = error;
          };
          function success(e) {
            resolve(request.result);
          };
          function error(err) {
            reject(err);
          };
        });
      },
      

    },updated:function(){
      this.$refs['myScrollbar'].wrap.scrollTop = this.$refs['myScrollbar'].wrap.scrollHeight;
  }};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  html,
  body,
  h1,
  h2,
  p,
  ul,
  li {
    margin: 0;
    padding: 0;
  }
  html,
  body,#app,.home-page{
    font-size: 12px;
    color: #293040;
    /* background-color: #ffd630; */
    width: 100%;
    height: 100%;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
  }
  h1 {
    font-size: 1.5rem;
  }
  ul,
  li {
    list-style: none;
  }
  .head {
    position: relative;
    height: 3.666rem;
    overflow: hidden;
    line-height: 3.666rem;
    background-color: #ffd630;
  }
  .left-buttons {
    width: 4rem;
    padding: .3rem 0 0 1.333rem;
  }
  .icon-back::after {
    content: "";
    width: 1rem;
    height: 1rem;
    display: inline-block;
    border-top: 2px solid #717787;
    border-left: 2px solid #717787;
    transform: rotate(-45deg);
  }
  .head-title {
    text-align: center;
    position: absolute;
    top: 0;
    left: 4rem;
    right: 4rem;
  }
  .content {
    position: absolute;
    overflow: hidden;
    top: 3.666rem;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #f5f5f9;
  }
  .content.has-foot {
    bottom: 4rem;
  }
  .scroll {
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-text-size-adjust: none;
    -moz-text-size-adjust: none;
    text-size-adjust: none;
    -webkit-transform-origin: left top;
    transform-origin: left top;
  }
  .scroll-transition {
    -webkit-transition: -webkit-transform .3s linear;
    transition: transform .3s linear;
  }
  .foot {
    position: absolute;
    bottom: 0;
    background-color: #fff;
    width: 100%;
  }
  .flex {
    display: flex;
  }
  .flex-1 {
    flex: 1;
  }
  .content .el-scrollbar__wrap {
    overflow-x:hidden;
    position: relative;
  }
  .has-more-text {
    font-size: 1rem;
    color: #a1a6b3;
    text-align: center;
    margin: 1rem 0;
  }

  .list-container {
    padding-bottom: 2rem;
  }

  .list {
    padding: 0 1.333rem;
    font-size: 1.2rem;
    line-height: 1.8rem;
  }

  .list>li {
    margin: 1rem 0;
  }

  .message-received {
    background-color: #fff;
    border-radius: 0.5rem 2rem 2rem 2rem;
    padding: 1rem 1.2rem;
    margin-left: 4rem;
    margin-right: 3rem;
  }

  .message-received::before {
    content: "";
    display: block;
    position: absolute;
    width: 3rem;
    height: 3rem;
    margin-left: -5rem;
    margin-top: -1rem;
    background-image: url("../assets/icons/smile.png");
    background-size: 3rem;
    background-repeat: no-repeat;
  }

  .message-sent {
    text-align: right;
    margin-left: 4rem;
    margin-right: 1rem;
  }

  .send-content {
    color: #fff;
    background-color: #ffb71b;
    border-radius: 2rem 0.5rem 2rem 2rem;
    display: inline-block;
    padding: 1rem 1.2rem;
    word-break: break-word;
    text-align: left;
  }

  .received-title {
    font-weight: 600;
  }

  .guess-list {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #dfe1e6;
  }

  /* .guess-title::before {
    content: "";
    width: 0.4rem;
    height: 0.8rem;
    background-color: #ffd630;
    display: block;
    margin: 1rem 0 0 0;
    position: absolute;
  } */

  .guess-list li {
    line-height: 3rem;
  }
  .title_btn {
    color: black !important;
    text-decoration: none;
  }

  .guess-list a:link,
  .guess-list a:active,
  .guess-list a:visited,
  .guess-list a:hover {
    text-decoration: none;
    color: #477bef;
  }

  /* .guess-list a:visited {
  color: #a1a6b3;
} */
  .guess-title {
    text-indent: 1rem;
    font-weight: 600;
  }

  .button-link {
    width: 100%;
    height: 3rem;
    border: none;
    background-color: #ffd630;
    border-radius: 0.5rem;
    margin-top: 2rem;
  }

  .feedback dt {
    display: inline-block;
  }
  .useful {
    background-image: url("../assets/icons/icon-useful.png");
  }
  .useless {
    background-image: url("../assets/icons/icon-useful-down.png");
  }
  .feedback dd {
    display: inline-block;
    border: 1px solid #dfe1e6;
    border-radius: 3rem;
    padding: 0.5rem 0.8rem 0.5rem 2.5rem;
    margin-left: 0.5rem;
    /* background-image: url("../assets/icons/icon-useful.png"); */
    background-size: 1.5rem;
    background-repeat: no-repeat;
    background-position: 0.5rem center;
  }
  .tel-container {
    border-top: 1px solid #dfe1e6;
    text-align: center;
    padding-top: 1rem;
  }

  .tel-container a {
    color: #477bef;
    border: none;
    text-decoration: none;
  }

  .foot {
    width: 100%;
    /* height: 8.5rem; */
    overflow: hidden;
  }

  .foot.has—no-words {
    height: 4rem;
    padding-top: 0.8rem;
  }

  .content.has-foot {
    bottom: 8rem;
  }

  .content.has-foot.has—no-words {
    bottom: 4rem;
  }

  .question-list {
    text-align: left;
    padding: 1rem 1.333rem;
  }

  .question-list li {
    display: inline-block;
    border: 1px solid #dfe1e6;
    margin: 0 0.6rem;
    padding: 0.3rem 1rem 0.5rem 1rem;
    border-radius: 2rem;
  }

  .question {
    padding: 0 1.333rem;
  }

  .question input {
    background-color: #f6f6f8;
    border: none;
    height: 3rem;
    border-radius: 3rem;
    border: none;
    padding-left: 1rem;
    font-size: 1.2rem;
    outline: none;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .button-add {
    width: 3rem;
    height: 3rem;
    border: 1px solid #a1a6b3;
    color: #a1a6b3;
    background-color: transparent;
    border-radius: 50%;
    font-size: 3rem;
    font-family: Arial;
    line-height: 1rem;
    padding-top: 0.2rem;
    text-align: center;
    margin-left: 1rem;
  }

  .button-send {
    background-color: #ffd630;
    border: none;
    height: 2.5rem;
    padding: 0 1rem;
    margin-top: 0.3rem;
    border-radius: 0.5rem;
    margin-left: 1rem;
    margin-right: -5.6rem;
    transition: margin 0.5s;
  }

  .button-send-show {
    margin-right: 0rem;
  }

  .received-box p {
    line-height: 30px;
    height: 30px;
  }
  .received-content span{
    display: block;
    word-break: break-word;
  }
  /* .received-content .content-bold:first-line {
    font-weight: bold;
  } */
  .received-content .content-bold:first-child {
    font-weight: bold;
  }
  /* .received-content .content-bold {
    font-weight: bold;
  } */
  @media (max-width:415px) {
    .feedback dd:last-child{
      margin: 1rem 0 0 3.2rem;
    }
      /* .foot {
    width: 100%;
    height: 10.5rem;
    overflow: hidden;
  } */
}

</style>