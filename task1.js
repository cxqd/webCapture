phantom.onError = function(msg, trace) {
  var msgStack = ['PHANTOM ERROR: ' + msg];
  if (trace && trace.length) {
    msgStack.push('TRACE:');
    trace.forEach(function(t) {
      msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function+')' : ''));
    });
  }
  console.error(msgStack.join('\n'));
  phantom.exit(1);
};

phantom.outputEncoding = 'gb2312';

const system = require('system');
const page = require('webpage').create();
const $ = require('jquery');

if (system.args.length === 1) {
  console.log('Usage: task1.js <some keyword>');
  phantom.exit();
}

const keyword = system.args[1];
var time = Date.now();

page.open('https://www.baidu.com/s?wd=' + encodeURIComponent(keyword), function(status) {
  time = Date.now() - time;

  if (status !== 'success') {
    console.log(JSON.stringify({
      code: 0, //返回状态码，1为成功，0为失败
      msg: '抓取失败', //返回的信息
      word: keyword, //抓取的关键字
      time: time, //任务的时间
      dataList: data,
    }));
  } else {
    console.log('time:' + time);

    const data = page.evaluate(function() {
      const res = $('body').find('.c-container');
      const arr = [];

      for (var i = 0; i < res.length; i++) {
        const item = $(res[i]);

        arr.push({
          title: item.find('h3.t').text(),
          info: item.find('.c-abstract').text(), //摘要
          link: item.find('h3.t a').attr('href'), //链接            
          pic: item.find('.general_image_pic img').attr('src') //缩略图地址
        });
      }

      return arr;
    });

    console.log(JSON.stringify({
      code: 1, //返回状态码，1为成功，0为失败
      msg: '抓取成功', //返回的信息
      word: keyword, //抓取的关键字
      time: time, //任务的时间
      dataList: data,
    }));
  }
  phantom.exit();
});