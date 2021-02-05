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
            isShowDialog: false,
            tmpItem: {
                dateAdded: '',
                imgUrl: '',
                preview: '',
                title: '',
                url: ''
            },
            page: {
                pageNum: 1,
                pageCount: 0,
                total: 0,
                hasPrev: false,
                nextNum: 2,
                hasNext: true,
                items: [],
            }
        }
    },
    computed: {
        xxx: function () {
            return ''
        }
    },
    mounted() {
        // this.isLoading = true
        //         // getData().then(resp => {
        //         //     this.page.items = resp
        //         //     // console.log('OK: ', resp)
        //         // }).finally(() => {
        //         //     this.isLoading = false
        //         // })

        this.doLoadPage(1)
    },
    methods: {
        doLoadPage(page = 1) {
            this.isLoading = true
        pageItems(page).then(resp => {
            Object.keys(this.page).forEach(tmpKey => {
                this.page[tmpKey] = resp[tmpKey]
            })
            document.title = `Bookmark editor | ${this.page.pageNum}`
        }).finally(() => {
            this.isLoading = false
        })
        },
        doShowRecord(item) {
            this.isShowDialog = true
            Object.keys(this.tmpItem).forEach(tmpKey => {
                this.tmpItem[tmpKey] = item[tmpKey]
            })
        },
        doShowNext() {
            // this.$message('next')
            const idx = this.page.items.findIndex(value => {
                return value.dateAdded === this.tmpItem.dateAdded
            })
            if (idx < this.page.items.length - 1) {
                const item = this.page.items[idx + 1]
                Object.keys(this.tmpItem).forEach(tmpKey => {
                    this.tmpItem[tmpKey] = item[tmpKey]
                })
            } else {
                this.$message('没有了')
            }
        },
        doShowPrevious() {
            const idx = this.page.items.findIndex(value => {
                return value.dateAdded === this.tmpItem.dateAdded
            })
            if (idx > 0) {
                const item = this.page.items[idx - 1]
                Object.keys(this.tmpItem).forEach(tmpKey => {
                    this.tmpItem[tmpKey] = item[tmpKey]
                })
            } else {
                this.$message('没有了')
            }
        }
    }
})