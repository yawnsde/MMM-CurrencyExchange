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
  },
}
````

## Configuration options

The following properties can be configured:

| **Option** | **Values** | **Description** |
| --- | --- | --- |
| `base` | **Possible value:** EUR, AUD, BGN, BRL, CAD, CHF, CNY, CZK, DKK, GBP, HKD, HRK, HUF, IDR, ILS, INR, JPY, KRW, MXN, MYR, NOK, NZD, PHP, PLN, RON, RUB, SEK, SGD, THB, TRY, USD, ZAR | Define your own currency. If blank or left out, EUR will be used by API. |
| `symbols` | see above, values written in array, separated by comma | Define currencies you would like to see. If blank or left out, all currencies are pulled. |
