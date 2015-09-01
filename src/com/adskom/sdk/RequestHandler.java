package com.adskom.sdk;

import java.io.IOException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;

import org.apache.http.HttpResponse;
import org.apache.http.StatusLine;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.util.EntityUtils;
import org.json.JSONObject;

import android.os.AsyncTask;
import android.util.Log;

public class RequestHandler extends AsyncTask<String, Boolean, String> {
	private HttpClient client;
	private HttpPost post;
	private HttpGet get;
	private HttpResponse response;
	private String result = "";
	private String url;
	private JSONObject data;
	private long timeOut = 30000;

	public RequestHandler() {
		client = new DefaultHttpClient();
	}

	@Override
	protected String doInBackground(String... params) {
		return result = this.submitPostData(url, data);
	}

	public String postData(String url, JSONObject data) {
		this.url = url;
		this.data = data;
		try {
			this.execute().get(timeOut, TimeUnit.MILLISECONDS);
		} catch (InterruptedException e) {
			Log.e("ERROR", e.getMessage());
		} catch (ExecutionException e) {
			Log.e("ERROR", e.getMessage());
		} catch (TimeoutException e) {
			Log.e("ERROR", "TIMEOUT");
		}
		return result;
	}

	public String submitPostData(String url, JSONObject data) {
		post = new HttpPost(url);
		try {
			StringEntity se = new StringEntity(data.toString());
			post.setEntity(se);
			post.setHeader("Accept", "application/json");
			post.setHeader("Content-type", "application/json");
			response = client.execute(post);
			int statusCode = response.getStatusLine().getStatusCode();
			if (statusCode == 200) {
				result = EntityUtils.toString(response.getEntity());
				Log.d("POST", result);
			} else {
				result = "Status code : " + statusCode;
				Log.e("POST", "Fail to get data");
			}					
		} catch (ClientProtocolException e) {
			Log.e("GET ERROR CLIENT PROTOCOL", e.getMessage());
		} catch (IOException e) {
			Log.e("GET IOException", e.getMessage());
		}		
		return result;
	}

	public String getData(String url) {
		get = new HttpGet(url);

		try {
			response = client.execute(get);
			StatusLine statusLine = response.getStatusLine();
			int statusCode = statusLine.getStatusCode();
			if (statusCode == 200) {
				result = EntityUtils.toString(response.getEntity());
				Log.e("GET", result);
			} else {
				result = "";
				Log.e("GET", "Fail to get data");
			}
		} catch (ClientProtocolException e) {
			Log.e("GET ERROR CLIENT PROTOCOL", e.getMessage());
		} catch (IOException e) {
			Log.e("GET IOException", e.getMessage());
		}

		return result;
	}
}
