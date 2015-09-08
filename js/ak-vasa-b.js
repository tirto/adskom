if (typeof ADSKOM === "undefined" || !ADSKOM) {
	ADSKOM = {};
}
ADSKOM.vasa = ADSKOM.vasa || {};

ADSKOM.vasa.Beaconer = function(old_opts) {
	function initConf (old_opts) {
		old_opts = old_opts || {};
		if (old_opts instanceof Array) {
			// Need to clarify how this is done.
			old_opts = old_opts[0];
		}
		var rv = {
			url : old_opts.url || '//ava.adskom.com/events/b/',
			account : old_opts.account || -1,
			hashed_email : old_opts.hashed_email || -1,
			site_type : old_opts.site_type || -1,
			event_type : old_opts.event_type || -1,
			ref_url : old_opts.ref_url || document.referrer,
			payload : old_opts.payload || {},
			error : old_opts.error || function() {},
			success : old_opts.success || function() {}
		};
		return rv;
	}

	var opts = initConf(old_opts);

	function getXHR() {
		var factories = [
		function () {
			return new XMLHttpRequest();
		},
		function () {
			return new ActiveXObject("Msxml2.XMLHTTP");
		},
		function () {
			return new ActiveXObject("Msxml3.XMLHTTP");
		},
		function () {
			return new ActiveXObject("Microsoft.XMLHTTP");
		}
		];

		function createXMLHTTPObject() {
			var xmlhttp = false;
			var len = factories.length;
			for (var i = 0; i < len; i++) {
				try {
					xmlhttp = factories[i]();
				} catch (e) {
					continue;
				}
				break;
			}
			return xmlhttp;
		}
		return createXMLHTTPObject();
	}

	function getBeaconUri() {
		return opts.url;
	}

	function sendBeacon(payload) {
		var xhr = getXHR(),
		url = getBeaconUri();
		xhr.open('POST', url, true);
		xhr.withCredentials = true;
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		xhr.send(payload);
		xhr.onreadystatechange = function() {
			if (xhr.readyState === 4) {
				if (xhr.status >= 200 && xhr.status < 300) {
					opts.success();
					// trigger cookie sync after successfully push data to beacon server to prevent race condition.
          cDXCSync();
				}
				else {
					opts.error();
				}
			}
		}
	}

  // DataXu cookie sync
	function cDXCSync(){
		var ckSync = document.createElement('img');
		ckSync.src = "http://i.w55c.net/ping_match.gif?st=ADSKOM&rurl=http%3A%2F%2Fssp.adskom.com%2Fcookie%2Fsync%3Fdataxu%3D_wfivefivec_";
		ckSync.width="0";
		ckSync.height="0";
		ckSync.alt="";
		ckSync.style="width: 0px; height: 0px;display: none;"

		var parent = document.getElementsByTagName('head')[0] || document.getElementsByTagName('body');
		parent.appendChild(ckSync);
	}

	function buildPayload() {
		var payload = {
			account: opts.account,
			event_type: opts.event_type,
			ref_url: opts.ref_url,
			site_type: opts.site_type,
			hashed_email: opts.hashed_email,
			payload: opts.payload
		};
		var rv = '';
		// TODO: Need to fix for ie8
		if (typeof JSON === 'object' && JSON.stringify) {
			rv = JSON.stringify(payload);
		}
		return rv;
	}

	return {
		sendEvent: function() {
			var payload = buildPayload();
			sendBeacon(payload);
		}
	}
};

if (!window.Adskom_r || window.Adskom_r instanceof Array) {

	var __current_url = window.location.href;
	var b = ADSKOM.vasa.Beaconer(window.Adskom_r);

	b.sendEvent();

}
