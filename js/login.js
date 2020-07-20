new Vue({
    el: '#app',
    // 用來接收使用者輸入的 email 及 password，元件使用的資料得用 return的形式
    data () {
        return {
            user: {
                email: '',
                password: '',
            },
        };
    },
    methods:{
        // 登入
        login() {
            const apiUrl = `https://course-ec-api.hexschool.io/api/auth/login`;
            console.log(this.user);
            // 將 user 輸入的資料 post 給 api
            axios.post(apiUrl, this.user).then((response) => { // 接收 api 回傳的 token 及 效期
                        const token = response.data.token;
                        const expired = response.data.expired;
                        console.log(token, expired);
                        // 將收到的資訊寫進 cookie
                        document.cookie = `token=${token}; expires=${new Date(expired * 1000)}; path = /`
                        window.location = 'mainPage.html';
                    }).catch((error) => {
                        alert("帳號或密碼錯誤，請重新輸入")
                    });
        },

    },
})