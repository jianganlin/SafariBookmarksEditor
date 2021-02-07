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
                url: '',
                id: null
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
        document.getElementById('app').style.display = "block"
        this.doLoadPage(1)
    },
    methods: {
        doLoadPage(page = 1) {
            this.isLoading = true
            pageItems(page).then(resp => {
                Object.keys(this.page).forEach(tmpKey => {
                    this.page[tmpKey] = resp[tmpKey]
                })
                document.title = `Bookmark editor | Page ${this.page.pageNum}`
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
        },
        doDeleteOne(id) {
            this.isLoading = true
            deleteOne(id).then(resp => {
                this.isShowDialog = false
                const idx = this.page.items.findIndex(value => {
                    return value.id === id
                })
                if (idx >= 0) {
                    this.page.items.splice(idx, 1)
                }
            }).catch(err => {
                this.$message(`操作失败 (${err.message})`)
            }).finally(() => {
                this.isLoading = false
            })
        },
        doSync() {
            this.$confirm('这是一个危险操作, 将会覆盖文件~/Library/Safari/Bookmarks.plist', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this._syncData()
            }).catch(() => {
            });
        },
        _syncData() {
            this.isLoading = true
            syncToSafari().then(resp => {
                this.$message({
                    message: '操作成功',
                    type: 'success'
                })
            }).catch(error => {
                this.$message(`操作失败 (${err.message})`)
            }).finally(() => {
                this.isLoading = false
            })
        }
    }
})