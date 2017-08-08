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
      this.printStatus = '正在请求打印'
      axios.post('/', {
        type: this.type,
        content: this.content,
      })
        .then((response) => {
          console.log(response.data)
          if (response.data.ok) {
            this.printStatus = '打印成功'
            this.content = null
          } else {
            this.printStatus = '未打印，监听超时'
          }
        })
        .catch((error) => console.error(error) )
    }
  },
  mounted() {
  }
})
