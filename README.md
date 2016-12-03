# MMM-CurrencyExchange
This an extension for the [MagicMirror](https://github.com/MichMich/MagicMirror).

It derives foreign exchange rates from fixer.io

## Installation
Open a terminal session, navigate to your MagicMirror's `modules` folder and execute `git clone https://github.com/yawnsde/MMM-CurrencyExchange.git`, a new folder called MMM-CurrencyExchange will be created.

Activate the module by adding it to the config.js file as shown below.

## Using the module
````javascript
modules: [
{
  module: 'MMM-CurrencyExchange',
  position: 'top_right',
  config: {
    base: 'EUR',
    symbols: ['GBP', 'USD']
  }
},
````

## Configuration options

The following properties can be configured:

| **Option** | **Values** | **Description** |
| --- | --- | --- |
| `base` | **Possible value:** EUR, AUD, BGN, BRL, CAD, CHF, CNY, CZK, DKK, GBP, HKD, HRK, HUF, IDR, ILS, INR, JPY, KRW, MXN, MYR, NOK, NZD, PHP, PLN, RON, RUB, SEK, SGD, THB, TRY, USD, ZAR | Define your own currency. If blank or left out, EUR will be used by API. |
| `symbols` | see above, values written in array, separated by comma | Define currencies you would like to see. If blank or left out, all currencies are pulled. |
| `showCustomHeader` | **true** or **false** | Shows an additional header with selected base currency and last update, default is false |
| `showText` | **true** or **false** | Show or hide the abbreviated currency text, default is true |
| `showFlag` | **true** or **false** | Show or hide the currency flag, default is true |
| `layoutStyle` | **table** or **ticker** | Toggle the display style between a table and a ticker, default is table. Table calculates the number of requested currencies. If it is up to 8 it shows 2 columns, anything above it shows 3 columns. |
