import fetch from './fetch'
import * as types from '../utils/constant'
import axios from 'axios'

export default {
  axios,
  /***************************** 用户管理模块 ************************************/

  // 用户获取短信验证码
  async sendSMSCode (params) {
    return await fetch.post(`${types.PRO_PATH}/sendSMSCode`, params)
  },

  // 用户绑定
  async bind (params) {
    return await fetch.post(`${types.PRO_PATH}/doBind`, params)
  },

  // 用户修改
  async doUpdateBind (params) {
    return await fetch.post(`${types.PRO_PATH}/doUpdateBind`, params)
  },

  // 查询用户信息 
  async getUserinfo () {
    return await fetch.get(`${types.PRO_PATH}/getUserinfo`,{})
  },

  /***************************** 承运商调度模块模块 ************************************/

  // 承运商/司机 查询装车单(调度单 发货单)信息 
  async getTruckInfo (params) {
    return await fetch.get(`${types.PRO_PATH}/getTruckInfo`,params)
  },

  // 查询装车单下所有发货单信息
  async getInvoiceInfo (params) {
    return await fetch.get(`${types.PRO_PATH}/getInvoiceInfo`,params)
  },

  // 查询发货单下商品列表信息
  async listProducts (params) {
    return await fetch.get(`${types.PRO_PATH}/listProducts`,params)
  },

  // 承运商接受装车单/调度单
  async doAcceptBill (params) {
    return await fetch.post(`${types.PRO_PATH}/doAcceptBill`,params)
  },

  // 承运商选择拒绝装车单/调度单
  async doRejectBill (params) {
    return await fetch.post(`${types.PRO_PATH}/doRejectBill`,params)
  },

  // 承运商添加司机信息
  /* async addDriver (params) {
    return await fetch.post(`${types.PRO_PATH}/addDriver`,params)
  }, */

  // 查询仓库
  async getWarehouses (params) {
    return await fetch.post(`${types.PRO_PATH}/obtainWarehouses`, params)
  },

  // 承运商查询名下司机列表
  async getDrivers (params) {
    return await fetch.get(`${types.PRO_PATH}/getDrivers`,params)
  },

  // 司机查询提货单信息
  /* async getDeliveryInfo (params) {
    return await fetch.get(`${types.PRO_PATH}/getDeliveryInfo`,params)
  }, */


  /***************************** 司机作业模块 ************************************/

  // 司机查看调度单/提货单列表
  async getDispatchList () {
    return await fetch.get(`${types.PRO_PATH}/getDispatchList`)
  },

  // 司机更新调度单状态(post)
  async updateStatus (params) {
    return await fetch.post(`${types.PRO_PATH}/updateStatus`, params)
  },

  // 司机在途信息上报(post)
  async addRoadinfo (params) {
    return await fetch.post(`${types.PRO_PATH}/addRoadinfo`, params)
  },

  // 中通员工/司机 采景 上报场景信息(post) 
  async addSceneinfo (params) {
    return await fetch.post(`${types.PRO_PATH}/addSceneinfo`, params)
  },

  // 司机实物回单确认(post)
  async addReceiptinfo (params) {
    return await fetch.post(`${types.PRO_PATH}/addReceiptinfo`, params)
  },

  // 司机/承运商/中通员工 订单电子签收(post)
  async signReceipt (params) {
    return await fetch.post(`${types.PRO_PATH}/signReceipt`, params)
  },

  // 查询订单/发货单详情
  async getOrderInfo (params) {
    return await fetch.get(`${types.PRO_PATH}/getOrderInfo`, params)
  },

  // 司机预约发货送货列表
  async getReservation (params) {
    return await fetch.get(`${types.PRO_PATH}/getReservation`, params)
  },

  // 司机预约发货送货详情
  async getReservationDetail (params) {
    return await fetch.get(`${types.PRO_PATH}/getReservationDetail`, params)
  },

  // 新增预约发货送货
  async addReservation (params) {
    return await fetch.post(`${types.PRO_PATH}/reservation`, params)
  },

  /***************************** 客户服务模块 ************************************/

   // 查看调查问卷详情
   async getSurveyInfo (params) {
    return await fetch.get(`${types.PRO_PATH}/getSurveyInfo`,params)
  },

  // 查询满意度调查问题列表
  async getSurveyQuestions (params) {
    return await fetch.get(`${types.PRO_PATH}/getSurveyQuestions`,params)
  },

  // 提交满意度调查问卷
  async submitSurvey (params) {
    return await fetch.post(`${types.PRO_PATH}/submitSurvey`,params)
  },

  // 新增投诉建议
  async addOpinion (params) {
    return await fetch.post(`${types.PRO_PATH}/addOpinion`,params)
  },
  /**
   * 查询客户订单列表 (get)
   * 
   * 订单 start
   */
  async listOrders (params) {
    return await fetch.get(`${types.PRO_PATH}/listOrders`,params)
  },

  // 查询客户订单详情 (get)
  async loadOrderDetail (params) {
    return await fetch.get(`${types.PRO_PATH}/loadOrderDetail`,params)
  },

  // 查询客户订单商品(get)
  async loadOrderProduct (params) {
    return await fetch.get(`${types.PRO_PATH}/loadOrderProduct`,params)
  },
  /** 订单 end */
   
  /**
   * 查询客户发货单列表 (get)
   * 
   * 发货单 start
   */

  //查询发货单列表
  async listShips (params){
    return await fetch.get(`${types.PRO_PATH}/listShips`, params)
  },

  async listStockOrders (params) {
    return await fetch.get(`${types.PRO_PATH}/listStockOrders`,params)
  },

  // 查询客户发货单详情 (get)
  async loadStockDetail (params) {
    return await fetch.get(`${types.PRO_PATH}/loadShipDetail`,params)
  },

  // 查询客户发货单商品(get)
  async loadStockProduct (params) {
    return await fetch.get(`${types.PRO_PATH}/loadStockProduct`,params)
  },

  // 查询发货单物流信息
  async loadStockPositions (params){
    return await fetch.get(`${types.PRO_PATH}/getBillLocation`, params)
  },

  // 获取发货单状态记录
  async loadStatusInfo(params){
    return await fetch.get(`${types.PRO_PATH}/getBillStatus`, params)
  },

  /** 发货单 end */

  // 客户订单评价
  async addEvaluation (params) {
    return await fetch.post(`${types.PRO_PATH}/addEvaluation`, params)
  },

  //客户评价发货单新版
  async addEvaluationV2 (params) {
    return await fetch.post(`${types.PRO_PATH}/evaluation`, params)
  },

  //客户评价详情
  async evaluationDetail (params) {
    return await fetch.get(`${types.PRO_PATH}/evaluationDetail`, params)
  },

  //客户订单签收
  async confirmReceipt (params) {
    return await fetch.post(`${types.PRO_PATH}/confirmReceipt`, params)
  },

  // 查询签收记录 (get) 回单统计
  async listSign (params) {
    return await fetch.get(`${types.PRO_PATH}/listSign`,params)
  },

  


}