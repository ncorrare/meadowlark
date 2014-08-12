var express = require('express');
var fortune = require('./lib/fortune.js');
var app = express();
var handlebars = require('express3-handlebars').create({ 
							defaultLayout:'main',
							helpers: {
								section: function(name, options){
									if(!this._sections)
										this._sections={};
										this._sections[name] = options.fn(this);
										return null;
								}
							}										
});
app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.set('port', process.env.PORT || 3000);

function getWeatherData(){
	return {
		locations: [
				{	name: 'Portland',
				  	forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
					iconUrl: 'http://icons.wxug.com/i/c/a/cloudy.gif',
					weather: 'Overcast',
					temp: '12.3 C',
				},
				{
					name: 'Bend',
					forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
                                        iconUrl: 'http://icons.wxug.com/i/c/a/partlycloudy.gif',
                                        weather: 'Partly Cloudy',
                                        temp: '11.5 C',
                                }
			],
		};
}

app.use(function(req,res,next){
	if(!res.locals.partials) res.locals.partials ={};
	res.locals.partials.weather = getWeatherData();
	next();
});

app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());
app.get('/newsletter', function(req,res){
	res.render('newsletter', {csrf: 'CSRF token goes here'});
});

app.post('/process', function(req,res){
	if (req.xhr || req.accepts('json,html')==='json'){
		res.send({ success:true });
		console.log('Form (from querystring): ' + req.query.form);
		console.log('CSRF Token (from hidden form field): ' + req.body._csrf);
		console.log('Name (from visible form field): ' + req.body.name);
		console.log('Email (from visible form field): ' + req.body.email);
	} else {
		res.redirect(303, '/404');
	}
});
app.get('/', function(req,res){
	res.render('home');
});

app.get('/thank-you', function(req,res){
	res.render('thankyou');
});

app.get('/about', function(req,res){
	var randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
	res.render('about', { fortune: fortune.getFortune });
});

app.get('/headers', function(req,res){
	res.set('Content-type','text/plain');
	var s = '';
	for(var name in req.headers) s += name + ': '
		+ req.headers[name]+ '\n';
	res.send(s);
});

app.use(function(req,res){
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});


app.listen(app.get('port'), function(){
	console.log('Express started on http://localhost:'+ app.get('port') +'; press Ctrl-C to terminate.');
});
