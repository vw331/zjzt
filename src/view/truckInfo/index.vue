<template>
	<div class="truck-info">
		<div v-if="['2', '3', '6'].includes(this.role)">
			<group label-width="6.5em">
				<cell title="承运商">{{item.carrier_name}}</cell>
				<cell title="单号"><div class="bill-number" @click="toInvoicebill">{{item.bol_code}}</div></cell>
				<cell title="状态">{{dispatchStatus(item.dispatch_status)}}</cell>
				<cell title="发货单数量">{{item.invoice_quantity}}</cell>
				<cell title="件数">{{item.total_quantity}}</cell>
				<cell title="重量">{{item.weight}} KG</cell>
				<cell title="体积">{{item.volume}} m³</cell>
				<cell title="是否多点配送">{{item.multipoint}}</cell>
				<cell title="配送点位数">{{item.delivery_num}}</cell>
				<cell title="配载类型">{{item.stowage_type}}</cell>
				<cell title="最晚提货时间">{{item.time_limit}}</cell>
				<cell title="最晚送达时间">{{item.timeArrival}}</cell>
				<cell title="月台">{{item.platform}}</cell>
				<cell title="备注信息" value-align="left">{{item.remark}}</cell>
			</group>
			<div v-if="item.dispatch_status !== '1'" class="operate">
					<flexbox v-if="item.dispatch_status === '0'">
						<flexbox-item>
							<x-button type="warn" @click.native="beReject">拒绝</x-button>
						</flexbox-item>
						<flexbox-item>
							<x-button type="primary" @click.native="beAccept" >受理</x-button>
						</flexbox-item>
					</flexbox>
					<div v-else style="width:100%;text-align:center;height:40px;line-height:40px;color:grey;">
						已拒绝
					</div>
			</div>
			<div v-if="item !== '' && item.dispatch_status === '1'" class="truck-vehicleinfo">
				<!-- <div class="title"><strong>派车信息</strong></div> -->
				<group title="派车信息" label-width="8em">
					<cell title="司机">{{item.driver_name}}</cell>
					<cell title="手机号">{{item.driver_phone}}</cell>
					<cell title="车牌号">{{item.license}}</cell>
					<cell title="车型">{{item.vehicle}}</cell>
					<cell title="证件号">{{item.driving_license}}</cell>
				</group>
				<div class="btn" v-if="curStatus[item.status] < 4">
					<x-button mini  type="primary" @click.native="updataLicence">更改派车信息</x-button>
				</div>
			</div>
			<div v-transfer-dom>
				<confirm v-model="showPopup"
					show-input
					placeholder="填写拒绝理由"
					:title="'您确定要拒绝此调度单吗 ?'"
					@on-cancel="popupOnCancel"
					@on-confirm="popupOnConfirm">
				</confirm>
			</div>
		</div>
		<no-permission v-else></no-permission>
	</div>

</template>

<script>
import { Group, Cell, CellBox, XButton, Flexbox, FlexboxItem, Confirm, XSwitch, TransferDomDirective as TransferDom  } from 'vux'
import axios from '../../api/axios'
import * as types from '../../utils/constant'
import { Cookie } from '../../utils/storage'
import NoPermission from '../../components/noPermission.vue'

