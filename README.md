pStocks
=======

This is a simple stock-price monitoring applications for Android and Pebble Smart Watch. It allows you to enter a stock symbol to track, and keeps you up to date on its price throughout the day on both your smartphone and smartwatch screen.

The back-end server is written in Node.js and uses the Yahoo Query Language API to gather financial data. When new data is received, an update notification is sent to the Android app using Google Cloud Messaging, which then POSTs back to the server to receive the updated stock price. 

