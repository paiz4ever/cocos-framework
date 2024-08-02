type TGameStorage = {
  // 单日过期数据
  data1: DayExpire<number>;
  data2: DayExpire<string>;
  // 单周过期数据
  data3: WeekExpire<number>;
  data4: WeekExpire<boolean>;
};
