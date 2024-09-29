import * as moment from 'moment-timezone';

export const DEFAULT_TIMEZONE = 'Asia/Tokyo';

export const SECOND = 1;
export const MINUTE = 60 * SECOND;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;

export const MILLISECONDS = {
  SECOND: 1000,
  MINUTE: SECOND * 60,
  HOUR: MINUTE * 60,
  DAY: HOUR * 24,
};

export function serverTimeZone() {
  return moment.tz.guess();
}

export function now(tz = null) {
  if (tz) {
    return moment().tz(DEFAULT_TIMEZONE).unix() * 1000;
  }

  return moment().unix() * 1000;
}

export function dateToUnix(date, timeZone = DEFAULT_TIMEZONE) {
  const unix = moment(date).tz(timeZone).unix() * 1000;
  return unix;
}

export function changeDateTimezone(date, timeZone = DEFAULT_TIMEZONE) {
  const ms = moment(date).tz(timeZone, true).unix() * 1000;
  return ms;
}

export function addTimeToUnixTimeStamp(
  unixTimeStamp,
  unitValue,
  unit = 'hours',
) {
  return moment(unixTimeStamp * 1000)
    .add(unitValue, unit)
    .unix();
}
export function startOf(unitOfTime, timeZone = DEFAULT_TIMEZONE) {
  return moment().tz(timeZone).startOf(unitOfTime).unix() * 1000;
}
export function endOf(unitOfTime, timeZone = DEFAULT_TIMEZONE) {
  return moment().tz(timeZone).endOf(unitOfTime).unix() * 1000;
}
export function startOfFormatted(unitOfTime, format = 'YYYY/MM/DD HH:mm:ss') {
  return moment().startOf(unitOfTime).format(format);
}
export function endOfFormatted(unitOfTime, format = 'YYYY/MM/DD HH:mm:ss') {
  return moment().endOf(unitOfTime).format(format);
}
export function startOfTime(timestamp, unitOfTime) {
  return moment(timestamp).startOf(unitOfTime).unix() * 1000;
}
export function startOfToday(
  timeZone = DEFAULT_TIMEZONE,
  format = 'YYYY/MM/DD HH:mm:ss',
) {
  return moment().tz(timeZone).startOf('day').format(format);
}
export function endOfToday(
  timeZone = DEFAULT_TIMEZONE,
  format = 'YYYY/MM/DD HH:mm:ss',
) {
  return moment().tz(timeZone).endOf('day').format(format);
}

export function formatTsToReadable(
  date,
  timeZone = DEFAULT_TIMEZONE,
  format = 'YYYY/MM/DD HH:mm:ss',
) {
  return moment(date, 'x').tz(timeZone).format(format);
}

// Without changing date and time only timeZone change
export function formatTsToReadableTz(
  date = new Date(),
  timeZone = DEFAULT_TIMEZONE,
  format = 'YYYY/MM/DD HH:mm:ss',
) {
  return moment(date, 'x').tz(timeZone, true).format(format);
}

export function isValidDate(date) {
  return moment(date).isValid();
}

export function startOfCustomTime(
  timestamp,
  unitOfTime,
  timeZone = DEFAULT_TIMEZONE,
) {
  return moment(timestamp).tz(timeZone).startOf(unitOfTime).unix() * 1000;
}
export function endOfCustomTime(
  timestamp,
  unitOfTime,
  timeZone = DEFAULT_TIMEZONE,
) {
  return moment(timestamp).tz(timeZone).endOf(unitOfTime).unix() * 1000;
}

export const getHalfHourInterval = (time) => {
  time = moment(time);
  const minutes = time.minutes();
  let startTime;
  let endTime;
  if (minutes >= 0 && minutes < 30) {
    startTime = moment(time).set('minute', 0).set('second', 0);
    endTime = moment(time).set('minute', 30).set('second', 59);
  } else {
    startTime = moment(time).set('minute', 31).set('second', 0);
    endTime = moment(time).set('minute', 59).set('second', 59);
  }
  const finalObj = {
    startTime: startTime.unix() * 1000,
    endTime: endTime.unix() * 1000,
  };
  return finalObj;
};

