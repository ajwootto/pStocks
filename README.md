pStocks
=======

This is a simple stock-price monitoring applications for Android and Pebble Smart Watch. It allows you to enter a stock symbol to track, and keeps you up to date on its price throughout the day on both your smartphone and smartwatch screen.

The back-end server is written in Node.js and uses the Yahoo Query Language API to gather financial data. When new data is received, an update notification is sent to the Android app using Google Cloud Messaging, which then POSTs back to the server to receive the updated stock price. 

###Client-Side###

Victor Vucicevich simultaneously wrote this client as well as [Trend-WATCHer](https://github.com/nmost/trend-WATCHer) on android.

This is simply a prototype client, which takes the data sent to the phone by the server and displays it while sending that same data to a Pebble Smart Watch.

Due to the Pebble SDK not being made publicly available, there is a simple "SendStocksToPebble" function that would, in theory, send the data string to the watch.

