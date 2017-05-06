const express = require('express'),
  multer  = require('multer'),
  bodyParser = require('body-parser'),
  fs = require('fs'),
  Memobird = require('memobird'),
  utils = require("./utils"),
  app = express(), 
  port = 3000,
  uploadPath = 'upload'
  // field 必须与前端一致，fineuploader 用的是 'qqfile'
  uploadMW = multer({ dest: uploadPath }).array('qqfile', 10),
  config = require('./config.json');

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
} else {
  utils.cleanFolder(uploadPath);
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/', express.static(__dirname + '/'));

const memobird = new Memobird(config);
let toPrintImg

function print(content, type) {
  return new Promise(resolve => {
    memobird.init()
      .then(() => {
        if (type === 'text') {
          memobird.printText(content)
        } else if (type === 'image') {
          memobird.printImage(content)
        }
      })
      .then(printcontentid => memobird.watch(printcontentid, 1500, 15000))
      .then(printflag => resolve(printflag))
      .catch(error => console.log('打印出错了：', error));
  })
}

// to print
app.post('/', (req, res) => {
  let content = req.body.content
  let type = req.body.type
  if (toPrintImg) {
    content = toPrintImg
    type = 'image'
  }
  print(content, type)
    .then((printflag) => {
      res.json({
        'ok': printflag === 1
      });
    })
})

// 最好用中间件，否则收到的数据处理很麻烦
app.post('/upload', uploadMW, (req, res, next) => {
  try {
    res.send({
      success: true
    });

    toPrintImg = __dirname + '/' + req.files[0].path
    console.log(req.files[0].path)
  } catch (err) {
    res.send({
      success: false
    });
  }
});

app.listen(port, (err) => {  
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})
