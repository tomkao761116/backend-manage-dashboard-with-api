new Vue({
    el: '#app',
    data: {
        products: [],
        pagination:{},
        tempProduct: { // 這個物件到時候會放要被編輯或新增但是還沒送出的資料內容
            imageUrl:[],
        },
        isNew:false, // 判斷是新增還是更新商品資訊
        status: {
            fileUploading: false,
          },
        user:{ // 放使用者驗證資料
            token:'',
            uuid:'ea556ec5-4643-415e-96a7-36c78142eb82',
        }, 
    },
    // 取得 token 的 cookies
    created() {
        this.user.token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        // 預設帶入 token
        axios.defaults.headers.common.Authorization = `Bearer ${this.user.token}`;
        // 若 token 取得失敗，則返回登入畫面
        if(this.user.token === '') {
            window.location = 'Login.html';
        }
        
        // 有 token ，取商品資料
        this.getProducts();
    },

    methods: {
        // 取得商品資料
        getProducts(page = 1) {
            const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/products?page=${page}`;

            axios.get(api).then((res) => {
                this.products = res.data.data;
                this.pagination = res.data.meta.pagination;
            });
        },

        // 開啟  Modal
        openModal(isNew, item) {
            switch (isNew) {
                case 'new':
                    this.$refs.productInfo.tempProduct = {
                        imageUrl:[],
                    };
                    this.isNew = true;
                    $('#productInfo').modal('show');
                    break;
                case 'edit':
                    this.tempProduct = Object.assign({}, item); // 把 item 取得的 物件資料，拷貝到 tempProduct 裡
                    // 使用 refs 觸發子元件方法
                    this.$refs.productInfo.getProduct(this.tempProduct.id);
                    this.isNew = false;
                    break;
                case 'delete':
                    this.tempProduct = Object.assign({}, item);
                    $('#delProduct').modal('show');
                    break;
                default:
                    break;
            }
        },
    },
})