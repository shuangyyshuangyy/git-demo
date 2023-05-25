interface RuntimeImages {
  [key: string]: HTMLImageElement;
}

interface RuntimeConfigData {
  timeHour?: number; //时 0~23
  timeHourLow?: number; //小时个位数 0~2
  timeHourHigh?: number; //小时十位数 0~9
  timeMinute?: number; //分 0~59
  timeMinuteLow?: number; //分钟个位数 0~9
  timeMinuteHigh?: number; //分钟十位数 0~5
  timeSecond?: number; //秒 0~59
  timeSecondLow?: number; //秒个位数 0~9
  timeSecondHigh?: number; //秒十位数 0~5
  timeCentiSecond?: number; //分秒，0.01秒，范围0~99
  timeCentiSecondLow?: number; //分秒的个位数 0~9
  timeCentiSecondHigh?: number; //分秒的十位数 0~9
  dateYear?: number; //年，如“2021”
  dateYearDigit1?: number; //年数值的个位数 0~9
  dateYearDigit2?: number; //年数值的十位数 0~9
  dateYearDigit3?: number; //年数值的百分位 0~9
  dateYearDigit4?: number; //年数值的千分位 0~9
  dateMonth?: number; //月份 1~12
  dateMonthLow?: number; //月份的个位数 0~9
  dateMonthHigh?: number; // 月份的十位数 0~1
  dateDay?: number; //日期 1~31
  dateDayLow?: number; //日期的个位数 0~9
  dateDayHigh?: number; // 日期的十位数 0~3
  dateWeek?: number; //星期，0：周日，1：周一， ... 6:周六
  dateLunarDay?: number; //月相，1~31
  dateLunarMonth?: number; //阴历月份，1~12
  miscIsAM?: number; //当前时间是否为上午 0|1
  miscIsPM?: number; //当前时间是否为下午 0|1
  miscIs24H?: number; //当前系统时间是否为24小时制 0|1
  healthExerciseDuration?: number; //中高强度锻炼时长，单位分钟，0~999分钟
  healthStepCount: number; //步数 0~9999
  healthStepCountDigit1?: number; //步数的个位数 0~9
  healthStepCountDigit2?: number; //步数的十位数 0~9
  healthStepCountDigit3?: number; //步数的百位数 0~9
  healthStepCountDigit4?: number; //步数的千位数 0~9
  healthStepCountDigit5?: number; //步数的万分位数 0~9
  healthStepProgress: number; //步数完成进度，0~100，单位%
  healthStepKiloMeter: number; //步数距离，单位kM 0~999
  healthHeartRate: number; //心率，单位bpm
  healthHearRateZone: number; //心率区间，0~6，分别代表：安静、热身、燃脂、有氧、无氧、极限, 无效
  healthHearRateMin?: number; //心率最低值，单位bpm 0~999
  healthHearRateMax?: number; //心率最高值，单位bmp 0~999
  healthCalorie: number; //卡路里 0~99999
  healthCalorieProgress: number; //卡路里完成进度， 0~100，单位%
  healthStandCount: number; //站立次数, 0~12
  healthStandProgress: number; //站立完成进度，0~100，单位%
  healthSleepDuration: number; //睡眠时长，单位为小时，如“1.2"
  healthSleepScore: number; //睡眠得分，0~100
  healthSleepTargetProgress: number; //睡眠目标完成度，0~100
  healthOxygenSpO2: number; //血氧饱和度，0~100
  healthMiscRecoveryTime: number; //恢复时间，0~100，单位h
  healthMiscRunPowerIndex: number; //跑力指数，0~80,单位无
  healthSleepActivity: number;
  healthPressure: number;
  healthEnergy: number;
  healthExerciseProgress: number;
  // healthBloodPressureUnit: number;
  healthBloodDiastolicPressureMmhg: number;
  healthBloodSystolicPressureMmhg: number;
  healthBloodDiastolicPressureKpa: number;
  healthBloodSystolicPressureKpa: number;

