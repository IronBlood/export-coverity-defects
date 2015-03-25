#!/usr/local/bin/node

var CONFIG_PROJECTID=0,				// IMPORTANT: change to your project ID
	CONFIG_SESSIONID='';			// IMPORTANT: change to your session ID, get this from the developer tools in your browser

var jf = require('jsonfile'),
	fs = require('fs'),
	https = require('https');

var json_file = process.argv[2],
	csv_file = process.argv[3];

fs.writeFile(csv_file, "cid, status, displayFunction, displayFile, lineNumber, firstDetected, lastDetected, lastFixed, displayComponent, displayImpact, displayCategory, displayType, description\n", function(err, data) {
	if (err) {
		return console.log(err);
	}
});

jf.readFile(json_file, function(err, obj) {
	obj.resultSet.results.forEach(function(item) {
		var url = '/sourcebrowser/source.json?projectId=' + CONFIG_PROJECTID;
		url += "&fileInstanceId=" + item.fileInstanceId;
		url += "&defectInstanceId=" + item.lastDefectInstanceId;
		url += "&mergedDefectId=" + item.cid;

		var options = {
			hostname: 'scan4.coverity.com',
			port: 443,
			path: url,
			method: 'GET',
			keepAlive: true,
			headers: {
				'Referer': 'https://scan4.coverity.com/reports.htm',
				'Cookie': 'COVJSESSIONID8080LO=' + CONFIG_SESSIONID + '; COV_SCAN_NO_SHOW_WIZ=true'
			}
		};

		var req = https.request(options, function(res) {
			var res_buf = [];

			res.on('data', function(chunked) {
				res_buf.push(chunked);
			});

			res.on('end', function() {
				var res_obj = JSON.parse(res_buf.join(''));
				var issue_item = item,
					l = res_obj.defects.length,
					defect_item;

				for(var i=0; i<l; i++) {
					defect_item = res_obj.defects[i];
					if(issue_item.cid != defect_item.ids.cid) {
						continue;
					} else {
						fs.appendFile(csv_file, issue_item.cid + ", " + issue_item.status + ", " + issue_item.displayFunction + ", " + issue_item.displayFile + ", " + defect_item.mainEvent.lineNumber + ", " + issue_item.firstDetected + ", " + issue_item.lastDetected + ", " + issue_item.lastFixed + ", " + issue_item.displayComponent + ", " + issue_item.displayImpact + ", " + issue_item.displayCategory + ", " + issue_item.displayType + defect_item.mainEvent.description + '\n', function() {
							console.log(issue_item.cid + " added successfully!");
						});
					}
				}
			});
		});
		req.end();
	});
});
