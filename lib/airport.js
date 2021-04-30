/**
 * Scanning WiFis on Mac OS X
 * Created by kc on 04.04.16.
 */

const tool    = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport';
const cmdLine = tool + ' -s';
const detector = tool + ' -getInfo';

const macRegex = /([0-9a-zA-Z]{1}[0-9a-zA-Z]{1}[:]{1}){5}[0-9a-zA-Z]{1}[0-9a-zA-Z]{1}/;
/**
 * Parsing the output of airport (Mac OS X)
 * @param str output of the tool
 * @param callback
 */
function parseOutput(str, callback) {
  var err = null;

  try {
    var lines      = str.split('\n');
    var wifis = [];
    for (var i = 1, l = lines.length; i < l; i++) {
      var mac = lines[i].match(macRegex);
      if (!mac) {
        continue;
      }
      var macStart = lines[i].indexOf(mac[0]);
      var elements = lines[i].substr(macStart).split(/[ ]+/);
      var channelWidth = 0;
      if (Math.abs(parseInt(elements[2].split(',')[1])) === 1){
        channelWidth = 1
      }
      wifis.push({
        'ssid'    : lines[i].substr(0, macStart).trim(),
        'macAddress'     : elements[0].trim(),
        'channel' : parseInt(elements[2].split(',')[0]),
        'rssi'    : parseInt(elements[1].trim(), 10),
        'channelWidth'    : Math.abs(channelWidth),
        'connected' : false,
      });
    }
  }
  catch (ex) {
    err = ex;
  }

  callback(err, wifis);
}


module.exports = {
  parseOutput: parseOutput,
  cmdLine    : cmdLine,
  detector   : detector,
  tool       : tool
};
