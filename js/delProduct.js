Vue.component('delProduct', {
    template: `<div class="modal" id="delProduct" tabindex="-1" role="dialog">
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">刪除商品</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>執行後，<strong>{{ tempProduct.title }}</strong>將被刪除，此動作將無法恢復，確認要執行刪除？</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">取消</button>
          <button type="button" class="btn btn-danger" @click="delProduct">確認刪除</button>
        </div>
      </div>
    </div>
  </div>`,
    data() {
        return {

        };
    },
    props: ['tempProduct', 'user'],
    methods: {
        // 刪除商品
        delProduct() {
            const url = `https://course-ec-api.hexschool.io/api/${this.user.uuid}/admin/ec/product/${this.tempProduct.id}`;

            axios.delete(url).then(() => {
                $('#delProduct').modal('hide');
                this.$emit('update');
            });
        },
    }
});