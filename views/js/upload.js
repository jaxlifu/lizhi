 function upload() {
     var name = $("#name")[0].value
     var image_school = $('#image_school')[0].files[0]
     var image_current = $('#image_current')[0].files[0]
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

     $.getJSON("http://lizhi.chongchongshi.com/v1/token", function (result) {
         console.log('object :', result);
         uploadImage(result.token, `${name}_校园`, image_school)
         uploadImage(result.token, `${name}_现在`, image_current)
     });


 }

 var success = 0

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
     $(".loadingLayer").css("display", "inline")
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
             $(".loadingLayer").css("display", "none")
             alert("上传失败，请重试！")
         },
         complete: (res) => {
             // 接收成功后返回的信息
             $(".loadingLayer").css("display", "none")
             success++
             if (success == 2) {
                 alert("上传成功，请关闭页面！")
                 $("#name")[0].value = null
                 $("#image_school")[0].value = null
                 $("#image_current")[0].value = null
             }
         }
     })
 }