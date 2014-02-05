var express = require("express");

var app = express();
app.use(express.logger('dev'));

app.configure(function(){
  app.set('views', __dirname + '/app');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.static(__dirname + '/app'));
  app.use(app.router);
});

app.get('/', function(request, response) {
  response.render('index.html')
});

var port = process.env.PORT || 7000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
