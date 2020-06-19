<template>
    <div class="main-view">
        <flexbox orient="vertical" gutter=0 class="full-height">
            <flexbox-item>
                <div ref="tmap" class="full-height">

                </div>
            </flexbox-item>
            <flexbox-item style="overflow:hidden">
    
                <div class="down-wrap">
                    <p v-if="warehousePosition" class="p-xs">仓库地点: {{ warehousePosition.warehouseAddress }}</p>
                    <timeline v-if="billStatus.length">
                        <timeline-item v-for="(item, index) in billStatus" :key='index'>
                            <p class="recent"><strong>【{{ item.statusDes }}】</strong></p>
                            <p class="small">{{ item.createTime }}</p>
                        </timeline-item>                      
                    </timeline>
                    <p v-else class="text-center p-md">暂无物流信息</p>
                </div>
                
            </flexbox-item>
        </flexbox>
    </div>
</template>

<script>
import { Timeline, TimelineItem, Flexbox, FlexboxItem } from 'vux'
import axios from '../../api/axios'

const tmap = (() => {

    let map = null
    let iconImg = 'https://lbs.qq.com/javascript_v2/img/busmarker.png'

    const init = (dom) => {
        let options = {
            center: new qq.maps.LatLng(30.11, 120.30),
            zoom: 9,
            draggable: true,
            scrollwheel: true,
            disableDoubleClickZoom: true,
            disableDefaultUI: true 
        }
        map = new qq.maps.Map(dom, options)

    }

    const createMarker = (type, point) => {

        let icon = null;

        switch(type){
            case 'start':
                icon = new qq.maps.MarkerImage(
                    iconImg, 
                    new qq.maps.Size(24, 36)
                );
                break;
            case 'end':
                icon = new qq.maps.MarkerImage(
                    iconImg, 
                    new qq.maps.Size(24, 36),
                    new qq.maps.Point(24, 0)
                );
                break; 
            case 'runing':
                icon = new qq.maps.MarkerImage(
                    iconImg, 
                    new qq.maps.Size(24, 36),
                    new qq.maps.Point(48, 0)
                );
                break;                  
        }

        let marker = new qq.maps.Marker({
            icon: icon,
            position: point ,
            map: map,
            zIndex:1
        })

         map.panTo( point );

    }

    const drawPath = points => {

        if( !points.length ){
            return false;
        }

        let path = [...points]
        
        let polyline = new qq.maps.Polyline({
            path: path,
            strokeColor: '#0e88eb',
            strokeWeight: 5,
            editable: false,
            map
        });

        map.fitBounds(polyline.getBounds()) 
    }

    return { init, drawPath, createMarker }

})();

export default {
    name: 'LogisticsTrace',
    components: { Flexbox, FlexboxItem, Timeline, TimelineItem  },
    data(){
        return {
            billCode: this.$route.params.billCode,
            warehousePosition: null,
            positions: [],
            billStatus: []
        }
    },
    created(){
        this.$store.commit('updateTitle', '物流信息')   
    },
    mounted(){

        tmap.init( this.$refs.tmap )
        this.loadPositionInfo()

    },
    methods: {        
        loadPositionInfo(){ //获取位置信息

            this.$store.commit('updateLoading', true)

            return axios.loadStockPositions({ bill_code: this.billCode })
                .then( res => {

                    if( res.data.warehousePosition !== undefined ){
                        this.warehousePosition = res.data.warehousePosition
                    }

                    this.billStatus = [ ...res.data.statusList ]
                    this.positions = [ ...res.data.locationList ]
                    this.renderMap()
                })
                .finally( res => {
                
                    this.$store.commit('updateLoading', false)
                    
                })
                
        },
        renderMap(){
            
            if( this.warehousePosition ){

                let startPoint = new qq.maps.LatLng( this.warehousePosition.warehouseLatitude, this.warehousePosition.warehouseLongitude )
                tmap.createMarker( 'start', startPoint )

            }else{

            
                let isEnd =  this.billStatus.some(item => item.status == 'D' )

                let points =  this.positions.map(item => {
                        return new qq.maps.LatLng(item.latitude , item.longitude) 
                    })

                // qq.maps.convertor.translate(points, 1, result => {

                //     let isEnd =  this.billStatus.some(item => item.status == 'D' )

                //     tmap.drawPath( result )
                //     tmap.createMarker( 'start', result[0] )
                //     result.length>2 && tmap.createMarker( isEnd ? 'end': 'runing', result[ result.length - 1] )

                // })
                tmap.drawPath( points )

                if( points.length ){
                    tmap.createMarker( 'start', points[0] )
                }

                if(points.length > 2 ) {  
                    tmap.createMarker( isEnd ? 'end': 'runing', points[ points.length - 1] )
                }

            }

        }
    }
}
</script>

<style scoped>
    .down-wrap {
        height: 100%;
        overflow: auto;
        padding: 0 1rem;
        background-color: #ffffff
    }
    
</style>