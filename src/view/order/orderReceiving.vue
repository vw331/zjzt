<template>
    <confirm v-model="show"
        title="确定签收"
        @on-cancel="onCancel"
        @on-confirm="onConfirm"
        @on-show="onShow"
        @on-hide="onHide">
            <p style="text-align:center;">确定签收？</p>
    </confirm>
</template>
<script>
import { Confirm } from 'vux'

export default {
    name: "orderReceiving",
    components: { Confirm },
    props: ['show', 'id'],
    data(){
        return {}
    },
    methods: {
        onCancel(){},
        onConfirm(){
            this.$emit('change', 'success')
        },
        onHide(){
            this.$emit('hide')
        }
    }
}
</script>
<style scope>
    
</style>