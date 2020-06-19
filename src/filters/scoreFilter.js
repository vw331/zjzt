
const scoreFilter = {
    overallDes(score){  //整体评价
        let describe = { "5": "很满意", "4": "满意", "3": "一般", "2": "较差", "1": "很差" }
        return describe[score] || '未定义状态'
    },
    respondDes(score){ //接单速度
        let describe = { "5": "接单快速", "4": "配货准确", "3": "包装损毁", "2": "货物丢失", "1": "杳无音讯" }
        return describe[score] || '未定义状态'
    },
    serviceDes(score){ //服务评价
        let describe = { "5": "服务贴心", "4": "服务良好", "3": "爱理不理", "2": "推诿偷懒", "1": "吵架谩骂" }
        return describe[score] || '未定义状态'
    },
    transportDes(score){ //物流评价
        let describe =  { "5": "到货适时", "4": "没有迟到", "3": "部分漏发", "2": "严重迟到", "1": "货物丢失" }
        return describe[score] || '未定义状态'   
    }
} 

export default scoreFilter