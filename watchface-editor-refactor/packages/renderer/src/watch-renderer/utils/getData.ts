function getHour(data: number, hasData: boolean, config: RuntimeConfigData) {
  return hasData
    ? data + (config.timeMinute || 0) / 60
    : new Date().getHours() + new Date().getMinutes() / 60;
}

function getMinute(data: number, hasData: boolean, config: RuntimeConfigData) {
  return hasData
    ? data + (config.timeSecond || 0) / 60
    : new Date().getMinutes() + new Date().getSeconds() / 60;
}

function getSecond(data: number, hasData: boolean) {
  return hasData ? data : new Date().getSeconds();
}

function getWeek(data: number, hasData: boolean) {
  return hasData ? data : new Date().getDay();
}

function getDay(data: number, hasData: boolean) {
  return hasData ? data : new Date().getDate();
}

function getMonth(data: number, hasData: boolean) {
  return hasData ? data : new Date().getMonth() + 1;
}

function getYear(data: number, hasData: boolean) {
  return hasData ? data : new Date().getFullYear();
}
function getCentiSecond(data: number, hasData: boolean) {
  return hasData ? data : Date.now() % 100;
}

// 获取个位数
function getLow(num: number): number {
  return num % 10;
}
// 获取十位数
function getTen(num: number): number {
  return ((num / 10) | 0) % 10;
}
// 获取百分位数
function getHundred(num: number): number {
  return ((num / 100) | 0) % 10;
}
// 获取千分位数
function getThousand(num: number): number {
  return ((num / 1000) | 0) % 10;
}

export default function (source: WatchSource, runtime: Runtime): number {
  const config = runtime.configData;
  const data = config[source] as number;
  const hasData = data !== undefined;

  switch (source) {
    // 时间类型数据
    case 'timeHour':
      return getHour(data, hasData, config);
    case 'timeHourLow': {
      //小时个位数
      const data = config.timeHour as number;
      const hasData = data !== undefined;
      return getLow(getHour(data, hasData, config) | 0);
    }

    case 'timeHourHigh': {
      //小时十位数
      const data = config.timeHour as number;
      const hasData = data !== undefined;
      return getTen(getHour(data, hasData, config) | 0);
    }

    case 'timeMinute':
      return getMinute(data, hasData, config);
    case 'timeMinuteLow': {
      const data = config.timeMinute as number;
      const hasData = data !== undefined;
      return getLow(getMinute(data, hasData, config) | 0);
    }
    case 'timeMinuteHigh': {
      const data = config.timeMinute as number;
      const hasData = data !== undefined;
      return getTen(getMinute(data, hasData, config) | 0);
    }

    case 'timeSecond':
      return getSecond(data, hasData);
    case 'timeSecondLow': {
      const data = config.timeSecond as number;
      const hasData = data !== undefined;
      return getLow(getSecond(data, hasData));
    }
    case 'timeSecondHigh': {
      const data = config.timeSecond as number;
      const hasData = data !== undefined;
      return getTen(getSecond(data, hasData));
    }
    case 'timeCentiSecond':
      return getCentiSecond(data, hasData);
    case 'timeCentiSecondLow': {
      const data = config.timeCentiSecond as number;
      const hasData = data !== undefined;
      return getLow(getCentiSecond(data, hasData));
    }

    case 'timeCentiSecondHigh': {
      const data = config.timeCentiSecond as number;
      const hasData = data !== undefined;
      return getTen(getCentiSecond(data, hasData));
    }

    case 'dateWeek':
      return getWeek(data, hasData);
    case 'dateDay':
      return getDay(data, hasData);
    case 'dateDayLow': {
      const data = config.dateDay as number;
      const hasData = data !== undefined;
      return getLow(getDay(data, hasData));
    }

    case 'dateDayHigh': {
      const data = config.dateDay as number;
      const hasData = data !== undefined;
      return getTen(getDay(data, hasData));
    }

    case 'dateMonth':
      return getMonth(data, hasData);
    case 'dateLunarDay':
      return getDay(data, hasData);
    case 'dateLunarMonth':
      return getMonth(data, hasData);
    case 'dateMonthLow': {
      const data = config.dateMonth as number;
      const hasData = data !== undefined;
      return getLow(getMonth(data, hasData));
    }

    case 'dateMonthHigh': {
      const data = config.dateMonth as number;
      const hasData = data !== undefined;
      return getTen(getMonth(data, hasData));
    }

    case 'dateYear':
      return getYear(data, hasData);
    case 'dateYearDigit1': {
      const data = config.dateYear as number;
      const hasData = data !== undefined;
      return getLow(getYear(data, hasData));
    }

    case 'dateYearDigit2': {
      const data = config.dateYear as number;
      const hasData = data !== undefined;
      return getTen(getYear(data, hasData));
    }

    case 'dateYearDigit3': {
      const data = config.dateYear as number;
      const hasData = data !== undefined;
      return getHundred(getYear(data, hasData));
    }

    case 'dateYearDigit4': {
      const data = config.dateYear as number;
      const hasData = data !== undefined;
      return getThousand(getYear(data, hasData));
    }

    case 'miscIsAM':
      return hasData ? data : new Date().getHours() < 13 ? 0 : 1;
    case 'miscIsPM':
      return hasData ? data : new Date().getHours() < 13 ? 1 : 0;
    default:
      return hasData ? data : 0;
  }
}
