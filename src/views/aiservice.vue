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
              <button v-if="item.linkText" class="button-link"> <a class="title_btn" :href="item.hrefUrl">{{item.linkText}}</a></button>
              <ul v-if="item.guessList.list" class="guess-list">
                <li class="guess-title">{{item.guessList.title}}
                </li>
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
              ["Hi~您好，我是睿智的机器人，为您提供自助服务，请问有什么想对我说的吗？"],
            guessList: {
              title: '',
              list: []
            },
            feedback: false,
            useful: true,
            tel: false,
            style:'',
            style2:'',
            disabled: false,
            hrefUrl:''
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
    computed: {
      week: function () {
        let h = ['日','一','二','三','四','五','六'];
        return '星期' + h[(new Date).getDay()]
      }
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
      this.isIndexedDB();
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
              if(res.data.say == '时间') {
                var pushitem = {
                  received: true,
                  feedback: true,
                  useful: false,
                  tel: false,
                  content: ['现在时间是: '+that.getDate()],
                  guessList: {
                    list: []
                  }
                }
                that.list.push(pushitem);
                that.save(that.list);
                return
              }
              else if(res.data.say == '星期') {
                var pushitem = {
                  received: true,
                  feedback: true,
                  useful: false,
                  tel: false,
                  content: ['今天是'+that.week],
                  guessList: {
                    list: []
                  }
                }
                that.list.push(pushitem);
                that.save(that.list);
                return
              }
              res.data.jumps?that.hrefUrl = res.data.jumps[0].uri:'';
              var say = res.data.say.replace(/\&nbsp/g, "");
              var pushitem = {
                received: true,
                feedback: true,
                useful: true,
                tel: true,
                linkText: res.data.jumps?res.data.jumps[0].title||'':res.data.jumps,
                content: say.split('\n'),
                guessList: {},
                hrefUrl: res.data.jumps?res.data.jumps[0].uri:''
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
      getDate() {
        let now = new Date;
        let h = now.getHours();
        let mm = now.getMinutes();
        let str;
        if (h > 12) {
          h -= 12;
          str = " PM";
        } else {
          str = " AM";
        }
        h = h < 10 ? "0" + h : h;
        mm = mm < 10 ? "0" + mm : mm;
        let xy = h + ":" + mm;
        xy += str;
        return xy
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
              for(let i=0,len=historymsgList.length;i<len;i++){
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
      

    },
    updated:function(){
      this.$refs['myScrollbar'].wrap.scrollTop = this.$refs['myScrollbar'].wrap.scrollHeight;
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>