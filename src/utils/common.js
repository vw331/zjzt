import { Cookie } from './storage'

export default {
    /**
   * 经纬度点之间的距离算法
   */
  rad : function(d){
    return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
  },
  getDistance : function(lat1,lng1,lat2,lng2){
    var radLat1 = this.rad(lat1);
    var radLat2 = this.rad(lat2);
    var a = radLat1 - radLat2;
    var  b = this.rad(lng1) - this.rad(lng2);
    var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
    Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
    s = s *6378.137 ;// EARTH_RADIUS;
    s = Math.round(s * 10000) / 10000; //输出为公里
    return (s*1000).toFixed(1); // 米
  },
  /**
   * 获取当前时间
  */
  getNowTime : function() {
    let now = new Date()
    let cmonth = now.getMonth() + 1
    let day = now.getDate()
    let hour = now.getHours()
    let minutes = now.getMinutes()
    if (cmonth < 10) cmonth = '0' + cmonth
    if (day < 10) day = '0' + day
    if (hour < 10) hour = '0' + hour
    if (minutes < 10) minutes = '0' + minutes
    return `${now.getFullYear()}-${cmonth}-${day} ${hour}:${minutes}`
  },

  /**
   * 获取当前时间
  */
  getNowDate : function() {
    let now = new Date()
    let cmonth = now.getMonth() + 1
    let day = now.getDate()

    if (cmonth < 10) cmonth = '0' + cmonth
    if (day < 10) day = '0' + day

    return `${now.getFullYear()}-${cmonth}-${day}`
  },


  /**
   * jssdk配置
   * @param { 是否是调试模式 } debug 
   * @param { 需要的接口数组列表 } jsApiList 
   */
  wxConfig : function(debug, jsApiList) {
    wx.config({
      debug: debug, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: Cookie.get('appId'), // 必填，公众号的唯一标识
      timestamp:  Cookie.get('timestamp'), // 必填，生成签名的时间戳
      nonceStr:  Cookie.get('nonceStr'), // 必填，生成签名的随机串
      signature:  Cookie.get('signature'),// 必填，签名
      jsApiList:  jsApiList // 必填，需要使用的JS接口列表
    })
  },
  roleNum : function(role) {
    let num;
    switch(role) {
      case '客户' : num = 1; break;
      case '供应商' : num = 2; break;
      case '承运商' : num = 3; break;
      case '中通员工' : num = 4; break;
      case '司机' : num = 5; break;
      case '超级用户' : num = 6; break;
      default : num = ''; break;
    }
    return num;
  },
  getScreenWidth : function() {
    return document.documentElement.offsetWidth || document.body.offsetWidth;
  },
  /**
   * cookie获取用户角色，从服务端写入
   */
  getRoleId : function() {
    return Cookie.get('roleId')
    //return '1'
  }
}
