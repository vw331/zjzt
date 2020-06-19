<template>
    <div>
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>
<script>
import { XHeader, Scroller, ButtonTab, ButtonTabItem, XButton, Card } from 'vux'
import axios from '../../api/axios'

export default {
    name: 'Appointment',
    components: { 
        Card,
        XHeader, 
        ButtonTab,
        Scroller, 
        ButtonTabItem
    },
    data(){
        return {
           
        }
    }
}
</script>
<style scope>
    
</style>