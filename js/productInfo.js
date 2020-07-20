Vue.component('productInfo', {
  template: `<div class="modal" id="productInfo" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">商品資訊</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="row">
            <div class="col-sm-6">
              <div class="form-group">
                <label for="productName">商品名稱</label>
                <input type="text" id="productName" class="form-control" placeholder="請輸入商品名稱"
                  v-model="tempProduct.title" required>
              </div>
              <div class="form-row">
                <div class="form-group col-sm-8">
                  <label for="category">分類</label>
                  <input id="category" type="text" class="form-control" v-model="tempProduct.category"
                    placeholder="請輸入分類" required>
                </div>
                <div class="form-group col-sm-4">
                  <label for="productUnit">商品單位</label>
                  <input type="text" d="productUnit" class="form-control" i placeholder="請輸入商品單位"
                    v-model="tempProduct.unit" required>
                </div>
              </div>
              <div class="form-row">
                <div class="form-group col-sm-6">
                  <label for="productOrignalPrice">商品原價</label>
                  <input type="number" id="productOrignalPrice" class="form-control" placeholder="請輸入商品原價"
                    v-model="tempProduct.origin_price" required>
                </div>
                <div class="form-group col-sm-6">
                  <label for="productPrice">商品售價</label>
                  <input type="number" id="productPrice" class="form-control" placeholder="請輸入商品售價"
                    v-model="tempProduct.price">
                </div>
              </div>
              <div class="form-group">
                <label for="productDescription">商品描述</label>
                <textarea id="productDescription" class="form-control" placeholder="請輸入商品描述"
                  v-model="tempProduct.description" required></textarea>
              </div>
              <div class="form-group">
                <label for="productContent">商品內容</label>
                <textarea id="productContent" class="form-control" placeholder="請輸入商品內容"
                  v-model="tempProduct.content"></textarea>
              </div>
              <div class="form-group">
                <div class="form-check">
                  <input id="enabled" v-model="tempProduct.enabled" class="form-check-input" type="checkbox">
                  <label class="form-check-label" for="enabled">是否啟用</label>
                </div>
              </div>
            </div>
            <div class="col-sm-6">
                <div v-for="i in 5" :key="i + 'img'" class="form-group">
                    <label :for="'img' + i">輸入圖片網址</label>
                    <input :id="'img' + i" v-model="tempProduct.imageUrl[i - 1]" type="text" class="form-control"
                    placeholder="請輸入圖片連結">
                </div>
                <div class="form-group">
                    <label for="customFile">
                    或 上傳圖片
                    <i v-if="status.fileUploading" class="fas fa-spinner fa-spin"></i>
                    </label>
                    <input id="customFile" ref="file" type="file" class="form-control" @change="uploadFile">
                </div>
                <img class="img-fluid" :src="tempProduct.imageUrl[0]" alt="商品圖片">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-info" @click="updateProduct">儲存</button>
        </div>
      </div>
    </div>
  </div>`,
  data() {
    return {
      tempProduct: {
        imageUrl: [],
      },
    };
  },
  props: ['isNew', 'status', 'user'],
  methods: {
    // 取得單一商品資訊
    getProduct(id) {
      const api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${id}`;
      axios.get(api).then((res) => {
        $('#productInfo').modal('show');
        this.tempProduct = res.data.data;
      }).catch((err) => {
        alert(err);
      });
    },
    // 新增或更新單一商品資料
    updateProduct() {
      // 新增商品
      let api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product`;
      let callMethod = 'post';
      // 更新商品
      if (!this.isNew) {
        api = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;
        callMethod = 'patch';
      }
      // call api 處理資料，並關閉 modal
      axios[callMethod](api, this.tempProduct).then(() => {
        $('#productInfo').modal('hide');
        this.$emit('update');
      }).catch((err) => {
        alert(err)
      });
    },
    // 上傳檔案
    uploadFile() {
      const uploadedFile = this.$refs.file.files[0];
      const formData = new FormData();
      formData.append('file', uploadedFile);
      const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/storage`;
      this.status.fileUploading = true;
      axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => {
        this.status.fileUploading = false;
        if (res.status === 200) {
          this.tempProduct.imageUrl.push(res.data.data.path);
        }
      }).catch(() => {
        alert('上傳不可超過 2 MB');
        this.status.fileUploading = false;
      });
    },
  },

});