export default {
	directives: {
    TransferDom
  },
	name: 'TruckInfo',
	components: { Group, Cell, CellBox, XButton, Flexbox, FlexboxItem, Confirm, XSwitch, NoPermission },
	data () {
		return {
			item: '',
			showPopup: false,
			role: '',
			curStatus : {'O': -2, 'A': -1, 'C': 0,  'W': 1, 'E': 2, 'L': 3, 'T': 4, 'D': 5, 'R': 6, 'G': 7 },
			curStatusDetail : { 'O': '已打开', 'A': '已生效', 'C': '已取消', 'W': '提货点签到', 'E': '提货确认', 'L': '装车完成', 'T': '发运', 'D': '运抵', 'R': '已回单','G': '已签收' },
		}
	},
	mounted() {
		this.$store.commit('updateTitle',types.TRUCK_INFO_TITLE)
		// 获取Cookie绑定信息, 判断当前用户角色 
		this.role = Cookie.get('roleId')
		types.DEBUG_MODE ? this.role = '3' : null
		if( ['2', '3', '6'].includes(this.role) ) {
			let params = {
				truck_loading_no: this.$route.query.truck_loading_no
			}
			this.getTruckInfo(params)
		}
	},
	/**
	 * 监听 $route的变化
	 * 解决 $router.go 页面跳转 数据缓存问题
	 */
	watch : {
		'$route' () {
			if(this.$route.name === 'Truckbill' || this.$route.name === 'TruckInfo') {
				this.$store.commit('updateTitle',types.TRUCK_INFO_TITLE)
				if( this.role === '3' ) {
					let params = {
						truck_loading_no: this.$route.query.truck_loading_no
					}
					this.getTruckInfo(params)
				}
			}
		}
	},
	methods: {
		/**
		 * 调度单 3种状态
		 */
		dispatchStatus(status) {
			let statusStr = ""
			switch(status) {
				case '0' : statusStr = '待接收'; break;
				case '1' : statusStr = '已调度'; break;
				case '2' : statusStr = '已拒绝'; break;
			}
			return statusStr
		},
		/**
		 * 承运商拒绝调度单
		 */
		beReject() {
			this.showPopup = true
		},
		popupOnConfirm(value) {
			console.log('value='+value)
			if(value !== null && value !== '') {
				let params = {
					truck_loading_no:  this.$route.query.truck_loading_no,
					reason: value
				}
				this.$store.commit('updateLoading', true)
				axios.doRejectBill(params).then( (res) => {
					this.$store.commit('updateLoading', false)
					if(res.code === 0){
						this.$vux.toast.text('操作成功, 您已拒绝该调度单', 'middle')
						this.item.dispatch_status = '2' // 状态改为已拒绝
					}else {
						this.$vux.toast.text(res.message, 'middle')
					}
				}, (error) => {
						this.$store.commit('updateLoading', false)
				})
			}else {
					this.$vux.toast.text('拒绝理由不能为空哦~', 'middle')
			}
		},
		/**
		 * 承运商接受调度单
		 */
		beAccept() {
			let params = {
				truck_loading_no:  this.$route.query.truck_loading_no,
				accept: true,
				item: this.item
			}
			this.$router.push({path:'/init/vehicleinfo', query: params})
		},
		/**
		 * 承运商更新车牌信息
		 */
		updataLicence () {
			let params = {
				truck_loading_no: this.$route.query.truck_loading_no,
				accept: true,
				item: this.item
			}
			let vue = this
			vue.$vux.confirm.show({
				title:'更改派车信息',
				content: '您确定要更改派车信息 ?',
				onCancel () {
					console.log('cancel') 
				},
				onConfirm () {
					vue.$router.push({path:'/init/vehicleinfo', query: params})
				}
			})
		},
		/**
		 * 跳转发货单详情列表
		 */
		toInvoicebill() {
			let params = {
				truck_loading_no: this.$route.query.truck_loading_no,
				invoicebill: this.item
			}
			this.$router.push({path:'/init/invoicebill', query: params})
		},
		/**
		 * 发货单详情信息
		 */
		getTruckInfo(params) {
			this.$store.commit('updateLoading', true)
			axios.getTruckInfo(params).then( (res) => {
				this.$store.commit('updateLoading', false)
				if(res.code === 0){
					this.item = res.data
				}else {
					this.$vux.toast.text(res.message, 'middle')
				}
			}, (error) => {
					console.log("error="+JSON.stringify(error))
					this.$store.commit('updateLoading', false)
			})
		},
	}
}
</script>

<style>
	.truck-info .card-body {
		padding: 6px 14px;
	}
  .truck-info {
		margin-top:46px;
	}
	.truck-info .bill-number{
		color: #3b6ddd;
	}
	.truck-info .operate {
		padding: 14px;
	}
	.truck-info .truck-vehicleinfo {
		margin-top:14px;
	}
	.truck-info .truck-vehicleinfo .title {
		padding-left:14px;
		color: #3b6ddd;
	}
	.truck-info .truck-vehicleinfo .btn {
		width:100%;
		text-align: center;
		padding:14px;
	}
</style>