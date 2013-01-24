pStocks
=======

This is a simple stock-price monitoring applications for Android and Pebble Smart Watch. It allows you to enter a stock symbol to track, and keeps you up to date on its price throughout the day on both your smartphone and smartwatch screen.

The back-end server is written in Node.js and uses the Yahoo Query Language API to gather financial data. When new data is received, an update notification is sent to the Android app using Google Cloud Messaging, which then POSTs back to the server to receive the updated stock price. 


###Client-Side###

Victor Vucicevich simultaneously wrote this client as well as [Trend-WATCHer](https://github.com/nmost/trend-WATCHer) on android.

This is simply a prototype client, which takes the data sent to the phone by the server and displays it while sending that same data to a Pebble Smart Watch.

Due to the Pebble SDK not being made publicly available, there is a simple "SendStocksToPebble" function that would, in theory, send the data string to the watch.

###Server-Side###
Adam Wootton wrote the server-side in Node.js. It uses Express.js, as well as MongoDB for data storage. 

####Loading in Eclipse####

If you find yourself having troubles with: "[2013-01-24 01:52:00 - PebbleStockMain] Conversion to Dalvik format failed with error 1"

Then go to Project properties > build path, click on Referenced Libraries, and then remove.
Then project > clean.

You may have an issue where the gcm library got deleted (it should not have been). But if it was, you'll have to go download it.

Also, your ADT needs to have Extras > Google Cloud Messaging.


[An example of what the Pebble side would look like](http://i.imgur.com/EYl505w.jpg )     
