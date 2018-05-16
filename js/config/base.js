/* 
* @Author: anchen
* @Date:   2018-01-18 15:38:10
* @Last Modified by:   anchen
* @Last Modified time: 2018-01-22 11:32:03
*/

// ;function J_Modified(va,reg)
// {
//     var pat=new RegExp(reg);
//     if(!pat.test(va)) 
//         {
//             //alert(reg);
            
//         }; 
// }
// 
// 
// 
// 
//图片上传
    // var fileM = document.querySelector("#productMachine_picurl");
    // $("#productMachine_picurl").on("change",function(){
    //         alert(1)
    //           //获取文件对象，files是文件选取控件的属性，存储的是文件选取控件选取的文件对象，类型是一个数组
    //           var fileObj=fileM.files[0];
    //           //创建formdata对象，formData用来存储表单的数据，表单数据时以键值对形式存储的。
    //           var formData=new FormData();
    //           formData.append('file',fileObj);
    //         //创建ajax对象
    //          var ajax=new XMLHttpRequest();
    //          //发送POST请求
    //          ajax.open("POST","http://10.0.0.8:8080/upload_file",true);
    //          ajax.send(formData);
    //          ajax.onreadystatechange=function(){
    //          if (ajax.readyState == 4) {
    //               if (ajax.status>=200 &&ajax.status<300||ajax.status==304) {
    //                   console.log(ajax.responseText);
    //                   var obj=JSON.parse(ajax.responseText);
    //                   if(obj.err == 0){
    //                    //上传成功后自动动创建img标签放在指定位置
    //                    var img =$("<img src='"+obj.msg+"' alt='' />");
    //                   }else{
    //                    alert(obj.msg);
    //                   }
    //               }
    //      }
    //  }
    // });