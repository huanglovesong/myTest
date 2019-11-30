<template>
    <div class="mask" v-if="isShow">
        <div class="modal">
            <div class="tips-title">
                <slot name="tips-hd"></slot>
            </div>
            <div class="btn" @click="closeModal">确定</div>
        </div>
    </div>
</template>
<script>
export default {
    props:['isShow'],
    methods: {
        closeModal(){
            this.$parent.modalIsShow = false
            this.$emit('gohome')
        }
    },
}
</script>
<style scoped>
    .mask{
        position: fixed;
        width: 100vw;
        height: 100vh;
        top: 0;
        left: 0;
        z-index: 1000;
        background: rgba(0, 0, 0, .6)
    }
    .modal{
        width: 300px;
        min-height: 150px;
        position: fixed;
        padding: 20px;
        box-sizing: border-box;
        margin: auto;
        left: 0;
        right: 0;
        top: 30%;
        z-index: 1001;
        background:linear-gradient(180deg, #052733, #03161E);
        background:-webkit-linear-gradient(top, #052733, #03161E);
        color: #fff;
        text-align: center;
    }
    .tips-title{
        padding-top: 20px;
        font-size: 14px;
        color: #939997;
    }
    .btn{
        width: 80%;
        margin: 20px auto 0;
        padding: 10px 0;
        font-weight: bold;
        background: #c8b283;
        border-radius: 8px;
        cursor: pointer;
    }
</style>