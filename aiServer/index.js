var express = require('express');
var app = express();
var bodyParser = require('body-parser');

// 创建 application/x-www-form-urlencoded 编码解析
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
app.use(bodyParser.json({limit: '1mb'}));  
app.use(bodyParser.urlencoded({            
  extended: true
}));
//静态文件
app.use('/', express.static('static'));

var jsonParser = bodyParser.json();
//ajax路由 
app.all('*', function (req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   res.header('Access-Control-Allow-Headers', 'Content-Type');
   res.header('Access-Control-Allow-Methods', '*');
   res.header('Content-Type', 'application/json;charset=utf-8');
   next();
 });
app.get('/', function (req, res) {
   res.send('Hello World');
});


//  app.post('/students', function(req,res){
//      console.log("/students POST request");
//      var data = req.body;
//      if( data ){
//         data.id = ++id;
//         students.push(data);
//      };
//      res.send(data);
//  });

 app.get('/searchWords', function(req,res){
    console.log("/words get request");
 var items = {words:[
              {hotwords:'四川大学锦城学院'},
              {hotwords:'睡觉'},
              {hotwords:'王者荣耀'},
              {hotwords:'抖音'},
              {hotwords:'快手'},
              {hotwords:'音乐'},
              {hotwords:'明星'}
            ]}
      res.send(items);
 });

 var items = [
  //闲聊
  {
    text: '我', 
    say: '???',
    guides: ['我帅吗？','我漂亮吗？']
  },
  {
    text: '你是谁？', 
    say: '我是你爸爸。',
  },
  {
    text: '我帅吗？', 
    say: '我吐了！',
  },
  {
    text: '我漂亮吗？', 
    say: '我吐了！',
  },
  {
    text: '滚啊。', 
    say: '文明，和谐',
  },
  {
    text: '四川大学锦城学院在哪里', 
    say: '四川大学锦城学院（Jincheng College of Sichuan University）位于四川省会成都市，是经中华人民共和国教育部批准、由教育部直属高校四川大学申办、四川锦城实业发展有限公司投资的全日制普通本科高校，多学科、综合性的应用型大学。\n学校成立时间:  2005年5月9日\n地处:  四川省成都市成都高新技术产业开发区西部园区西源大道1号',
    jumps: [{
      uri:'http://www.scujcc.edu.cn/',
      title: '四川大学锦城学院学校官网'
        }],
    guides: ['学校规模','知名校友','主要院系']
  },
  {
    text: '学校规模', 
    say: '四川大学锦城学院校园占地面积1500余亩，现设有11个二级学院、52个本科专业、18个专科专业、100余个专业方向，在校师生20000余人，本科生16000余人，形成了文、理、工、经、管、艺六个学科门类协调发展，多层次、多形式的专业门类较为齐全的综合性的办学格局。',
    guides: ['知名校友','主要院系']
  },
  {
    text: '四川大学锦城学院知名校友', 
    say: '四川大学锦城学院知名校友有：\n张皓宸、陈钰琪、凌菱、廖翎结、欧九儿',
  },
  {
    text: '四川大学锦城学院主要院系', 
    say: '四川大学锦城学院主要院系有:\n电子信息学院\n计算机与软件学院\n财务会计学院\n金融学院\n艺术学院\n工商管理学院\n文学与传媒学院\n建筑学院\n文学与传媒学院等',
  },
  {
    text: '四川大学锦城学院计算机与软件学院', 
    say: '文明，和谐',
  },
  //闲聊
  {
    text: '王者荣耀。', 
    say: '王者',
    jumps: [{
      uri:'http://baidu.com',
      title: '跳一跳'
        }]
  },
  {
    text: '明星。', 
    say: '什么明星呢？',
    jumps: [{
      uri:'www.baidu.com',
      title: '跳一跳'
        }],
    guides: ['蔡徐坤','罗志祥','林俊杰','周杰伦']
  },
  {
    text: '蔡徐坤', 
    say: '逗你玩呢，其实我没有收集蔡徐坤的信息',
  },
  {
    text: '罗志祥', 
    say: '逗你玩呢，其实我没有收集罗志祥的信息',
  },
  {
    text: '林俊杰', 
    say: '逗你玩呢，其实我没有收集林俊杰的信息',
  },
  {
    text: '周杰伦', 
    say: '逗你玩呢，其实我没有收集周杰伦的信息',
  },
  {
    text: '快手666。', 
    say: '快手666\n1.下去\n2.上去',
    jumps: [{
      uri:'www.baidu.com',
      title: '跳一跳'
        }],
    guides: ['qqqq','eeee']
  }
];
 app.post('/words', function(req,res){
  if(!req.body) return res.sendStatus(400);
    console.log("/goods post request");
    var notFind = {
      say: '你说什么？我没带眼镜听不见，请再说一次'
    };
    let otherData = items.filter( item => (~item.text.indexOf(req.body.text)));
    otherData[0]?res.send(otherData[0]):res.send(notFind);
 });
 app.post('/word/useful', function(req,res){
  if(!req.body) return res.sendStatus(400);
    console.log("/goods post request");
    var items = {
      say: '感谢您的反馈！'
    };
    res.send(items);
 });
 app.post('/word/unuseful', function(req,res){
  if(!req.body) return res.sendStatus(400);
    console.log("/goods post request");
    var items = {
      say: '感谢您的反馈！我会努力改进的。'
    };
    res.send(items);
 });

 var addresses = [
  {id:"001" , name:"huangyuanyuan" , tel:"19909230011" , addr:"成都市高新西区锦城学院和平大楼"},
  {id:"002" , name:"wangxin" , tel:"19900980011" , addr:"成都市青羊区梨花街"},
  {id:"003" , name:"zhangyao" , tel:"17701110012" , addr:"成都市高新区天府大道1000号"},
  ]; 

 app.get('/addresses', function(req,res){
   console.log("/addresses get request");
    res.send(addresses);
}); 

app.post('/addresses', function(req,res){
  console.log("/addresses post request");
  addresses.push(req.body); 
  res.send(addresses[addresses.length - 1]);
});

app.delete('/addresses/:id', function(req,res){
  let id = req.params.id;
  console.log("/addresses delete request" + id);
  var index = addresses.findIndex(item => {
    if (item.id == id) {
      return true;
    }
  })
  addresses.splice(index, 1)
  res.send(addresses[addresses.length - 1]);
});
 
var server = app.listen(9090, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log(" http://%s:%s", host, port)
 
})
