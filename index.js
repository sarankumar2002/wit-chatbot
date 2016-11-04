var Botkit = require('botkit');
var Witbot = require('witbot');
var express = require('express');
var request = require('request');
var app = express();

const PORT=8081;

var witToken = '5T3CGIH2XOZBNT3FPSYDD645FGGW3KLT';

app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === "password") {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }  
});
//app.listen(PORT);

var controller = Botkit.facebookbot({
        access_token: 'EAAPfh8pNKIkBAHhKjAEvtbV61kRVLFqP8ZB5kznLmKY1PCiHfoZBqMjCryzwJdZCA1iPZCIRLaGsoAsgbK7OSiQzO2bZBrER17MBw0ZBcpsMZA9VCenlzSCfUiRCKB8In49jrM2H5RxPfDNEQjmAxZCSoozTZBn6p1WkM1UffYFlkTAdkYLojuq5I',
        verify_token: 'password',
})

var bot = controller.spawn({
});

// if you are already using Express, you can use your own server instance...
// see "Use BotKit with an Express web server"
controller.setupWebserver(PORT,function(err,webserver) {
  controller.createWebhookEndpoints(controller.webserver, bot, function() {
      console.log('This bot is online!!!');
  });
});

// this is triggered when a user clicks the send-to-messenger plugin
controller.on('facebook_optin', function(bot, message) {

    bot.reply(message, 'Welcome to my app!');

});
var witbot = Witbot(witToken);

// user said MTCN
controller.hears('.*', 'message_received', function(bot, message) {
 var wit = witbot.process(message.text, bot, message);   
	
	// Check MTCN status
	wit.hears('mtcn',0.5,function(bot,message,outcome){
		console.log('inside output is ='+JSON.stringify(outcome));
		
		console.log('entities ='+JSON.stringify(outcome.entities.number));
		if(outcome.entities && JSON.stringify(outcome.entities.number) !== undefined ){
		
		var mtcnNumber = outcome.entities.number[0].value;
		console.log('mtcn'+mtcnNumber);
		var url = 'http://localhost:8082/mtcnstatus?mtcn='+mtcnNumber;
		request({url:url,json:true},function(error,response,data){
		if(error){
			return console.log(error)
		}
		if(response.statusCode != 200){
			return fn(new Error('unexpected status is '+response.statusCode));
		}
		var msg = data.mtcn;
		console.log('msg='+msg);
		//fn(msg);
		 bot.reply(message, 'MTCN('+mtcnNumber+') status is '+msg);	
		 });
		 } else{
			 bot.reply(message, 'Please provide mtcn number in (mtcn:xxxx) format');
		 }
		
	});
	
	// Check MTCN status
	wit.hears('Money',0.5,function(bot,message,outcome){
		console.log('inside output is ='+JSON.stringify(outcome));
		
		console.log('entities ='+JSON.stringify(outcome.entities.number));
		if(outcome.entities && JSON.stringify(outcome.entities.number) !== undefined ){
		
		var mtcnNumber = outcome.entities.number[0].value;
		console.log('mtcn'+mtcnNumber);
		var url = 'http://localhost:8082/mtcnstatus?mtcn='+mtcnNumber;
		request({url:url,json:true},function(error,response,data){
		if(error){
			return console.log(error)
		}
		if(response.statusCode != 200){
			return fn(new Error('unexpected status is '+response.statusCode));
		}
		var msg = data.mtcn;
		console.log('msg='+msg);
		//fn(msg);
		 bot.reply(message, 'MTCN('+mtcnNumber+') status is '+msg);	
		 });
		 } else{
			 bot.reply(message, 'Please provide mtcn number');
		 }
		
	});
	
		// Hello	
		wit.hears('Hello',0.5,function(bot,message,outcome){
		
			//console.log('hello outcome'+ JSON.stringify(outcome))
		
			bot.reply(message,'Hello! how can i help you today' );	
		});	
		
	
		// Rewards	
		wit.hears('Offers',0.5,function(bot,message,outcome){
		
		console.log('Rewards outcome'+ JSON.stringify(outcome))	
		 
		 var country ='US';		 
		 var url = 'http://localhost:8082/rewards?country='+country;
		 request({url:url,json:true},function(error,response,data){
			
		if(error){
			return fn(error)
		}
		if(response.statusCode != 200){
			return fn(new Error('unexpected status is '+response.statusCode));
		}
		
		var msg = data.US;
		console.log('msg='+msg);
		//fn(msg);
			bot.reply(message,msg);	
		 });
		 
		});	


		// Rewards	
		wit.hears('reward',0.5,function(bot,message,outcome){
		
		console.log('Rewards outcome'+ JSON.stringify(outcome))	
		 
		 var country ='US';		 
		 var url = 'http://localhost:8082/rewards?country='+country;
		 request({url:url,json:true},function(error,response,data){
			
		if(error){
			return fn(error)
		}
		if(response.statusCode != 200){
			return fn(new Error('unexpected status is '+response.statusCode));
		}
		
		var msg = data.US;
		console.log('msg='+msg);
		//fn(msg);
			bot.reply(message,msg);	
		 });
		 
		});				
		
		
		
		

	wit.otherwise(function (bot, message) {
		// sending rest call
		bot.reply(message, 'I don\'t understnd, We are currently offering to check MTCN/Payment status, Offers and Exchange rates services');
  });
});







var localtunnel = require('localtunnel');

var opts = {
      subdomain : 'saran1'      
    };

var tunnel = localtunnel(PORT,opts, function(err, tunnel) {
    if (err){
		return console.err(err);
	}

    // the assigned public url for your tunnel
    // i.e. https://abcdefgjhij.localtunnel.me
    tunnel.url;
	console.log(tunnel.url);
});