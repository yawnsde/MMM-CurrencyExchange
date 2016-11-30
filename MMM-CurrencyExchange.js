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

		initialLoadDelay: 0, // 0 seconds delay
		retryDelay: 2500,

		apiBase: "http://api.fixer.io/latest",				
	},
	
	// Define required scripts.
	getScripts: function() {
		return ["moment.js"];
	},

	start: function() {
		Log.info('Starting module: ' + this.name);
		this.loaded = false;
		this.scheduleUpdate(this.config.initialLoadDelay);

		this.updateTimer = null;		

		var self = this;
		setInterval(function() {
			self.updateDom();
		}, this.config.animationSpeed);

	},

	getDom: function() {
		var wrapper = document.createElement("div");

		if (!this.loaded) {
			wrapper.innerHTML = this.translate('LOADING');
			wrapper.className = "dimmed light small";
			return wrapper;
		}		

		if (!this.rates.length) {
			wrapper.innerHTML = "No data";
			wrapper.className = "dimmed light small";
			return wrapper;
		}
/*
		var currentDate = this.tides[0].date;

		var table = document.createElement("table");
		table.className = "small";

		var row = document.createElement("tr");
		table.appendChild(row);
		var dayHeader = document.createElement("th");
		dayHeader.className = "day";
		dayHeader.innerHTML = "&nbsp;";
		row.appendChild(dayHeader);

		for (var f = 0; f < 4; f++)
		{
			var tideSymbol =  document.createElement("span");
			tideSymbol.className = ( (this.tides[f].type == "Low") ? this.config.lowtideSymbol : this.config.hightideSymbol );
			var extremeHeader = document.createElement("th");
			extremeHeader.className = "thin light";
			extremeHeader.setAttribute("style", "text-align: center");
			extremeHeader.appendChild(tideSymbol);
			row.appendChild(extremeHeader);
		}

		var row = document.createElement("tr");
		table.appendChild(row);
		var dayCell = document.createElement("td");
		dayCell.className = "day";
		dayCell.innerHTML = this.tides[0].day;
		row.appendChild(dayCell);


		for (var i in this.tides) {

			var currentTide = this.tides[i];

			if (currentDate != currentTide.date) {				
				var row = document.createElement("tr");
				table.appendChild(row);
				currentDate = currentTide.date;

				var dayCell = document.createElement("td");
				dayCell.className = "day";
				dayCell.innerHTML = currentTide.day;
				row.appendChild(dayCell);

			}

			var tideExtremeCell = document.createElement("td");
			tideExtremeCell.style.paddingLeft = "10px";
			tideExtremeCell.innerHTML = currentTide.time;

			if ( moment().unix() > currentTide.dt ) {				
				tideExtremeCell.className = "dimmed light small";
			}
			row.appendChild(tideExtremeCell);
		}
		wrapper.appendChild(table);
*/
		return wrapper;
	},

	/* updateCurrencies
	 * Requests new data from worldtides.info
	 * Calls processCurrencies on succesfull response.
	 */
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
				} else if (this.status === 400) {
					self.config.appid = "";
					self.updateDom(self.config.animationSpeed);

					Log.error(self.name + ": Incorrect APPID.");
					retry = false;
				} else {
					Log.error(self.name + ": Could not load tides.");
				}

				if (retry) {
					self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
				}
			}
		};
		Request.send();
	},

	getParams: function() {
    var params = '';
    if (this.config.base != "") {
		  params += "?base=" + this.config.base;
    }
		if (this.config.symbols) {
      params += this.config.symbols.join();
    }

		return params;
	},

	processCurrencies: function(data) {

		if (!data.rates) {
			// Did not receive usable new data.
			// Maybe this needs a better check?
			return;
		}

		this.rates = [];

		for (var i in data.rates) {
			var t = data.rates[i];
			t = t.split(":");
			this.rates.push({

				symbol: t[0],
				rate: t[1],
			});
		}

		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
	},

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
