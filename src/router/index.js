import Vue from 'vue'
import Router from 'vue-router'
import { Cookie } from '../utils/storage'

const Bind = () => import('@/view/bind/bind.vue')
const UpdateBind = () => import('@/view/bind/updateBind.vue')
const Init = () => import('@/view/layout/index')
const Truckbill = () => import('@/view/truckInfo/index')
const Vehicleinfo = () => import('@/view/vehicleinfo')
const Invoicebill = () => import('@/view/invoicebill/index')
const OrderDetail = () => import('@/view/invoicebill/orderDetail')
const DeliveryInfo = () => import('@/view/deliveryInfo/index')
const DriverOperation = () => import('@/view/driverOperation/index')
const DispatchList = () => import('@/view/dispatchList/index')
const PickGoodsSign = () => import('@/view/driverOperationStatus/pickGoodsSign')
const UpdateStatus = () => import('@/view/driverOperationStatus/updateStatus')
const UpdateOnroad = () => import('@/view/driverOperationStatus/updateOnroad')
const DriverScene = () => import('@/view/driverOperationStatus/driverScene')
const ReceiptConfirm = () => import('@/view/receiptConfirm/index')
const ESignature = () => import('@/view/eSignature/index')
const SurveyInfo = () => import('@/view/surveyInfo/index')
const ReceiptStatistics = () => import('@/view/receiptStatistics/index')
const SurveyQuestions = () => import('@/view/surveyQuestions/index')
const AddOpinion = () => import('@/view/addOpinion/index')
const Redo = () => import('@/components/redo')
const OrderSearch = () => import('@/view/order/orderSearch')
const ProductDetail = () => import('@/view/order/productDetail')
const GoodsDetail = () => import('@/view/order/goodsDetail')
const BillSearch = () => import('@/view/bill/list')
const BillDetail = () => import('@/view/bill/index')
const LogisticsTrace = () => import('@/view/logisticsTrace')
const RealOrderDetail = () => import('@/view/order/OrderDetail')
const Appointment = () => import('@/view/appointment/index')
const AppointmentList = () => import('@/view/appointment/list')
const AppointmentView = () => import('@/view/appointment/view')
const AppointmentEdit = () => import('@/view/appointment/edit')

Vue.use(Router)

