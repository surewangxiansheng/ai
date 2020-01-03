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
              {hotwords:'吃饭'},
              {hotwords:'睡觉'},
              {hotwords:'王者荣耀'},
              {hotwords:'抖音'},
              {hotwords:'快手'},
              {hotwords:'音乐'},
              {hotwords:'明星'}
            ]}
      res.send(items);
 });


 app.post('/words', function(req,res){
  if(!req.body) return res.sendStatus(400);
    console.log("/goods post request");
    var notFind = {
      say: '你说什么？我没带眼镜听不见，请再说一次'
    };
    var items = [
      {
        text: '王者荣耀', 
        say: '王者',
        jumps: [{
          uri:'www.baidu.com',
          title: '跳一跳'
            }]
      },
      {
        text: '快手', 
        say: '快手',
        jumps: [{
          uri:'www.baidu.com',
          title: '跳一跳'
            }],
        guides: ['蔡许昆','罗志祥']
      }
    ];
    for(let i=0,len=items.length;i<len;i++) {
      if(items[i].text == req.body.text) {
        res.send(items[i])
        return
      } 
      // else {
      //   res.send(notFind)
      //   return
      // }
    }
    // items.push(req.body); 
    res.send(notFind);
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
