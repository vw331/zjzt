<template>
    <div class="main-view">
        <scroller lock-x scrollbar-y use-pullup :pullup-config="pullupConfig" :height="scrollerHeight" ref="scroller" @on-pullup-loading="loadMore" 
            style="position:relative;top:2px;">
            <div class="appointment-list">
                <card class="item-card" v-for="item in list" :key="item.index" @click.native="handleClick(item)">
                    <div slot="header" class="vux-1px-b card-header">
                        <span class="pull-right" v-bind:class="getStatusStyle(item.status)">{{item.statusDes}}</span>
                        <p><i class="fa fa-clock-o"></i> 预约时间 :  <span class="ticket-code">{{item.arriveTime}}</span></p>
                    </div>
                    <div slot="content" class="card-body">
                        <div class="m-b-xs">
                            <p>预约仓库：{{item.warehouseName}}</p> 
                            <p>仓库地址：{{item.warehouseAddress}}</p> 
                            <p>司机：{{item.driverName}}&nbsp;&nbsp;<small>{{item.driverPhone}}</small></p>
                            <p v-if="item.remark">备注：{{ item.remark }}</p>
                            <P v-if="item.status == '2'">失败原因: <span class="text-danger">{{item.statusReason}}</span></P>
                        </div>
                    </div>
                </card>
                <p class="p-h-lg" style="text-align: center" v-if="showEmptyText">暂无数据</p>
            </div>
        </scroller>
    </div>
</template>
<script>
import { XHeader, Scroller, ButtonTab, ButtonTabItem, XButton, Card } from 'vux'
import axios from '../../api/axios'

export default {
    name: 'AppointmentList',
    components: { 
        Card,
        XHeader, 
        ButtonTab,
        Scroller, 
        ButtonTabItem
    },
    data(){
        return {
            type: this.$route.params.type,
            list: [],
            pageNum: 1,
            pageSize: 10,
            scrollerHeight: '100%',
            showEmptyText: false,
            pullupConfig: {
                content: '上拉加载更多',
                pullUpHeight: 60,
                height: 40,
                autoRefresh: false,
                downContent: '释放后加载',
                upContent: '上拉加载更多',
                loadingContent: '加载中...',
                clsPrefix: 'xs-plugin-pullup-'
            }    
        }
    },
    created(){

       
    },
    activated () {
      this.scrollerHeight = ((document.documentElement.offsetHeight || document.body.offsetHeight) - 46 - 44)+'px';
    },
    mounted(){

        this.$nextTick(() => {
            this.$refs.scroller.disablePullup()
            this.$refs.scroller.reset({top: 0})
        })
        this.loadData()

    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            let createdButton = {
                template: '<x-button @click="handleClick">新增</x-button>',
                methods: {
                    handleClick() {
                        vm.createItem()
                    }
                }
            }

            vm.$store.commit('updateShowBack', false)
            vm.$store.commit('updateTitle', vm.typeDes)
            vm.$store.commit('updateRightComponent', createdButton )
        })
    },
    beforeRouteLeave (to, from , next) {
        this.$store.commit('updateRightComponent', null )
        from.meta.keepAlive = true
        next()
    },
    methods: {
        createItem(){
            let goto = this.$route.path.replace("list", "add")
            this.$router.push({ 
                path: goto
            })
        },
        loadData(callback){
            let params = {
                type: this.type,
                pageNum: this.pageNum,
                pageSize: this.pageSize
            }
            this.$store.commit('updateLoading', true)
            axios.getReservation(params)
                .then(res => {

                    const { data, code, message } = res

                    if(code !== 0){
                        this.$vux.toast.text(message)
                        this.showEmptyText = true
                        this.$refs.scroller.disablePullup()
                        return false
                    }

                    this.list = [ ...this.list, ...data ]
                    this.$nextTick(() => {

                        this.$refs.scroller.enablePullup() 
                        if(data.length < this.pageSize ){
                            this.$vux.toast.text('没有更多数据了!')
                            this.$refs.scroller.disablePullup()
                        }
                    })

                })
                .finally( res => { 
                    this.$nextTick(() => {
                        this.$refs.scroller.donePullup()
                        this.$refs.scroller.reset()
                    })
                    this.$store.commit('updateLoading', false)
                })
        },
        loadMore(){
            this.pageNum ++
            this.loadData()
        },
        getStatusStyle(status){
            let styleMap = {
                "0": "text-warning", //提交
                "1": "text-primary", //确认
                "2": "text-danger" //拒绝
            }
            return styleMap[status]
        },
        handleClick(item){
            this.$router.push({ 
                name: 'appointmentView',
                params: {
                    type: this.type,
                    id: item.id
                }
            })
        }
    },
    computed: {
        typeDes(){
            let typeMap = {
                "0": "送货预约",
                "1": "提货预约"                
            }
            return typeMap[this.type]
        }
    }
}
</script>
<style scope>
    .appointment-list { padding: 10px 0; }
    .item-card {
        margin: 10px;
        padding: 5px 5px 0;
        background: white;
        border-radius: 10px;
    }
    .item-card .card-header {
        padding: 5px 10px !important;
    }
    .item-card .card-footer {
        position: relative;
        padding: 5px
    }
    .item-card .card-body {
        padding: 10px;
    }
</style>