export const router = new Router({
  base: __dirname,
  likActiveClass: 'link-active',
  mode: 'hash',
  routes: [
    {
      path: '/bind', // 用户绑定
      name: 'Bind',
      component: Bind,
      meta: { bind: false, faKeepAlive: false }
    },
    {
      path: '/updateBind', // 用户修改
      name: 'UpdateBind',
      component: UpdateBind,
      meta: { bind: true, faKeepAlive: false }
    },
    {
      path: '/redo', // 功能是否重复操作
      name: 'Redo',
      component: Redo,
      meta: { bind: false, faKeepAlive: false }
    },
    {
      path: '/orderSearch', 
      name: 'OrderSearch',
      component: OrderSearch,
      meta: { bind: true, faKeepAlive: true }
    },
    {
      path: '/billSearch',
      name: 'BillSearch',
      component: BillSearch,
      meta: { bind: true, faKeepAlive: true }
    },
    {
      path: '/receiptStatistics', // 回单统计 
      name: 'ReceiptStatistics',
      component: ReceiptStatistics,
      meta: { bind: true, faKeepAlive: false } 
    },
    {
  		path: '/init', // 带统一头部菜单二级路由(只有标题)
      name: 'Init',
      component: Init,
      meta: { bind: true, faKeepAlive: false },
      children: [
        {
          path: 'readOrderDetail/:id', //订单详情
          name: 'readOrderDetail',
          component: RealOrderDetail,
          meta: { bind: true, keepAlive: true } 
        },
        {
          path: 'invoicebill/', // 发货单 订单详情
          name: 'Invoicebill',
          meta: { bind: true, keepAlive: true },
          component: Invoicebill
        },
        {
          path: 'billDetail/:id', //发货单详情
          name: 'BillDetail',
          meta: { bind: true, keepAlive: true },
          component: BillDetail
        },
        {
          path: 'orderDetail', // 货品详情
          name: 'OrderDetail',
          meta: { bind: true, keepAlive: false },
          component: OrderDetail
        },
        {
          path: 'truckbill', // 调度单详情
          name: 'Truckbill',
          component: Truckbill,
          meta: { bind: true, keepAlive: false }
        },
        {
          path: 'truckInfo', // 调度单/装车单 详情 用于微信菜单 (调度派车)
          name: 'TruckInfo',
          redirect: {name: 'DispatchList', query: { routeName: 'TruckInfo'}}, // 重定向到调度单列表
          meta: { bind: true, keepAlive: false }
        },
        {
          path: "dispatchList", // 司机查看调度单列表 (司机作业)
          name: 'DispatchList',
          component: DispatchList,
          meta: { bind: true, keepAlive: false, routeName: 'DispatchList' } 
        },
        {
          path: 'vehicleinfo', // 司机信息填写修改
          name: 'Vehicleinfo',
          component: Vehicleinfo,
          meta: { bind: true, keepAlive: false }
        },
        {
          path: 'deliveryInfo', // 提货单详情
          name: 'DeliveryInfo',
          component: DeliveryInfo,
          meta: { bind: true, keepAlive: false }
        },
        {
          path: 'surveyInfo', // 满意度调查详情
          name: 'SurveyInfo',
          component: SurveyInfo,
          meta: { bind: true, keepAlive: false }
        },
        {
          path: 'surveyQuestions', // 满意度调查问卷
          name: 'SurveyQuestions',
          component: SurveyQuestions,
          meta: { bind: true, keepAlive: false }
        },
        {
          path: 'addOpinion', // 新增投诉建议
          name: 'AddOpinion',
          component: AddOpinion,
          meta: { bind: true, keepAlive: false }
        },
        {
          path: 'pickGoodsSign', // 司机到库签到
          name: 'PickGoodsSign',
          component: PickGoodsSign,
          meta: { bind: true, keepAlive: false }
        },
        {
          path: 'driverOperation', // 司机作业 任务管理
          name: 'DriverOperation',
          component: DriverOperation,
          meta: { bind: true, keepAlive: false }
        },
        {
          path: 'updateStatus', // 司机查看调度单列表
          name: 'UpdateStatus',
          component: UpdateStatus,
          meta: { bind: true, keepAlive: false } 
        },
        {
          path: 'updateOnroad', // 司机在途信息填报 
          name: 'UpdateOnroad',
          component: UpdateOnroad,
          meta: { bind: true, keepAlive: false } 
        },
        {
          path: 'driverScene', // 司机采景(特指订单) 
          name: 'DriverScene',
          component: DriverScene,
          meta: { bind: true, keepAlive: false } 
        },
        {
          path: 'receiptConfirm', // 实物回单(订单操作)
          name: 'ReceiptConfirm',
          component: ReceiptConfirm,
          meta: { bind: true, keepAlive: false } 
        },
        {
          path: 'eSignature', // 电子签收(订单操作) 
          name: 'ESignature',
          component: ESignature,
          meta: { bind: true, keepAlive: false } 
        },
        {
          path: 'productDetail', // 货品列表
          name: 'ProductDetail',
          component: ProductDetail,
          meta: { bind: true, keepAlive: false } 
        },
        {
          path: 'goodsDetail', // 货品详情
          name: 'goodsDetail',
          component: GoodsDetail,
          meta: { bind: true, keepAlive: false } 
        },
        {
          path: 'logisticsTrace/:billCode', //物流轨迹
          name: 'logisticsTrace',
          component: LogisticsTrace,
        },
        {
          path: 'appointment/:type', //预约
          name: 'appointment',
          component: Appointment,
          children: [
            { path: 'list', name: 'appointmentList', component: AppointmentList, meta: { keepAlive: true } },
            { path: 'view/:id', name: 'appointmentView', component: AppointmentView, meta: { keepAlive: false } },
            { path: 'add', name: 'appointmentEdit', component: AppointmentEdit, meta: { keepAlive: false }}
          ]
        }
      ]
    },
    /**
     * 如果默认路由为空，则说明不是模板消息访问app，重定向到cookie保存的路由名称
     */
    {
      path: '*',
      redirect: { name: Cookie.get('routeName') ? Cookie.get('routeName') : 'Bind' },
    },
    
  ],

})



