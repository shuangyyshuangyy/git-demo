const configData = {
  dateDay: new Date().getDate(),
  dateMonth: new Date().getMonth() + 1,
  dateYear: new Date().getFullYear(),
  timeHour: new Date().getHours(),
  timeMinute: new Date().getMinutes(),
  timeSecond: new Date().getSeconds(),
  healthStepCount: (Math.random() * 9999) | 0, //步数
  healthStepCountDigit1: (Math.random() * 9) | 0, //步数的个位数
  healthStepCountDigit2: (Math.random() * 9) | 0, //步数的个位数
  healthStepCountDigit3: (Math.random() * 9) | 0, //步数的个位数
  healthStepCountDigit4: (Math.random() * 9) | 0, //步数的个位数
  healthStepCountDigit5: (Math.random() * 9) | 0, //步数的个位数
  healthStepProgress: (Math.random() * 100) | 0, //步数完成进度，0~100，单位%
  healthStepKiloMeter: (Math.random() * 100) | 0, //步数距离，单位kM
  healthHeartRate: (Math.random() * 999) | 0, //心率，单位bpm
  healthHearRateZone: (Math.random() * 6) | 0, //心率区间，0~5，分别代表：安静、热身、燃脂、有氧、无氧、极限, 无效
  healthHearRateMin: (Math.random() * 999) | 0, //心率最低值，单位bpm
  healthHearRateMax: (Math.random() * 999) | 0, //心率最高值，单位bmp
  healthCalorie: (Math.random() * 99999) | 0, //卡路里
  healthCalorieProgress: (Math.random() * 100) | 0, //卡路里完成进度， 0~100，单位%

  healthStandCount: (Math.random() * 12) | 0, //站立次数, 0~12
  healthStandProgress: (Math.random() * 100) | 0, //站立完成进度，0~100，单位%
  healthSleepDuration: Math.random() * 24, //睡眠时长，单位为小时，如“1.2"
  healthSleepScore: (Math.random() * 100) | 0, //睡眠得分，0~100
  healthPressureIndex: (Math.random() * 100) | 0, //压力指数，0~100，
  healthExerciseDuration: (Math.random() * 999) | 0, //中高强度锻炼时长，单位分钟，0~999分钟
  healthEnergyConsumed: (Math.random() * 100) | 0, //能量消耗， 0~100，单位%
  healthSleepTargetProgress: (Math.random() * 100) | 0, //睡眠目标完成度， 0~100，单位%
  healthOxygenSpO2: (Math.random() * 100) | 0, //血氧饱和度， 0~100，单位%
  healthMiscRecoveryTime: (Math.random() * 96) | 0, //恢复时间，0~100，单位h，2022-0725lzj
  healthMiscRunPowerIndex: (Math.random() * 80) | 0, //跑力指数，0~80,单位无， 2022-0725lzj
  healthSleepActivity: 0,
  healthPressure: 0,
  healthEnergy: 0,
  healthBloodDiastolicPressureMmhg: (Math.random() * 300) | 0, // 血压舒张压mmHg 范围0-300
  healthBloodSystolicPressureMmhg: (Math.random() * 300) | 0, // 血压收缩压mmHg 范围0-300
  healthBloodDiastolicPressureKpa: (Math.random() * 40) | 0, // 血压舒张压kPa 范围0-40.0
  healthBloodSystolicPressureKpa: (Math.random() * 40) | 0, // 血压收缩压kPa 范围0-40.0
  healthMiscTodayVitalityValue: (Math.random() * 80) | 0, // 今日元气值 0~80
  healthMiscSevenDaysVitalityValue: (Math.random() * 560) | 0, // 近七日元气值 0~560
  weatherCurrentTemperature: Math.random() * 50 - 10, //当前温度，单位摄氏度
  weatherCurrentTemperatureFahrenheit: (Math.random() * 50) | 0, //当前温度，单位华氏度
  weatherCurrentTemperatureFeel: Math.random() * 50 - 10, //当前体感温度，单位摄氏度
  weatherCurrentHumidity: (Math.random() * 100) | 0, //当前湿度，单位%,
  weatherCurrentWeather: (Math.random() * 30) | 0, //天气代码
  healthExerciseProgress: (Math.random() * 100) | 0, //中高强度锻炼完成度--20220729lzj

  weatherCurrentWindDirection: (Math.random() * 9) | 0, //当前风向，0~9分别代表：无持续风向, 旋转风, 北风, 东北风, 东风, 东南风, 南风, 西南风, 西风, 西北风
  weatherCurrentWindAngle: (Math.random() * 361) | 0, //当前风向角，0~359°，360表示无持续风向，361表示旋转风,
  weatherCurrentWindSpeed: (Math.random() * 999) | 0, //当前风速，单位km/h
  weatherCurrentWindLevel: (Math.random() * 12) | 0, //当前风力级别， 0~12分别代表：微风, 1级, 2级, 3级, 4级, 5级, 6级, 7级, 8级, 9级, 10级, 11级, 12级及以上,

  weatherCurrentAirQualityIndex: (Math.random() * 500) | 0, //当前AQI，范围0~300?
  weatherCurrentAirQualityLevel: (Math.random() * 5) | 0, //当前空气质量指数等级， 0~5分别代表： 优, 良, 轻度污染, 中度污染, 重度污染, 严重污染
  weatherCurrentChanceOfRain: (Math.random() * 100) | 0, //当前降雨概率， 0~100
  weatherCurrentPressure: (Math.random() * 9999) | 0, //当前气压，单位MPa，兆帕
  weatherCurrentVisibility: (Math.random() * 999) | 0, //当前能见度，单位m? kM?
  weatherCurrentUVIndex: (Math.random() * 99) | 0, //当前紫外线指数，如SPF15
  weatherCurrentUVLevel: (Math.random() * 4) | 0, //当前紫外线指数级别，0~4，分别代表： 需防晒、紫外线较弱(对应SPF15)、紫外线较强(SPF20)、注意防晒(对应SPF30)、避免外出(对应SPF30+)
  weatherCurrentDressIndex: (Math.random() * 7) | 0, //穿衣指数，0~7分别代表:适宜短袖、适宜衬衫、适宜薄外套、适宜夹克、适宜风衣、适宜棉衣、适宜冬大衣、适宜羽绒服

  weatherCurrentSunRise: 80760000, // 日出时间
  weatherCurrentSunSet: 34440000, // 日落时间
  weatherCurrentSunRiseHour: (Math.random() * 23) | 0, // 日出时间的小时部分
  weatherCurrentSunRiseMinute: (Math.random() * 59) | 0, // 日出时间的分钟部分
  weatherCurrentSunSetHour: (Math.random() * 23) | 0, // 日落时间的小时部分
  weatherCurrentSunSetMinute: (Math.random() * 59) | 0, // 日落时间的分钟部分
  weatherTodayTemperatureMax: 32, // 今天最高温度，单位摄氏度
  weatherTodayTemperatureMin: 18, // 今天最低温度，单位摄氏度
  weatherTodayTemperatureMaxFahrenheit: 90, // 今天最高温度，单位华氏度
  weatherTodayTemperatureMinFahrenheit: 64, // 今天最低温度，单位华氏度
  weatherTomorrowTemperatureMax: 36, // 明天最高温度，单位摄氏度
  weatherTomorrowTemperatureMin: 22, // 明天最低温度，单位摄氏度
  weatherTomorrowTemperatureMaxFahrenheit: 90,
  weatherTomorrowTemperatureMinFahrenheit: 64,

  systemStatusBattery: (Math.random() * 100) | 0, //电量百分比
  systemStatusCharge: (Math.random() * 3) | 0, // 充电状态
  SystemSensorFusionAltitude: (Math.random() * 9000) | 0, //海拔高度，单位m, 范围-600~9000
  miscIs24H: 1, //当前系统时间是否为24小时制

  systemBatteryLevel: 0,
  AppAlarmHour: (Math.random() * 23) | 0, // 闹钟小时部分
  AppAlarmMinute: (Math.random() * 59) | 0 // 闹钟分钟部分
};

const initDate = {
  ast: { tag: '', attrsMap: {}, children: [] },
  // maml运行时resouse解析后的数据
  data: {},
  canvas: null,
  ctx: null,
  render: null,
  cleanCanvas: null,
  // resouse标签
  resources: {} as Ast,
  // 正常模式的布局
  normal: {} as Ast,
  // 暗夜模式的布局
  dark: {} as Ast,
  // 极简模式的布局
  AOD: {} as Ast,

  // 离屏绘制的图片
  offscreen: {},
  // 图片索引
  images: {},
  // 存储对象的尺寸
  size: {},
  // 模拟系统数据,日期\天气\健康等
  configData,
  // 默认的刷新时间
  tickTime: 10000,

  // 需要渲染的主题信息
  renderTheme: {
    name: ''
  }
};
export default initDate;
