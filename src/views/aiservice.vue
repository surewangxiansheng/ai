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
        <p v-show="hasMore" @click.once="moreNew" class="has-more-text">点击可以查看历史消息哦</p>
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
  import { 
    getHotword,
    postWord,
    postWordUseful,
    postWordUnuseful
    }
  from '@/api/api.js';
  var db;
  export default {
    name: "aiservice",
    data() {
      return {
        formData: {
          word: ""
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
      postWordUsefulMethod(parma) {
          var that = this;
        postWordUseful(
            parma
            ).then((res) => {
              var pushitem = {
                received: true,
                feedback: false,
                useful: false,
                tel: false,
                content: res.data.say.split('\n'),
                guessList: {
                  list: []
                }
              }
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
              that.list.push(pushitem);
              that.save(that.list);
              })
        },
      postWordUnusefulMethod(parma) {
        var that = this;
       postWordUnuseful(
          parma
          ).then((res) => {
            var pushitem = {
              received: true,
              feedback: false,
              useful: false,
              tel: false,
              content: res.data.say.split('\n'),
              guessList: {
                list: []
              }
            }
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
            that.list.push(pushitem);
            that.save(that.list);
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
            self.hasMore = false;
          };
          request.onerror = function (err) {
            console.log(err);
          };
        }, function (err) {
          console.log('open database error', err);
        });
      },
      check() {
        if (!this.formData.word) return;
      },
      send(text) {
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
        console.log(item);
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
        type === true ? this.postWordUsefulMethod() : this.postWordUnusefulMethod();
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
    background-color: #6bc3dd;
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
  
  .has-more-text {
    font-size: 1rem;
    color: black;
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
    margin-right: 0.3rem;
  }
  .useful {
    background-image: url("../assets/icons/heart.jpg");
  }
  .useless {
    background-image: url("../assets/icons/heartBreak.jpg");
  }
  .feedback dd {
    display: inline-block;
    border: 1px solid #dfe1e6;
    border-radius: 3rem;
    padding: 0.5rem 0.8rem 0.5rem 2.5rem;
    margin-left: 0.5rem;
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
  .received-content .content-bold:first-child {
    font-weight: bold;
  }
  @media (max-width:415px) {
    .feedback dd:last-child{
      margin: 1rem 0 0 3.2rem;
    }
}

</style>