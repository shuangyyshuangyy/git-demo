export interface DataSourceItem {
  label: string;
  key: string;
  comment?: string;
  minValue: number;
  maxValue: number;
  type: string;
  valueRange?: string;
}

export const dataSourceList: Record<string, DataSourceItem[]> = {
  时间: [
    // {
    //   label: '时间',
    //   key: 'time',
    //   comment: '时和分',
    //   type: 'time',
    //   valueRange: '[00:00,24:00)&[12:00,12:00)'
    // },
    {
      label: '时',
      key: 'timeHour',
      comment: '时',
      type: 'time',
      minValue: 0,
      maxValue: 23,
      valueRange: '[0,24)&[12,12)'
    },
    {
      label: '小时个位数',
      key: 'timeHourLow',
      comment: '小时个位数',
      minValue: 0,
      maxValue: 9,
      type: 'time'
    },
    {
      label: '小时十位数',
      key: 'timeHourHigh',
      comment: '小时个位数',
      minValue: 0,
      maxValue: 2,
      type: 'time'
    },
    {
      label: '分',
      key: 'timeMinute',
      comment: '分',
      minValue: 0,
      maxValue: 59,
      type: 'time'
    },
    {
      label: '分钟个位数',
      key: 'timeMinuteLow',
      comment: '钟个位数',
      minValue: 0,
      maxValue: 9,
      type: 'time'
    },
    {
      label: '分钟十位数',
      key: 'timeMinuteHigh',
      comment: '分钟十位数',
      minValue: 0,
      maxValue: 5,
      type: 'time'
    },
    {
      label: '秒',
      key: 'timeSecond',
      comment: '秒',
      minValue: 0,
      maxValue: 59,
      type: 'time'
    },
    {
      label: '秒钟个位数',
      key: 'timeSecondLow',
      comment: '秒钟个位数',
      minValue: 0,
      maxValue: 9,
      type: 'time'
    },
    {
      label: '秒钟十位数',
      key: 'timeSecondHigh',
      comment: '秒钟十位数',
      minValue: 0,
      maxValue: 5,
      type: 'time'
    },
    {
      label: '分秒',
      key: 'timeCentiSecond',
      comment: '分秒,0.01秒,范围0-99',
      minValue: 0,
      maxValue: 99,
      type: 'time'
    },
    {
      label: '分秒个位数',
      key: 'timeCentiSecondLow',
      comment: '分秒个位数',
      minValue: 0,
      maxValue: 9,
      type: 'time'
    },
    {
      label: '分秒十位数',
      key: 'timeCentiSecondHigh',
      comment: '分秒十位数',
      minValue: 0,
      maxValue: 9,
      type: 'time'
    },
    {
      label: '年',
      key: 'dateYear',
      comment: '年份',
      minValue: 1,
      maxValue: 9999,
      type: 'time'
    },
    {
      label: '年个位',
      key: 'dateYearDigit1',
      comment: '年的个位数',
      minValue: 0,
      maxValue: 9,
      type: 'time'
    },
    {
      label: '年十位',
      key: 'dateYearDigit2',
      comment: '年十份',
      minValue: 0,
      maxValue: 9,
      type: 'time'
    },
    {
      label: '百分位',
      key: 'dateYearDigit3',
      comment: '年的个位数',
      minValue: 0,
      maxValue: 9,
      type: 'time'
    },
    {
      label: '千分位',
      key: 'dateYearDigit4',
      comment: '年的千位数',
      minValue: 0,
      maxValue: 9,
      type: 'time'
    },
    // {
    //   label: '月日',
    //   key: 'dateMonthAndDay',
    //   comment: '月份和日期',
    //   type: 'time',
    //   valueRange: '["1月1日","12月31日"]'
    // },
    {
      label: '月',
      key: 'dateMonth',
      comment: '月份',
      minValue: 1,
      maxValue: 12,
      type: 'time'
    },
    {
      label: '月个位',
      key: 'dateMonthLow',
      comment: '月份的个位数',
      minValue: 0,
      maxValue: 9,
      type: 'time'
    },
    {
      label: '月十位',
      key: 'dateMonthHigh',
      comment: '月份的十位数',
      minValue: 0,
      maxValue: 1,
      type: 'time'
    },
    {
      label: '日期',
      key: 'dateDay',
      comment: '日期',
      minValue: 0,
      maxValue: 31,
      type: 'time'
    },
    {
      label: '日期个位',
      key: 'dateDayLow',
      comment: '日期的个位数',
      minValue: 0,
      maxValue: 9,
      type: 'time'
    },
    {
      label: '日期十位',
      key: 'dateDayHigh',
      comment: '日期的十位数',
      minValue: 0,
      maxValue: 3,
      type: 'time'
    },
    {
      label: '星期',
      key: 'dateWeek',
      comment: '星期,0:周日,1:周一,...,6:周六',
      minValue: 0,
      maxValue: 6,
      type: 'time'
    },
    {
      label: '农历年',
      key: 'dateLunarYear',
      comment: '农历年，如“2021”',
      minValue: 0,
      maxValue: 9999,
      type: 'time'
    },
    {
      label: '农历月份',
      key: 'dateLunarMonth',
      comment: '农历月份',
      minValue: 1,
      maxValue: 12,
      type: 'time'
    },
    {
      label: '农历日期',
      key: 'dateLunarDay',
      comment: '农历日期',
      minValue: 1,
      maxValue: 31,
      type: 'time'
    },
    {
      label: '是否上午',
      key: 'misclsAM',
      comment: '当前时间是否为上午',
      minValue: 0,
      maxValue: 1,
      type: 'time'
    },
    {
      label: '是否下午',
      key: 'misclsPM',
      comment: '当前时间是否为下午',
      minValue: 0,
      maxValue: 1,
      type: 'time'
    },
    {
      label: '当前时间是否24小时制',
      key: 'miscls24H',
      comment: '当前时间是否24小时制',
      minValue: 0,
      maxValue: 1,
      type: 'time'
    }
  ],
  健康: [
    {
      label: '步数',
      key: 'healthStepCount',
      comment: '步数',
      minValue: 0,
      maxValue: 9999,
      type: 'health'
    },
    {
      label: '步数个位数',
      key: 'healthStepCountDigit1',
      comment: '步数个位数',
      minValue: 0,
      maxValue: 9,
      type: 'health'
    },
    {
      label: '步数十位数',
      key: 'healthStepCountDigit2',
      comment: '步数十位数',
      minValue: 0,
      maxValue: 9,
      type: 'health'
    },
    {
      label: '步数百位数',
      key: 'healthStepCountDigit3',
      comment: '步数百位数',
      minValue: 0,
      maxValue: 9,
      type: 'health'
    },
    {
      label: '步数千位数',
      key: 'healthStepCountDigit4',
      comment: '步数千位数',
      minValue: 0,
      maxValue: 9,
      type: 'health'
    },
    {
      label: '步数万位数',
      key: 'healthStepCountDigit5',
      comment: '步数万位数',
      minValue: 0,
      maxValue: 9,
      type: 'health'
    },
    {
      label: '步数进度',
      key: 'healthStepProgress',
      comment: '步数完成进度,0-100,单位%',
      minValue: 0,
      maxValue: 100,
      type: 'health'
    },
    {
      label: '步数目标',
      key: 'healthStepTarget',
      comment: '步数目标值',
      minValue: 0,
      maxValue: 99999,
      type: 'health'
    },
    {
      label: '步数距离',
      key: 'healthStepKiloMeter',
      comment: '步数距离,单位KM',
      minValue: 0,
      maxValue: 100,
      type: 'health'
    },
    {
      label: '心率',
      key: 'healthHeartRate',
      comment: '心率,单位bpm',
      minValue: 0,
      maxValue: 999,
      type: 'health'
    },
    {
      label: '心率区间',
      key: 'healthHeartRateZone',
      comment: '心率区间,0-5,分别代表:安静、健身、燃脂、有氧、无氧、极限',
      minValue: 0,
      maxValue: 999,
      type: 'health'
    },
    {
      label: '心率',
      key: 'healthHeartRateMin',
      comment: '心率最低值,单位bpm',
      minValue: 0,
      maxValue: 999,
      type: 'health'
    },
    {
      label: '心率',
      key: 'healthHeartRateMax',
      comment: '心率最高值,单位bpm',
      minValue: 0,
      maxValue: 999,
      type: 'health'
    },
    {
      label: '卡路里',
      key: 'healthCalorie',
      comment: '卡路里',
      minValue: 0,
      maxValue: 99999,
      type: 'health'
    },
    {
      label: '卡路里完成进度',
      key: 'healthCalorieProgress',
      comment: '卡路里完成进度,0-100,单位%',
      minValue: 0,
      maxValue: 100,
      type: 'health'
    },
    {
      label: '卡路里目标值',
      key: 'healthCalorieTarget',
      comment: '卡路里目标值',
      minValue: 0,
      maxValue: 100,
      type: 'health'
    },
    {
      label: '站立次数',
      key: 'healthStandCount',
      comment: '站立次数',
      minValue: 0,
      maxValue: 12,
      type: 'health'
    },
    {
      label: '站立完成进度',
      key: 'healthStandProgress',
      comment: '站立完成进度,0-100,单位%',
      minValue: 0,
      maxValue: 100,
      type: 'health'
    },
    {
      label: '站立目标',
      key: 'healthStandCountTarget',
      comment: '站立次数目标',
      minValue: 1,
      maxValue: 12,
      type: 'health'
    },
    {
      label: '睡眠时长',
      key: 'healthSleepDuration',
      comment: '睡眠时长,单位小时,如"1.2小时"',
      minValue: 0,
      maxValue: 24,
      type: 'health'
    },
    {
      label: '睡眠得分',
      key: 'healthSleepScore',
      comment: '睡眠得分,0-100',
      minValue: 0,
      maxValue: 100,
      type: 'health'
    },
    {
      label: '恢复时间',
      key: 'healthMiscRecoveryTime',
      comment: '恢复时间,0-100',
      minValue: 0,
      maxValue: 100,
      type: 'health'
    },
    {
      label: '跑力指数',
      key: 'healthMiscRunPowerIndex',
      comment: '跑力指数,10-80',
      minValue: 10,
      maxValue: 80,
      type: 'health'
    }
  ],
  天气: [
    // {
    //   label: '日出时间',
    //   key: 'weatherCurrentSunRise',
    //   comment: '日出时间',
    //   type: 'weather',
    //   valueRange: '[00:00,24:00]'
    // },
    // {
    //   label: '日落时间',
    //   key: 'weatherCurrentSunSet',
    //   comment: '日落时间',
    //   type: 'weather',
    //   valueRange: '[00:00,24:00]'
    // },
    {
      label: '日出时间小时',
      key: 'weatherCurrentSunRiseHour',
      comment: '日出时间小时部分',
      minValue: 0,
      maxValue: 23,
      type: 'weather'
    },
    {
      label: '日出时间分钟',
      key: 'weatherCurrentSunRiseMinute',
      comment: '日出时间分钟部分',
      minValue: 0,
      maxValue: 59,
      type: 'weather'
    },
    {
      label: '日落时间小时',
      key: 'weatherCurrentSunSetHour',
      comment: '日落时间小时部分',
      minValue: 0,
      maxValue: 23,
      type: 'weather'
    },
    {
      label: '日落时间分钟',
      key: 'weatherCurrentSunSetMinute',
      comment: '日落时间分钟部分',
      minValue: 0,
      maxValue: 59,
      type: 'weather'
    },
    {
      label: '当前温度',
      key: 'weatherCurrentTemperature',
      comment: '当前温度,单位摄氏度',
      minValue: -99,
      maxValue: 99,
      type: 'weather'
    },
    {
      label: '当前体感温度',
      key: 'weatherCurrentTemperatureFeel',
      comment: '当前体感温度,单位摄氏度',
      minValue: -99,
      maxValue: 99,
      type: 'weather'
    },
    {
      label: '当前湿度',
      key: 'weatherCurrentHumidity',
      comment: '当前湿度,单位%',
      minValue: 0,
      maxValue: 100,
      type: 'weather'
    },
    {
      label: '天气代码',
      key: 'weatherCurrentWeather',
      comment:
        '详⻅天气代码tab⻚，未知（必选）、晴（必选）、多云（必选）、阴（必选）、阵雨、雷阵雨、冰雹、雨夹雪、雨（必选）、小雨、中雨、大雨、暴雨、雪（必选）、阵雪、小雪、中雪、大雪、暴雪、雾（必选）、浮尘、扬沙、沙尘暴、霾（必选）',
      minValue: 0,
      maxValue: 301,
      type: 'weather'
    },
    {
      label: '当前风向',
      key: 'weatherCurrentWindDirection',
      comment:
        '当前⻛向，0~9分别代表：无持续⻛向, 旋转⻛, 北⻛, 东北⻛,东⻛, 东南⻛, 南⻛, 西南⻛, 西⻛, 西北⻛',
      minValue: 0,
      maxValue: 9,
      type: 'weather'
    },
    {
      label: '当前风向角',
      key: 'weatherCurrentWindAngle',
      comment: '当前⻛向⻆，0~359°，360表示无持续⻛向，361表示旋转⻛',
      minValue: 0,
      maxValue: 360,
      type: 'weather'
    },
    {
      label: '当前风速',
      key: ' weatherCurrentWindSpeed',
      comment: '当前⻛速，单位km/h',
      minValue: 0,
      maxValue: 999,
      type: 'weather'
    },
    {
      label: '当前风力级别',
      key: ' weatherCurrentWindLevel',
      comment:
        '当前⻛力级别， 0~12分别代表：微⻛, 1级, 2级, 3级, 4级, 5级, 6级, 7级, 8级, 9级, 10级, 11级, 12级及以上',
      minValue: 0,
      maxValue: 12,
      type: 'weather'
    },
    {
      label: 'AQI',
      key: ' weatherCurrentAirQualityIndex',
      comment: '当前AQI，范围0~300',
      minValue: 0,
      maxValue: 300,
      type: 'weather'
    },
    {
      label: '空气质量指数',
      key: ' weatherCurrentAirQualityLevel',
      comment:
        '当前空气质量指数等级， 0~5分别代表：优, 良, 轻度污染, 中度污染, 重度污染, 严重污染',
      minValue: 0,
      maxValue: 5,
      type: 'weather'
    },
    {
      label: '降雨概率',
      key: ' weatherCurrentChanceOfRain',
      comment: '当前降雨概率， 0~100',
      minValue: 0,
      maxValue: 100,
      type: 'weather'
    },
    {
      label: '气压',
      key: ' weatherCurrentPressure',
      comment: '当前气压，单位MPa，兆帕',
      minValue: 0,
      maxValue: 9999,
      type: 'weather'
    },
    {
      label: '能见度',
      key: ' weatherCurrentVisibility',
      comment: '当前能见度,单位m',
      minValue: 0,
      maxValue: 999,
      type: 'weather'
    },
    {
      label: '紫外线指数',
      key: ' weatherCurrentUVIndex',
      comment: '当前紫外线指数，如SPF15',
      minValue: 0,
      maxValue: 99,
      type: 'weather'
    },
    {
      label: '紫外线指数级别',
      key: ' weatherCurrentUVLevel',
      comment:
        '当前紫外线指数级别，分别代表：需防晒、紫外线较弱(SPF15)、紫外线较强(SPF20)、注意防晒(SPF30)、避免外出(SPF30+)',
      minValue: 0,
      maxValue: 4,
      type: 'weather'
    },
    {
      label: '穿衣指数',
      key: ' weatherCurrentDressIndex',
      comment:
        '穿衣指数，0-7分别代表适宜短袖、适宜衬衫、适宜薄外套、适宜夹克、适宜风衣、适宜棉衣、适宜冬大衣、适宜羽绒服',
      minValue: 0,
      maxValue: 7,
      type: 'weather'
    }
  ],
  系统: [
    {
      label: '电量',
      key: ' systemStatusBattery',
      comment: '电量百分比',
      minValue: 0,
      maxValue: 100,
      type: 'system'
    },
    {
      label: '充电状态',
      key: ' systemStatusCharge',
      comment: '当前充电状态，0：没有充电，1：正在充电，2：TBD,3:TBD',
      minValue: 0,
      maxValue: 3,
      type: 'system'
    },
    {
      label: '海拔高度',
      key: ' systemSensorFusionAltit',
      comment: '海拔高度，单位m，范围-600-9000',
      minValue: -600,
      maxValue: 9000,
      type: 'system'
    }
  ]
};
export const useDataSource = () => {
  const findOne = (key: string) => {
    const list = Object.values(dataSourceList).flat();
    return list.find((item) => item.key == key);
  };

  return {
    findOne
  };
};
