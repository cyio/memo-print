const uploader = new qq.FineUploader({
  debug: true,
  element: document.getElementById("uploader"),
  paste: {
    targetElement: document.getElementById("uploader")
  },
  request: {
    endpoint: '/upload'
  }
})

new Vue({
  el: '#app',
  data: {
    content: null,
    type: 'text',
    printStatus: ''
  },
  methods: {
    submit() {
      const self = this
      this.printStatus = '正在请求打印'
      axios.post('/', {
        type: this.type,
        content: this.content,
      })
        .then(function (response) {
          if (response.data.ok) {
            self.printStatus = '打印成功'
            self.content = null
          } else {
            self.printStatus = '未打印，监听超时'
          }
        })
        .catch(function (error) {
          console.error(error);
        });
    }
  },
  mounted() {
  }
})
