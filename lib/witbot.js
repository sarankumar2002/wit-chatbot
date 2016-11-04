var Wit = require('node-wit')

module.exports = function (witToken) {
  return new Witbot(witToken)
}

function Witbot (witToken) {
  var self = this
  self._witToken = witToken

  // process text with Wit.ai.
  // 1st argument is the text of the message
  // Remaining arguments will be passed as the first arguments of each registered callback
  self.process = function (text) {
    var args = Array.prototype.slice.call(arguments)
    var intents = new Intents();
	//console.log('2222222222intents:::'+JSON.stringify(intents));
    var matched = false
    args.shift()
    Wit.captureTextIntent(self._witToken, text, function (err, res) {
      if (err) return console.error('Wit.ai Error: ', err)
		console.log('res='+JSON.stringify(res.outcomes[0].entities));
	
	var JsonString = JSON.stringify(res.outcomes[0].entities);
	var json = JSON.parse(JsonString);	
      // only consider the 1st outcome
      if (res.outcomes && res.outcomes.length > 0 && JSON.stringify(res.outcomes[0].entities) != '{}' && JSON.stringify(res.outcomes[0].entities.intent) !== undefined) {		  
        var outcome = res.outcomes[0].entities.intent[0]
        var intent = outcome.value.trim();
        args.push(res.outcomes[0])				
		
        if (intents._intents[intent]) {
          intents._intents[intent].forEach(function (registration) {
			  console.log('outcome.confidence:'+outcome.confidence+" registration.confidence:"+registration.confidence);
            if (!matched && outcome.confidence >= registration.confidence) {
              matched = true			  
              registration.fn.apply(undefined, args)
            }
          })
        } else if (intents._any) {
          matched = true
          intents._any.apply(undefined, args)
        }
      }

      // there were no matched outcomes or matched routes
      if (!matched) intents._catchall.apply(undefined, args)
    })

    return intents
  }
}

function Intents () {
  var self = this
  self._intents = {}
  self._catchall = function () {}

  self.hears = function (name, confidence, fn) {
    var registration = {
      confidence: confidence,
      fn: fn
    }
	//console.log('registration:'+JSON.stringify(registration)+',self._intents[name]'+JSON.stringify(self));
    if (!self._intents[name]) {
      self._intents[name] = [registration]
    } else {
      self._intents[name].push(registration)
    }
	//console.log('self object'+JSON.stringify(self));
    return self
  }

  self.otherwise = function (fn) {
    self._catchall = fn
    return self
  }

  self.any = function (fn) {
    self._any = fn
    return self
  }
}
