package com.pebble.Stocks;

import static com.pebble.Stocks.CommonUtilities.DISPLAY_MESSAGE_ACTION;
import static com.pebble.Stocks.CommonUtilities.SENDER_ID;
import static com.pebble.Stocks.CommonUtilities.SERVER_URL;

import java.util.HashMap;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.Menu;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.animation.Animation;
import android.view.animation.Animation.AnimationListener;
import android.view.animation.AnimationUtils;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.google.android.gcm.GCMRegistrar;
import com.pebble.Web.AsyncHttpPost;

public class PebbleStockMain extends Activity implements OnClickListener {

	TextView mDisplay;
	AsyncTask<Void, Void, Void> mRegisterTask;
	SharedPreferences prefs;
	String genId;
	Context c;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main_layout);

		//Get the generated ID from the server that should be saved to the device. If its blank, we will register and generate one.
		prefs = PreferenceManager.getDefaultSharedPreferences(this);
		genId = prefs.getString("genId", "");
		c = this;
		
		//Watch the "start" button.
		((Button) findViewById(R.id.button_update)).setOnClickListener(this);

		checkNotNull(SERVER_URL, "SERVER_URL");
		checkNotNull(SENDER_ID, "SENDER_ID");
		// Make sure the device has the proper dependencies.
		GCMRegistrar.checkDevice(this);
		// Make sure the manifest was properly set - comment out this line
		// while developing the app, then uncomment it when it's ready.
		GCMRegistrar.checkManifest(this);
		// mDisplay = (TextView) findViewById(R.id.display);
		registerReceiver(mHandleMessageReceiver, new IntentFilter(
				DISPLAY_MESSAGE_ACTION));
		final String regId = GCMRegistrar.getRegistrationId(this);
		if (regId.equals("")) {
			// Automatically registers application on startup.
			GCMRegistrar.register(this, SENDER_ID);
		} else {
			// Device is already registered on GCM, check server.
			if (GCMRegistrar.isRegisteredOnServer(this)) {
				// Skips registration.
				// mDisplay.append(getString(R.string.already_registered) +
				// "\n");
			} else {
				// Try to register again, but not in the UI thread.
				// It's also necessary to cancel the thread onDestroy(),
				// hence the use of AsyncTask instead of a raw thread.
				final Context context = this;
				mRegisterTask = new AsyncTask<Void, Void, Void>() {

					@Override
					protected Void doInBackground(Void... params) {
						boolean registered = ServerUtilities.register(context,
								regId, genId);
						// At this point all attempts to register with the app
						// server failed, so we need to unregister the device
						// from GCM - the app will try to register again when
						// it is restarted. Note that GCM will send an
						// unregistered callback upon completion, but
						// GCMIntentService.onUnregistered() will ignore it.
						if (!registered) {
							GCMRegistrar.unregister(context);
						}
						return null;
					}

					@Override
					protected void onPostExecute(Void result) {
						mRegisterTask = null;
					}

				};
				mRegisterTask.execute(null, null, null);
			}

		}

		//Turn off the arrows.
		switchArrows(0);

		
		//That fancy dancy pointless splashscreen.
		final ImageView myImageView = (ImageView) findViewById(R.id.splash);
		myImageView.setVisibility(View.VISIBLE);
		Animation myFadeInAnimation = AnimationUtils.loadAnimation(this,
				R.anim.fadeout);
		myImageView.startAnimation(myFadeInAnimation); // Set animation to your
														// ImageView
		myFadeInAnimation.setAnimationListener(new AnimationListener() {

			@Override
			public void onAnimationStart(Animation arg0) {
				// TODO Auto-generated method stub

			}

			@Override
			public void onAnimationRepeat(Animation arg0) {
				// TODO Auto-generated method stub

			}

			
			//Just get rid of it otherwise it pops back up.
			@Override
			public void onAnimationEnd(Animation arg0) {
				myImageView.setVisibility(View.GONE);
			}
		});

	}

	public void sendStockstoPebble(String results) {
		
		//So I'm not actually sure where my broadcast is going. As far as I know, its directly to my GCM broadcastreceiver. Which is wrong, but I can't test it with the SDK :C
		
		final Intent i = new Intent("com.getpebble.action.SEND_DATA");
		i.putExtra("sender", "pStocks");
		i.putExtra("recipient", "pebbleStocks");
		i.putExtra("data", results);
		sendBroadcast(i);
		
	}

	//get rid of receivers.
	@Override
	protected void onDestroy() {
		if (mRegisterTask != null) {
			mRegisterTask.cancel(true);
		}
		unregisterReceiver(mHandleMessageReceiver);
		GCMRegistrar.onDestroy(this);
		super.onDestroy();
	}

	private void checkNotNull(Object reference, String name) {
		if (reference == null) {
			throw new NullPointerException("error thing" + name);
		}
	}

	
	//If we got registered, store the generated Id
	public void registered(String newgenId) {
		SharedPreferences.Editor editor = prefs.edit();
		genId = newgenId;
		editor.putString("genId", genId);
		editor.commit();

	}

	
	//Huge class just to change arrow visibilites.
	//Generally Id do it as one imageview, but this was faster to write.
	public void switchArrows(int i) {
		((ImageView) findViewById(R.id.arrowdown)).setVisibility(View.GONE);
		((ImageView) findViewById(R.id.arrowup)).setVisibility(View.GONE);
		switch (i) {
		case 0:
			((ImageView) findViewById(R.id.arrowdown)).setVisibility(View.GONE);
			((ImageView) findViewById(R.id.arrowup)).setVisibility(View.GONE);

			break;
		case 1:
			((ImageView) findViewById(R.id.arrowdown))
					.setVisibility(View.VISIBLE);

			break;
		case 2:
			((ImageView) findViewById(R.id.arrowup))
					.setVisibility(View.VISIBLE);
			break;
		default:
			((ImageView) findViewById(R.id.arrowdown)).setVisibility(View.GONE);
			((ImageView) findViewById(R.id.arrowup)).setVisibility(View.GONE);
			break;
		}
	}

	//yay!
	
	//So this will automatically run every update the server gets for that stock.
	
	//Of course, it will just return closing rates when the market is closed.
	public void UpdateStocks() {

		
		//Need to send the generated Id to the server each time.
		HashMap<String, String> data = new HashMap<String, String>();
		data.put("genId", genId);

		
		//Asynctask sending so we don't clog up the main thread.
		AsyncHttpPost asyncHttpPost = new AsyncHttpPost(data) {
			
			//Got it back!
			@Override
			protected void onPostExecute(String result) {

				try {
					JSONObject stock = new JSONObject(result);

					String price = stock.getString("price");
					if (price == null || price == "" || price == "null") {
						price = "Not Available";
					}

					String change = stock.getString("change");

					if (change.contains("+")) {
						switchArrows(2);
					} else if (change.contains("-")) {
						switchArrows(1);
					} else {
						switchArrows(0);
					}
					
					if (change == null || change == "" || change == "null") {
						change = "Not Available";
					}

					String percent = stock.getString("percent");
					
					if (price == null || percent == "" || percent == "null") {
						percent = "Not Available";
					}

					//Set the textviews to display the proper data.
					((TextView) findViewById(R.id.price)).setText(price);
					((TextView) findViewById(R.id.change)).setText(change);
					((TextView) findViewById(R.id.percent_change))
							.setText(percent);

				} catch (JSONException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

				try {
					sendStockstoPebble(result);
				} catch (Exception e) {
					// nada
				}

			};
		};
		asyncHttpPost.execute("http://pebble-stocks.herokuapp.com/updateStock");

	}

	//This is the broadcastreceiver. Technically, it would handle the watch broadcasts as well. I just don't have anything handling that right now.
	
	//Id check if we had an intent with an extra called "pebblemessage" then launch that side of the code if there was.
	private final BroadcastReceiver mHandleMessageReceiver = new BroadcastReceiver() {
		@Override
		public void onReceive(Context context, Intent intent) {
			String newMessage = intent.getExtras().getString("message");
			if (newMessage.contains("update")) {
				UpdateStocks();
				// Toast.makeText(c, "UPDATE", Toast.LENGTH_SHORT).show();
			} else if (!newMessage.contains("nothing")
					&& !newMessage.contains("register")
					&& !newMessage.contains("REGISTERED")) {
				// Toast.makeText(context, newMessage,
				// Toast.LENGTH_LONG).show();
				registered(newMessage);
			}
			// mDisplay.append("YAY!" + "\n");
		}
	};

	
	//Hitting the button.
	@Override
	public void onClick(View v) {

		//Quickly checking for a valid ticker name and making it upper case
		if (v.getId() == R.id.button_update && genId != null && genId != "") {
			final String name = ((EditText) findViewById(R.id.main_editText_stockTicker))
					.getText().toString().toUpperCase();
			if (name.length() <= 4 && name != "" && name != null
					&& name.length() > 0) {
				((EditText) findViewById(R.id.main_editText_stockTicker))
						.setText("");
				
				
				//We do this because if you enter like, "Q" its not actually a stock name, so the old data would persist while showing "Q".
	

				
				
					//Force down keyboard when you hit start
				InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
				imm.hideSoftInputFromWindow(
						((EditText) findViewById(R.id.main_editText_stockTicker))
								.getWindowToken(), 0);

				//Add the request params
				HashMap<String, String> data = new HashMap<String, String>();
				data.put("genId", genId);
				data.put("tickerName", name);

				//Post it!
				AsyncHttpPost asyncHttpPost = new AsyncHttpPost(data) {
					@Override
					protected void onPostExecute(String result) {
						if (result.contains("success")) {
							//Yay
							((TextView) findViewById(R.id.price)).setText("Loading..");
							((TextView) findViewById(R.id.change)).setText("Loading..");
							((TextView) findViewById(R.id.percent_change))
									.setText("Loading..");
						}
						//Update the values now.
						UpdateStocks();
						((TextView) findViewById(R.id.main_textview_tickername))
								.setText(name);
					};
				};
				asyncHttpPost
						.execute("http://pebble-stocks.herokuapp.com/update");
			} else {
				
				//Come on ya joker
				Toast.makeText(c, "Please enter a valid company symbol",
						Toast.LENGTH_SHORT).show();
			}
		}
	}

}
