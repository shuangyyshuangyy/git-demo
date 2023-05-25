import dayjs from 'dayjs';

export const defaultConfigData = {
  timeHour: dayjs().hour(),
  timeMinute: dayjs().minute(),
  timeSecond: dayjs().second(),
  dateWeek: dayjs().day(),
  dateDay: dayjs().date(),
  dateMonth: dayjs().month() + 1,
  dateYear: dayjs().year(),
  //月相/阴历日期
  dateLunarDay: dayjs().date(),
  //阴历月份
  dateLunarMonth: dayjs().month() + 1,
  // 电量百分比
  systemStatusBattery: 70,
  // 能量消耗
  healthEnergyConsumed: 120,
  // 心率
  healthHeartRate: 100,
  // 心率区间
  healthHearRateZone: 0,
  // 压力指数
  healthPressure: 33,
  // 压力指数
  healthPressureIndex: 15,
  // 睡眠时长
  healthSleepDuration: 8,
  // 睡眠质量
  healthSleepScore: 33,
  // 睡眠质量
  healthSleepQuality: 2,
  // 睡眠质量
  healthSleepTargetProgress: 60,
  // 步数
  healthStepCount: 33333,
  // 步数完成度
  healthStepProgress: 66,
  // 卡路里
  healthCalorie: 667,
  // 卡路里燃烧进度
  healthCalorieProgress: 67,
  // 站立次数
  healthStandCount: 8,
  // 站立达标度
  healthStandProgress: 67,
  // 公里数
  healthStepKiloMeter: 86,
  // 中高强度锻炼时长
  healthHardOrMedium: 100,
  // 中高强度锻炼市场
  healthExerciseDuration: 100,
  // 中高强度锻炼 达标度
  healthHardOrMediumProgress: 67,
  // 血氧饱和度
  healthOxygenSpO2: 60,
  // 恢复时间默认值
  healthMiscRecoveryTime: 1,
  // 跑力指数默认值
  healthMiscRunPowerIndex: 10,
  // 天气代码
  weatherCurrentWeather: 0,
  // 气压
  weatherCurrentPressure: 900,
  // 海拔
  SystemSensorFusionAltitude: 100,
  // 温度单位 0 摄氏度 1 华氏度
  weatherTemperatureUnit: 0,
  // 当前温度 单位摄氏度
  weatherCurrentTemperature: 24,
  // 当前温度 单位华氏度
  weatherCurrentTemperatureFahrenheit: 75,
  // 今日最高温度 单位摄氏度
  weatherTodayTemperatureMax: 35,
  // 今日最低温度 单位摄氏度
  weatherTodayTemperatureMin: -25,
  // 今日最高温度 单位华氏度
  weatherTodayTemperatureMaxFahrenheit: 95,
  // 今日最低温度 单位华氏度
  weatherTodayTemperatureMinFahrenheit: -13,
  // 明日最高温度 单位摄氏度
  weatherTomorrowTemperatureMax: 35,
  // 明日最低温度 单位摄氏度
  weatherTomorrowTemperatureMin: -25,
  // 明日最高温度 华氏度
  weatherTomorrowTemperatureMaxFahrenheit: 95,
  // 明日最低温度 华氏度
  weatherTomorrowTemperatureMinFahrenheit: -13,
  // 湿度
  weatherCurrentHumidity: 30,
  // 空气质量指数等级
  weatherCurrentAirQualityLevel: 0,
  // 空气质量指数（AQI）
  weatherCurrentAirQualityIndex: 60,
  // 降水概率
  weatherCurrentChanceOfRain: 60,
  // 风力等级
  weatherCurrentWindLevel: 5,
  // 穿衣指数
  weatherCurrentDressIndex: 5,
  // UV指数
  weatherCurrentUVIndex: 3,
  // 中高强度锻炼完成度
  healthExerciseProgress: 66,
  // 日出时间 小时部分
  weatherCurrentSunRiseHour: 6,
  // 日出时间 分钟部分
  weatherCurrentSunRiseMinute: 0,
  // 日落时间 小时部分
  weatherCurrentSunSetHour: 18,
  // 日落时间 分钟部分
  weatherCurrentSunSetMinute: 0,
  // 闹钟 小时部分
  AppAlarmHour: 6,
  // 闹钟 分钟部分
  AppAlarmMinute: 0,
  // 血压单位 默认0 代表mmHg，1代表kPa
  healthBloodPressureUnit: 0,
  // 血压-舒张压mmHg
  healthBloodDiastolicPressureMmhg: 80,
  // 血压-收缩压mmHg
  healthBloodSystolicPressureMmhg: 120,
  // 血压-舒张压kPa
  healthBloodDiastolicPressureKpa: 10,
  // 血压-收缩压kPa
  healthBloodSystolicPressureKpa: 16,
  // 勿扰状态
  systemStatusDisturb: 0,
  // 蓝牙状态
  systemStatusBluetooth: 0,
  // 锁屏状态
  systemStatusScreenLock: 0,
  // 今日元气值
  healthMiscTodayVitalityValue: 0,
  //近7日累计元气值
  healthMiscSevenDaysVitalityValue: 0,
};

export type CanvasConfigData = typeof defaultConfigData;
