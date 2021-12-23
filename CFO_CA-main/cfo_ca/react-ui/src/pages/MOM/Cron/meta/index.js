import Minutes from '../cron-tab/minutes';
import Daily from '../cron-tab/daily';
import Hourly from '../cron-tab/hourly';
import Weekly from '../cron-tab/weekly';
import Monthly from '../cron-tab/monthly';
export var HEADER = {
  // MINUTES: 'MINUTES',
  // HOURLY: 'HOURLY',
  // DAILY: 'DAILY',
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY'
};
var HEADER_VALUES = {
  // MINUTES: 'Minutes',
  // HOURLY: 'Hourly',
  // DAILY: 'Daily',
  WEEKLY: 'Weekly', 
  MONTHLY: 'Monthly'
};
var defaultTabs = [HEADER_VALUES.MONTHLY,HEADER_VALUES.WEEKLY];
export var metadata = [
  // {
  //   component: Minutes,
  //   initialCron: ['0', '0/1', '*', '*', '*', '?', '*']
  // }, {
  //   component: Hourly,
  //   initialCron: ['0', '0', '00', '1/1', '*', '?', '*']
  // }, {
  //   component: Daily,
  //   initialCron: ['0', '0', '00', '1/1', '*', '?', '*']
  // },
  {
    component: Weekly,
    initialCron: ['0', '0', '00', '?', '*', '*', '*']
  }, {
    component: Monthly,
    initialCron: ['0', '0', '00', '1', '1/1', '?', '*']
  }];

var validateHeaders = function validateHeaders(headers) {
  var validatedHeaders = [];
  headers.forEach(function (header) {
    if (!HEADER_VALUES[header]) {
      throw new Error('Invalid header ' + header); // Avoid duplicates
    } else if (validatedHeaders.indexOf(HEADER_VALUES[header]) === -1) {
      validatedHeaders.push(HEADER_VALUES[header]);
    }
  });
  return validatedHeaders;
};
/**
 * Validate and load headers
 * @param {*} options 
 */


export var loadHeaders = function loadHeaders(options) {
  if (options) {
    if (options.headers) {
      if (!options.headers.length) {
        throw new Error('Atleast one header is required.');
      }

      return validateHeaders(options.headers);
    }
  }

  return defaultTabs;
};