  weatherCurrentSunRise: number; // 日出时间 TBD
  weatherCurrentSunSet: number; // 日落时间 TBD
  // weatherTemperatureUnit: number; // 温度单位
  weatherCurrentTemperature: number; //当前温度，单位摄氏度 -100~100
  weatherCurrentTemperatureFahrenheit: number; // 当前温度，单位华氏度 -146~210
  weatherCurrentTemperatureFeel?: number; //当前体感温度，单位摄氏度 -100~100

  weatherCurrentWeather: number; // 天气代码
  weatherCurrentHumidity: number; //当前湿度，单位% 0~100

  weatherCurrentWindDirection: number; //当前风向，0~9分别代表：无持续风向, 旋转风, 北风, 东北风, 东风, 东南风, 南风, 西南风, 西风, 西北风
  weatherCurrentWindAngle: number; //当前风向角，0~359°，360表示无持续风向，361表示旋转风 0~361
  weatherCurrentWindSpeed: number; //当前风速，单位km/h 0~999
  weatherCurrentWindLevel: number; //当前风力级别， 0~12分别代表：微风, 1级, 2级, 3级, 4级, 5级, 6级, 7级, 8级, 9级, 10级, 11级, 12级及以上,

  weatherCurrentAirQualityIndex: number; //当前AQI，范围0~500?
  weatherCurrentAirQualityLevel: number; //当前空气质量指数等级， 0~5分别代表： 优, 良, 轻度污染, 中度污染, 重度污染, 严重污染
  weatherCurrentChanceOfRain: number; //当前降雨概率， 0~100
  weatherCurrentPressure: number; //当前气压，单位MPa，兆帕 0~9999
  weatherCurrentVisibility: number; //当前能见度，单位m? kM? 0~999
  weatherCurrentUVIndex: number; //当前紫外线指数，如SPF15 0~99
  weatherCurrentUVLevel: number; //当前紫外线指数级别，0~4，分别代表： 需防晒、紫外线较弱(对应SPF15)、紫外线较强(SPF20)、注意防晒(对应SPF30)、避免外出(对应SPF30+)
  weatherCurrentDressIndex: number; //穿衣指数，0~7分别代表:适宜短袖、适宜衬衫、适宜薄外套、适宜夹克、适宜风衣、适宜棉衣、适宜冬大衣、适宜羽绒服

  weatherTodayTemperatureMax?: number; // 今天最高温度，单位摄氏度
  weatherTodayTemperatureMin?: number; // 今天最低温度，单位摄氏度
  weatherTomorrowTemperatureMax?: number; // 明天最高温度，单位摄氏度
  weatherTomorrowTemperatureMin?: number; // 明天最低温度，单位摄氏度

  systemStatusBattery: number; //电量百分比 0~100
  systemStatusCharge: number; //当前充电状态，0：没有充电，1：正在充电，2：TBD，3：TBD
  SystemSensorFusionAltitude: number; //海拔高度，单位m, 范围-600~9000

  systemBatteryLevel: number;

  AppAlarmHour: number;
  AppAlarmMinute: number;
}

type WatchSource = keyof RuntimeConfigData;
interface Runtime {
  // ast
  ast: Ast;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  render: (() => void) | null;
  cleanCanvas: (() => void) | null;
  // maml运行时resouse解析后的数据
  data: RuntimeData;
  // resouse标签
  resources: Ast;
  // 正常模式的布局
  normal: Ast;
  // 暗夜模式的布局
  dark: Ast;
  // 极简模式的布局
  AOD: Ast;

  // 离屏绘制的图片
  offscreen: any;
  // 图片索引
  images: any;
  size: any;
  // 模拟系统数据,日期\天气\健康等
  configData: RuntimeConfigData;
  // 默认的刷新时间
  tickTime: number;

  renderTheme: {
    name: string;
    type?: 'normal' | 'AOD';
    // 具体配色名称
    colorGroup?: string;
    /**
     * 渲染时，需要隐藏的元素，对应协议中Layout的ref标签（去除@）值
     */
    excludes?: string[];
  };
}

interface RuntimeData {
  [key: string]: any;
}
