 function upload() {
     var name = document.getElementsByName('name')[0].value
     var image_school = document.getElementsByName('image_school')[0].files[0]
     var image_current = document.getElementsByName('image_current')[0].files[0]
     console.log('image_school :', image_school)
     console.log('image_current :', image_current)
     if (!name) {
         alert("请输入姓名!")
         return
     }

     if (!image_school) {
         alert("请上传你的在校照片")
         return
     }

     if (!image_current) {
         alert("请上传现在的照片")
         return
     }

     $.getJSON("http://127.0.0.1:8080/v1/token", function (result) {
         console.log('object :', result);
         uploadImage(result.token, `${name}_image_school`, image_school)
         uploadImage(result.token, `${name}_image_current`, image_current)
     });


 }


 // "xhr request failed, code: 400; response: {"
 // error ":"
 // incorrect region, please use up - z2.qiniup.com "}"
 function uploadImage(token, name, image) {
     var domain = "http://img.chongchongshi.com/"
     var config = {
         useCdnDomain: true,
         disableStatisticsReport: false,
         retryCount: 6,
         region: qiniu.region.z2
     }
     var putExtra = {
         fname: "",
         params: {},
         mimeType: null
     }
     var observable = qiniu.upload(image, name, token, putExtra, config)

     observable.subscribe({
         next: (res) => {
             // 主要用来展示进度
             let total = res.total;
             // window.Qapp.showLoad({
             //     content: '上传图片中！'
             // })
             console.log("进度：" + parseInt(total.percent) + "% ")
         },
         error: (err) => {
             // 失败报错信息
             console.log(err)
             alert("上传失败，请重试！")
         },
         complete: (res) => {
             // 接收成功后返回的信息
             console.log(domain + res.key)
         }
     })
 }