package com.adskom.sdk;

public class Adskom {	
	
	public static String track(int account, String event){
		Tracker track = new Tracker();
		track.setAccount(account);
		track.setEventName(event);
		return track.submit();		
	}

}
