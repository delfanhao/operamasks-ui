/**
 * Wait until the test condition is true or a timeout occurs. Useful for waiting
 * on a server response or for a ui change (fadeIn, etc.) to occur.
 *
 * @param testFx javascript condition that evaluates to a boolean,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param onReady what to do when testFx condition is fulfilled,
 * it can be passed in as a string (e.g.: "1 == 1" or "$('#bar').is(':visible')" or
 * as a callback function.
 * @param timeOutMillis the max amount of time to wait. If not specified, 3 sec is used.
 */
function waitFor(testFx, onReady, timeOutMillis) {
	var maxtimeOutMillis = timeOutMillis ? timeOutMillis : 3001, //< Default Max Timout is 3s
		start = new Date().getTime(),
		condition = false,
		interval = setInterval(function() {
			if ((new Date().getTime() - start < maxtimeOutMillis) && !condition) {
				// If not time-out yet and condition not yet fulfilled
				condition = (typeof(testFx) === "string" ? eval(testFx) : testFx()); //< defensive code
			} else {
				if(!condition) {
					// If condition still not fulfilled (timeout but condition is 'false')
					console.log("'waitFor()' timeout");
					phantom.exit(1);
				} else {
					// Condition fulfilled (timeout and/or condition is 'true')
					console.debug("'waitFor()' finished in " + (new Date().getTime() - start) + "ms.");
					typeof(onReady) === "string" ? eval(onReady) : onReady(); //< Do what it's supposed to do once the condition is fulfilled
					clearInterval(interval); //< Stop this interval
				}
			}
		}, 10000);
};

if (phantom.args.length < 1) {
	console.log('Usage: phantomjs-test-runner.js [-j|--junit] <some URL>');
	phantom.exit();
} else {
	var args = phantom.args.slice(),
		url = args.pop();
	window.console.debug = function() {};
	phantom.outputFormat = 'console';
	if (args.length) {
		var arg = args.pop().toLowerCase();
		switch (arg) {
		case "-j":
		case "--junit":
			phantom.outputFormat = 'junit';
			break;
		default:
		}
	}
}

var page = new WebPage();

page.onConsoleMessage = function(msg) {	
	console.log(msg);
};

page.open(url, function(status) {
	if (status !== "success") {
		console.log('Unable to access network');
		phantom.exit();
	} else {
		waitFor(function() {
			return page.evaluate(function() {
				var el = document.getElementById('qunit-testresult');
				if (el && el.innerHTML.match('completed')) {
					return true;
				}
				return false;
			});
		}, function() {
			var failedNum = page.evaluate(function() {
				var el = document.getElementById('qunit-testresult');
				try {
					return el.getElementsByClassName('failed')[0].innerHTML;
				} catch (e) { }
				return 10000;
			});
			phantom.exit((parseInt(failedNum, 10) > 0) ? 1 : 0);
		},60000);
	}
});