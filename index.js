var express = require('express');
var app = express();
//App Start
var prices = require('./price.json')["Time Series (Daily)"];
var i = 0;
//Use a temp obj to calcute when we push best profits times to timesToBuy 
var tempObj = {
  'min': 0,
  'max': 0,
  'minCounter': 0,
  'minDate': "",
  'maxDate': "",
  'cycle': false
}
var timesToBuy = []
//Order prices Asc and loop through it
Object.keys(prices).sort().forEach(function (key) {
  //accept record[0] as min value 
  var nextPrice = parseFloat(prices[key]['4. close'])
  if (i !== 0) {
    //when we dont have min & max in tempObj 
    if (!(tempObj.cycle)) {
      if (tempObj.min < nextPrice) {
        tempObj.max = nextPrice
        tempObj.maxDate = key
        tempObj.cycle = true
      } else {
        tempObj.minDate = key
        tempObj.min = nextPrice
        tempObj.minCounter = i
      }
    } else {
      //if we have min & max the tempObj.cycle will be true and we loop through prices to find best max 
      if (tempObj.max < nextPrice) {
        tempObj.max = nextPrice
        tempObj.maxDate = key
      } else {
        //after finding best max price we push the values to main array and let min value be next value (that is < correct max value)
        timesToBuy.push({
          'BuyDate': tempObj.minDate,
          'BuyPrice': tempObj.min,
          'SellDate': tempObj.maxDate,
          'SellPrice': tempObj.max,
          'Profit': tempObj.max - tempObj.min,
          'WaitDays': (i - tempObj.minCounter) - 1
        })
        tempObj.cycle = false;
        tempObj.min = nextPrice
        tempObj.max = 0
        tempObj.minCounter = i
        tempObj.maxDate = ""
        tempObj.minDate = key
      }
    }
  } else {
    tempObj.min = nextPrice
    console.log(nextPrice)
    //counter to get days between two prices
    tempObj.minCounter = i
  }
  i++
});
//App Ends
app.get('/', function (req, res) {
  res.send(timesToBuy);
});

app.listen(3000, function () {
  console.log('App Started on port 3000!');
});