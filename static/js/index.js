Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: ImgConf.error,
    loading: ImgConf.loading,
    attempt: 1,
    // the default is ['scroll', 'wheel', 'mousewheel', 'resize', 'animationend', 'transitionend']
    listenEvents: ['scroll']
})


new Vue({
    el: '#app',
    name: 'MacBookmark',
    data: function () {
        return {
            isLoading: false,
            recordList: [],
            isShowDialog: false,
            tmpItem: {
                dateAdded: '',
                imgUrl: '',
                preview: '',
                title: '',
                url: ''
            }
        }
    },
    computed: {
        xxx: function () {
            return ''
        }
    },
    mounted() {
        this.isLoading = true
        getData().then(resp => {
            this.recordList = resp
            // console.log('OK: ', resp)
        }).finally(() => {
            this.isLoading = false
        })
    },
    methods: {
        doShowRecord(item) {
            this.isShowDialog = true
            Object.keys(this.tmpItem).forEach(tmpKey => {
                this.tmpItem[tmpKey] = item[tmpKey]
            })
        }
    }
})