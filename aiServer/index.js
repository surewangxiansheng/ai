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
              {hotwords:'美食'},
              {hotwords:'王者荣耀'},
              {hotwords:'当前时间'},
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
    guides: ['学校规模','知名校友','主要院系','美食']
  },
  {
    text: '四川大学锦城学院学校规模', 
    say: '四川大学锦城学院校园占地面积1500余亩，现设有11个二级学院、52个本科专业、18个专科专业、100余个专业方向，在校师生20000余人，本科生16000余人，形成了文、理、工、经、管、艺六个学科门类协调发展，多层次、多形式的专业门类较为齐全的综合性的办学格局。',
    guides: ['知名校友','主要院系','美食']
  },
  {
    text: '四川大学锦城学院知名校友', 
    say: '四川大学锦城学院知名校友有：\n张皓宸、陈钰琪、凌菱、廖翎结、欧九儿',
  },
  {
    text: '四川大学锦城学院主要院系', 
    say: '四川大学锦城学院主要院系有:\n电子信息学院\n计算机与软件学院\n金融学院\n艺术学院\n工商管理学院\n文学与传媒学院\n外国语学院\n文学与传媒学院等',
    guides: ['计算机与软件学院','电子信息学院','外国语学院','金融学院','文学与传媒学院']
  },
  {
    text: '四川大学锦城学院计算机与软件学院', 
    say: '计算机与软件学院自2005年我校建校之际同时成立，目前专业设置为：4个本科专业（软件工程、计算机科学与技术、数据科学与大数据技术、电子商务）及3个专科专业（电子商务、云计算应用与技术、移动应用开发），在校学生三千余人。',
    guides: ['电子信息学院','外国语学院','金融学院','文学与传媒学院']
  },
  {
    text: 'n四川大学锦城学院电子信息学院', 
    say: '电子信息学院成立于2007年，伴随着国家电子信息产业的发展，学院迅速壮大，经过十余年的高速发展，电子信息学院已构建起专-本一体化的完整的培养体系，拥有一个省级特色专业、一个省级应用型本科示范专业、一个省级实践教学示范中心，已经发展成为拥有一流的师资队伍、一流的实验设备、一流的人才培养和一流的就业去向的“新工科”人才培养摇篮，亦已发展成为我国新兴电子信息技术创新人才的重要培养基地。',
    guides: ['计算机与软件学院','外国语学院','金融学院','文学与传媒学院']
  },
  {
    text: '四川大学锦城学院外国语学院', 
    say: '四川大学锦城学院外国语学院成立于2007年，现有英语、日语、法语三个本科专业和旅游英语、商务英语两个专科专业。',
    guides: ['计算机与软件学院','电子信息学院','金融学院','文学与传媒学院']
  },
  {
    text: '四川大学锦城学院金融学院', 
    say: '金融学院共有5个本科专业：金融学、投资学、保险学、国际商务、国际经济与贸易，还有金融管理和互联网金融等2个专科专业：金融管理。在校学生人数2600余人。金融学院师资力量雄厚，其中近一半教师为教授、副教授，三分之一的教师具有博士学位，有一半的教师具有国外留学背景或金融机构从业经历。教师教学经验丰富，有强烈的敬业精神和崇高的教育使命感。',
    guides: ['计算机与软件学院','电子信息学院','外国语学院','文学与传媒学院']
  },
  {
    text: '四川大学锦城学院文学与传媒学院', 
    say: '四川大学锦城学院文学与传媒学院，前身是四川大学锦城学院文学与传媒系成立于2005年7月，2016年10月更名为四川大学锦城学院文学与传媒学院。现任院长毛建华教授，副院长傅仕彬教授、副院长杨骊副教授。本院下设中文系、传媒系和公共管理系，以及新媒体研究所、文化产业研究所、儒学研究中心，汉语国际教育研究所、非物质文化遗产研究所、夸父培训中心、融媒体研究所等科研机构。现有汉语言文学、汉语国际教育、行政管理、新闻学、广告学、网络与新媒体等6个本科专业。',
    guides: ['计算机与软件学院','电子信息学院','金融学院','外国语学院']
  },
  //闲聊
  {
    text: '现在时间', 
    say: '时间',
  },
  {
    text: '当前时间', 
    say: '时间',
  },
  {
    text: '明星。', 
    say: '什么明星呢？',
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
    text: '四川大学锦城学院有哪些美食？', 
    say: '这里的美食还是很多呢，我就给你推荐几个吧\n1.三食堂鸡公煲\n2.一食堂特色热拌菜\n3.二食堂酱鸭饭\n4.杏岛餐厅\n5.四食堂麻油抄手等等',
    guides: ['学校规模','主要院系']
  },
  {
    text: '四川大学锦城学院有哪些好吃的呢？', 
    say: '这里的美食还是很多呢，我就给你推荐几个吧\n1.三食堂鸡公煲\n2.一食堂特色热拌菜\n3.二食堂酱鸭饭\n4.杏岛餐厅\n5.四食堂麻油抄手等等',
    guides: ['学校规模','主要院系']
  },
  {
    text: '四川大学锦城学院有什么美食？', 
    say: '这里的美食还是很多呢，我就给你推荐几个吧\n1.三食堂鸡公煲\n2.一食堂特色热拌菜\n3.二食堂酱鸭饭\n4.杏岛餐厅\n5.四食堂麻油抄手等等',
    guides: ['学校规模','主要院系']
  }
];
 app.post('/words', function(req,res){
  if(!req.body) return res.sendStatus(400);
    console.log("/goods post request");
    var notFind = {
      say: '你说什么？我没带眼镜听不见，请换个方式再说一次'
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