// export const getDateRange = (lastSyncTime) => {
//   let startDate;
//   let endDate;

//   let currentMinutes = moment(lastSyncTime).tz(DEFAULT_TIMEZONE).minutes();
//   if (currentMinutes >= 0 && currentMinutes < 30) {
//     startDate = moment(lastSyncTime)
//       .tz(DEFAULT_TIMEZONE)
//       .subtract(1, 'hour')
//       .format('YYYY-MM-DD HH:30');
//   } else {
//     startDate = moment(lastSyncTime)
//       .tz(DEFAULT_TIMEZONE)
//       .format('YYYY-MM-DD HH:00');
//   }
//   let startMs = moment(startDate).unix() * 1000;
//   console.log('start time', startMs);
//   endDate = moment(startMs)
//     .tz(DEFAULT_TIMEZONE)
//     .add(30, 'minutes')
//     .format('YYYY-MM-DD HH:mm');
//   console.log(endDate);

//   console.log({ startDate, endDate });
//   return {
//     startDate: moment(startDate).format('YYYY-MM-DD%20HH:mm'),
//     endDate: moment(endDate).format('YYYY-MM-DD%20HH:mm'),
//   };
// };

export const getDates = (lastSyncDate, endDate) => {
  const FORMAT = 'YYYY-MM-DD%20HH:mm';
  let startDate;
  if (!lastSyncDate) {
    startDate = moment(lastSyncDate).tz(DEFAULT_TIMEZONE).startOf('day');
  } else {
    startDate = moment(lastSyncDate).tz(DEFAULT_TIMEZONE);
  }
  // if minutes in end date is multiple of 10, then we will reduce the one minute so that it'll fetch data 10 min prior to avoid skipping
  if (moment(startDate).tz(DEFAULT_TIMEZONE).minutes() % 10 === 0) {
    endDate = moment(endDate).tz(DEFAULT_TIMEZONE).subtract(1, 'minute');
  }
  return {
    startDate: startDate.format(FORMAT),
    endDate: endDate.format(FORMAT),
    endDateRaw: dateToUnix(endDate),
  };
};
const FORMAT_CRON = 'YYYY-MM-DD%20HH:mm';
export const getStartForCron = (lastSyncDate) => {
  let startDate;
  if (!lastSyncDate) {
    startDate = moment().tz(DEFAULT_TIMEZONE).startOf('day');
  } else {
    startDate = moment(lastSyncDate).tz(DEFAULT_TIMEZONE);
    const startDateMinutes = moment(lastSyncDate)
      .tz(DEFAULT_TIMEZONE)
      .minutes();
    if (startDateMinutes % 10 !== 0) {
      // Subtracting 1 miniute not using moment().subtract becuse it is not subtracting
      startDate = startDate - 60000;
    }
  }
  return {
    time: startDate,
    formated: moment(startDate).tz(DEFAULT_TIMEZONE).format(FORMAT_CRON),
  };
};
export const getEndDateForCron = () => {
  let endTime = now(DEFAULT_TIMEZONE);
  const endMiniutes = moment(endTime).tz(DEFAULT_TIMEZONE).minutes();
  // if minutes in end date is multiple of 10, then we will reduce the one minute so that it'll fetch data 10 min prior to avoid skipping
  if (endMiniutes % 10 !== 0) {
    // Subtracting 1 miniute not using moment().subtract becuse it is not subtracting
    endTime = endTime - 60000;
  }
  return {
    time: endTime,
    formated: moment(endTime).tz(DEFAULT_TIMEZONE).format(FORMAT_CRON),
  };
};

export const checkValidAndConvertUnix = (date = null) => {
  const validDate = moment(date, 'DD/MM/YYYY').isValid();
  if (validDate) {
    return moment(date, 'DD/MM/YYYY').unix() * 1000;
  } else {
    return null;
  }
};

export const timeWithInterval = ({ ts, unitValue = 1 }) => {
  if (
    moment(ts)
      .tz(DEFAULT_TIMEZONE)
      .isAfter(moment().tz(DEFAULT_TIMEZONE).subtract(unitValue, 'hours'))
  ) {
    return true;
  }
  return false;
};
