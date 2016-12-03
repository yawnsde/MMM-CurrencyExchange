/* global Module */

/* Magic Mirror
 * Module: MMM-CurrencyExchange
 *
 * By Stefan Krause http://yawns.de
 * MIT Licensed.
 */

Module.register('MMM-CurrencyExchange',{
	
	defaults: {
		base: "",
		symbols: null,
		units: config.units,
		animationSpeed: 1000,
		updateInterval: 1000 * 3600, //update every hour
		timeFormat: config.timeFormat,
		lang: config.language,
		showCustomHeader: true,
		showFlag: true,
		showText: true,
		layoutStyle: 'table',

		initialLoadDelay: 0, // 0 seconds delay

		apiBase: "http://api.fixer.io/latest",				
	},
	
// ##################################################################################
// Define required scripts.
// ##################################################################################
	getScripts: function() {
		return ["moment.js"];
	},

// ##################################################################################
// import css files
// ##################################################################################
	getStyles: function() {
		return ['MMM-CurrencyExchange.css'];
	},	

// ##################################################################################
// setup the module
// ##################################################################################
	start: function() {
		Log.info('Starting module: ' + this.name);
		this.loaded = false;
		this.scheduleUpdate(this.config.initialLoadDelay);

		this.updateTimer = null;
		
		if (this.config.base == "") {
			this.config.base = "EUR";
		}
		
		var self = this;
		setInterval(function() {
			self.updateDom();
		}, this.config.animationSpeed);

	},

// ##################################################################################
// handle all the output stuff
// ##################################################################################
	getDom: function() {
		var wrapper = document.createElement("div");

		if (!this.loaded) {
			wrapper.innerHTML = this.translate('LOADING');
			wrapper.className = "dimmed light small";
			return wrapper;
		}		

		// no data was retrieved, maybe the source is down or the request was invalid
		if (!this.rates.length) {
			wrapper.innerHTML = "No data";
			wrapper.className = "dimmed light small";
			return wrapper;
		}

		// display a custom header, just in case
		if (this.config.showCustomHeader) {
			var customHeader = document.createElement('div');
			customHeader.innerHTML = "Base: " + this.config.base + " (" + this.rateUpdate + ")";
			customHeader.className = "light small UNDERLINE";
			wrapper.appendChild(customHeader);
		}

		// get ready to process data and print it to the screen
		var outputWrapper = document.createElement('div');

		var dataLimit = ((this.rates.length > 8) ? 3 : 2); 

		if (this.config.layoutStyle == 'table') {
			var table = document.createElement('table');
			table.className = "small align-left";
		}

		for (i in this.rates) {
			if (this.config.layoutStyle == 'table') {
				// we want more columns to save some space on screen, so we iterate and only create a new row with every second dataset
				if ( i % dataLimit == 0) {
					var row = document.createElement('tr');
				}
				var cell = document.createElement('td');
			}
			var rateContainer = document.createElement('span');
			rateContainer.className = "light small";

			// determine if user wants to see the currency flag
			if (this.config.showFlag) {
				var flagSpan = document.createElement('span');
				flagSpan.innerHTML = "&nbsp;";
				flagSpan.className = this.rates[i].symbol + " NOREPEAT";
				rateContainer.appendChild(flagSpan);
			}

			// determine if user wants to see the abbreviated currency text (EUR, USD, ..)
			if (this.config.showText) {
				var currencySpan = document.createElement('span');
				currencySpan.innerHTML = this.rates[i].symbol + ": ";
				rateContainer.appendChild(currencySpan);			
			}

			var rateSpan = document.createElement('span');
			rateSpan.innerHTML = ((this.config.layoutStyle == 'ticker' && i < (this.rates.length - 1)) ? this.rates[i].rate + ' &bull; ' : this.rates[i].rate);
			rateContainer.appendChild(rateSpan);

			// if the user wants a table, we add the dataset to a cell. If this is the last dataset for a row or the final dataset we add the row to the table 
			if (this.config.layoutStyle == 'table') {
				cell.appendChild(rateContainer);
				row.appendChild(cell);
				if ( i % dataLimit != 0 || i == (this.rates.length-1) ) { table.appendChild(row) }
			} else {
				outputWrapper.appendChild(rateContainer);
			}
		}

		if (this.config.layoutStyle == 'table') {
			outputWrapper.appendChild(table);
			wrapper.appendChild(outputWrapper);

		} else if (this.config.layoutStyle == 'ticker') {
			var marqueeTicker = document.createElement("marquee");
			marqueeTicker.innerHTML = outputWrapper.innerHTML;
			marqueeTicker.className = "small thin light";
			marqueeTicker.width = document.getElementsByClassName("MMM-CurrencyExchange")[0].clientWidth;
			marqueeTicker.scrollDelay = 100;
			wrapper.appendChild(marqueeTicker);
		}

		return wrapper;
	},

// ##################################################################################
// fetch new data
// ##################################################################################
	updateCurrencies: function() {
		var url = this.config.apiBase + this.getParams();
		var self = this;
		var retry = true;

		var Request = new XMLHttpRequest();
		Request.open("GET", url, true);
		Request.onreadystatechange = function() {
			if (this.readyState === 4) {
				if (this.status === 200) {
					self.processCurrencies(JSON.parse(this.response));
				} else {
					Log.error(self.name + ": Could not load data.");
				}

				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		Request.send();
	},

// ##################################################################################
// prepare request url 
// ##################################################################################
	getParams: function() {
		var params = '';
		if (this.config.base != "") {
			  params += "?base=" + this.config.base;
		}
		if (this.config.symbols) {
		  params += "&symbols=" + this.config.symbols.join();
		}
		return params;
	},

// ##################################################################################
// validate data after request, prepare for output
// ##################################################################################
	processCurrencies: function(data) {

		if (!data.rates) {
			// Did not receive usable new data.
			// Maybe this needs a better check?
			return;
		}

		this.rateUpdate = data.date;
		this.rates = [];
		
		for (key in data.rates) {
			
			this.rates.push({
				symbol: key,
				rate: data.rates[key],
			});
		}

		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
	},

// ##################################################################################
// schedule updates based on define interval
// ##################################################################################
	scheduleUpdate: function(delay) {
		var nextLoad = this.config.updateInterval;
		if (typeof delay !== "undefined" && delay >= 0) {
			nextLoad = delay;
		}

		var self = this;
		setTimeout(function() {
			self.updateCurrencies();
		}, nextLoad);
	},

});
