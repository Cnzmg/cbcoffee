/*
* @Author: chen
* @Date:   2018-01-16 11:42:46
* @Last Modified by:   chen
* @Last Modified time: 2018-03-01 19:47:31
*/
//测试版地址
var httpJoin = "http://test.cbcoffee.cn:8080/";  //接口地址
var httpUpload = "http://test.cbcoffee.cn:8085/";  //上传接口地址
var localURL = "/manage/"; // uri/  改版cdn 线上不加速 http://39.108.88.107:8081/manage/   test hbuilder ftp2.0
var delFileUrl = 'http://www.cbcoffee.cn';
//var delFileUrl = 'http://www.cbcoffee.cn';
//线上地址
//var httpJoin = "http://mapi.cbcoffee.cn/";  //接口地址
//var httpUpload = "http://39.108.88.107:8080/";  //线上上传接口地址
// var localURL = "http://admin.cbcoffee.cn/manage/"; // cdn 线上不加速 http://39.108.88.107:8081/coffeeManagement/
var __load = window,jzm = {},errorCode = '400|997|999|1005|2002|2014',statusCode = '6666|2003|2005|2008|2010|2015|2019|2017|2021|2023|2025|2034|2049|2047|2048|2051|2052|2027|2031|2032|2029|2035|2038|2036|2019|2037|2039|2064|2040|2049|2048|2047|2064|2063|2043|2062|2042|2003|2045|2044|2046|2050|2056|2054|2055|2065|2060|2057|2058|2059|600|2066|2067|2070',isNullCode = '4444|3502',RegCode = function(e){return new RegExp(e)},Stringuser,i = 0,isData = '\/S*/i', /*/通用的数据类型，错误状态吗，对象属性/*/
             sissionHref = {uri:['tables','u_Journal','productList','manageflavorList','formulaList','detailedList','equipmentList','checkIn','equipmentLongUpdate','advertisementH5List','advertisementRootList','adRootDetailedList','chartsShopSale','systemUserList','systemUserLvList','couponList','redeemGrant','integralList','integralExchangeList','orderList','RepairPersonnelList','RepairRootBudingList','feedbackList','RepairTaianList','financialManagement','safeDepositBox'],fn:['ManageUser','JournalList','productList','mangFlavor','formulaList','detailedList','findMachineList','checkInMaintainer','manageMachineVersionList','findAdvertisementList','findMachineAdvertisementList','advdetailedList','shopRootSaleList','findClientUserList','manageMemberLevel','findCouponList','faGoRedeem','findIntegralLogList','manageIntegralShop','findOrderList','manageMaintainer','manageRootMaintainer','feedbackList','manageDistributor','manageDividendList','manageSafeBox']};  /*/通用列表方法/*/
jzm.paraMessage = function(msg,data){return new jzm[msg](data);};  //工厂函数
jzm.randomNum = function(e){  //随机数字符
    e = e || 12;
    var m = "", i = 0; str = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for(; i < e; i++){
        m +=  str.charAt(Math.floor(Math.random() * str.length));
    };
    return new Date().getTime() + m;
};
jzm.getQueryString = function(name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);   // 编码问题 decodeURI  unescape
    return null;
}
jzm.Error = function (err){  //错误信息
  console.log(err);
  alert("err_code:" + err.statusCode.status +", err_msg:" + err.statusCode.msg);
  if(err.statusCode.status == 1005 || err.statusCode.status == 2002){
  	localStorage.clear();
  	window.location.href = "./login.html?err_uri=" + encodeURI(window.location.href.split('?')[0] + '&err_code=' + err.statusCode.status + '&err_msg=' + err.statusCode.status);
  }
};
jzm.compileStr = function(code){//对字符串进行加密
    var c = String.fromCharCode(code.charCodeAt(0)+code.length);
    for(var i=1;i<code.length;i++)
    {
        c += String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
    }
     return escape(c);
};
jzm.uncompileStr = function(code){  //字符串进行解密
    code = unescape(code);
    var c=String.fromCharCode(code.charCodeAt(0)-code.length);
    for(var i=1;i<code.length;i++)
    {
        c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));
    }
    return c;
};
jzm.loadAjaxdata = function(data){//请求地址，请求参数，回调函数，请求类型，同异步
  data.url == 'admin_login' ? basics = '' : basics = "id="+ jzm.uncompileStr(JSON.parse(localStorage.getItem("token")).uname) +"&token="+ jzm.uncompileStr(JSON.parse(localStorage.getItem("token")).utoken) + "&url=" + (function(){
    return jzm.getQueryString('uri') ? jzm.getQueryString('uri') : __load.location.pathname.split('?')[0].replace('login','index');
  })();
  $.ajax({
      url: httpJoin + data.url,
      type: data.type,
      dataType: 'json',
      async:data.trcny,
      data: basics + data.xmldata
  })
  .done(function(reg){
    data.callbackfn(reg); //回调函数
  })
  .fail(function(err) {
      jzm.Error(err)
  })
};
var item = JSON.parse(localStorage.getItem("token"));    //登录的用户信息;
!item && window.location.pathname.split('?')[0] != "/manage/login.html" ? window.location.href = localURL + "login.html" : null;
jzm.getDateTime = function(data)//时间戳转换方法
{
    var date = new Date(data);   //如果date为10位不需要乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
    var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
    var m = (date.getMinutes() <10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
    var s = (date.getSeconds() <10 ? '0' + date.getSeconds() : date.getSeconds());

    return Y+M+D+h+m+s;
}
jzm.getAllDate = function(begin, end) {   //提取指定日期
      var dtemp = [];
      var ab = begin.split("-");
      var ae = end.split("-");
      var db = new Date();
      db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
      var de = new Date();
      de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
      var unixDb = db.getTime();
      var unixDe = de.getTime();
      for (var k = unixDb; k <= unixDe;) {
          dtemp.push((new Date(parseInt(k))).format());
          k = k + 24 * 60 * 60 * 1000;
      }
      return dtemp;
  }
Date.prototype.format = function() {  //原型
      var s = '';
      var mouth = (this.getMonth() + 1)>=10?(this.getMonth() + 1):('0'+(this.getMonth() + 1));
      var day = this.getDate()>=10?this.getDate():('0'+this.getDate());
      s += this.getFullYear() + '-'; // 获取年份。
      s += mouth + "-"; // 获取月份。
      s += day; // 获取日。
      return (s); // 返回日期。
  };
jzm.mGetDate = function (){  
     var date = new Date();
     var year = date.getFullYear();
     var month = date.getMonth()+1;
     var d = new Date(year, month, 0);
     return d.getDate();
}
Function.prototype.before = function(fn){
  var __self = this;   //this指向当前
  return function(){
    __self.apply(__self,arguments);   //函数先执行
    fn.apply(this,arguments);     //当 前 before fn函数后执行
  }
};
Function.prototype.after = function(fn){
  var __self = this;
  return function(){
    fn.apply(this,arguments);   //当前after fn函数先执行
    __self.apply(__self,arguments);   //函数后执行
  };
};
jzm.rangelider = function(u){   //使用当前的url 进行页面校验
  jzm.paraMessage('loadAjaxdata',{url:"index_info",xmldata:'',callbackfn:function(reg){
    var ac,str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? (function(){
      for(; i < reg.adminInfo.roleInfo.permissionInfoList.length; i++){
              str += '<li class="dropdown"><a class="sa-side-form" href="javascript:void(0);" style="background-image:url('+ reg.adminInfo.roleInfo.permissionInfoList[i].permissionPicurl +');">'+
                          '<span class="menu-item">'+ reg.adminInfo.roleInfo.permissionInfoList[i].permissionName +'</span>'+
                      '</a><ul class="list-unstyled menu-item">';
                      for(var j = 0; j < reg.adminInfo.roleInfo.permissionInfoList[i].pageInfoList.length; j++){
                          str += '<li data-page='+ reg.adminInfo.roleInfo.permissionInfoList[i].pageInfoList[j].pageUrl +'><a href="'+ reg.adminInfo.roleInfo.permissionInfoList[i].pageInfoList[j].pageUrl +'?v='+ jzm.randomNum() +'">'+ reg.adminInfo.roleInfo.permissionInfoList[i].pageInfoList[j].pageName +'</a></li>';
                      };
              str +=  '</ul></li>';
          };
          str += '<li>'+
                      '<a class="sa-side-page" style="background-image:url(http://admin.cbcoffee.cn/manage/img/icon/tuichu.png);" href="login.html">'+
                          '<span class="menu-item">退出</span>'+
                      '</a>'+
                  '</li>';
          localStorage.setItem('lnk',JSON.stringify({
            "shopLink":jzm.compileStr(reg.adminInfo.roleInfo.roleId.toString()),
            "menu":{sission:jzm.compileStr(str),usAdministration:reg.adminInfo.adminName,Administration:reg.adminInfo.roleInfo.roleName,J_menuatch:'#J_menuatch'}
          }));
          console.log(reg.adminInfo.roleInfo);
    })() : jzm.Error(reg);

    },type:"POST",trcny:false});
};
jzm.setUriAction = (function(uri){  //初始化菜单列表
  jzm.getQueryString('uri') ? uri = jzm.getQueryString('uri') : uri = __load.location.pathname.split('?')[0];
  var lnk = JSON.parse(localStorage.getItem('lnk'));
  window.onload = function(){
    jzm.implement();
    $("#usAdministration").text(lnk.menu.usAdministration);
    $("#Administration").text(lnk.menu.Administration);
    $(lnk.menu.J_menuatch).html(jzm.uncompileStr(lnk.menu.sission));
    $("li[data-page='"+ uri +"']").parents('li.dropdown').addClass('active');
    jzm.uncompileStr(JSON.parse(localStorage.getItem("lnk")).shopLink) != 3 ? "" : $(".notshop").remove();   //商户权限
    localStorage.removeItem('stat');
  }
})();
jzm.implement = function(e){  //初始化列表
  var me = (function(){
      for(var j = 0; j < sissionHref.uri.length; j++){
        if(__load.location.href.split('?')[0].match(sissionHref.uri[j])){
          return sissionHref.fn[j];
        };
      }
  })();
  me ? void function(){ //初始化分页
    if (!e) {jzm.paraMessage(me)};
    e = e || $("#pageNums").val();
    $('#pageTool').Paging({
        pagesize: 20,
        count: e,
        current:location.hash.match('page') ? location.hash.substring(location.hash.lastIndexOf('=') + 1, location.hash.length) : 1,
        callback: function(page){jzm.paraMessage(me,page);}
     });
  }() : me = null;//角色
  jzm.UIaction();
};
jzm.find_user_for_bind = function(type){    //查询微信的用户
  jzm.paraMessage('loadAjaxdata',{url:"find_user_for_bind",xmldata:"&type=" + type + "&name=" + $("#searchName").val(),callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? (function(){
          var str = '',first;
          for(var i = 0; i < reg.list.length; i++){
              str += '<option value='+ reg.list[i].userId +'>'+ reg.list[i].nickName +'</option>';
              first = reg.list[0].nickName+','+reg.list[0].userId;
          };
          $("#userId").html(str);
          $('#userId').multiselect({setMaxStrLength:100,setWidth:'300px',multiple:false,selectedHtmlValue:first.split(',')[0]});
          $("input[name='userId']").val(first.split(',')[1]);
        })() : (RegCode(isNullCode).test(reg.statusCode.status) ? $("#userId").html('<option value="-1">无</option>') : jzm.Error(reg));
  },type:"POST",trcny:true});
};
jzm.search = function(e){ //检索分页重置
    $("#pageTool").remove();
    $("#page").after('<div id="pageTool" class="col-sm-6" ></div>');
    $("#seach").removeAttr('data-type')
    jzm.implement(e.pageCount * 20);
};
jzm.UIaction = function(){  //列表检索关键字
  $('.ui_action').off().delegate('span','click',function(event){
    event.stopPropagation(); /*/阻止事件冒泡/*/
    $(this).removeClass('spannoaction').addClass('spanaction').siblings('span').removeClass('spanaction').addClass('spannoaction');
    $('#'+$(this).attr('data-unity').split(',')[0]).val($(this).attr('data-unity').split(',')[1]);
    $("#seach").attr('data-type','unity');
    jzm.paraMessage($(this).attr('data-unity').split(',')[2]);
  });
};
jzm.updateFile = function(e){ //ip[] updateFile 上传文件
  console.log(e);
  var h = '<div id="pager" style="position:absolute;width:100%;height:100%;background:rgba(0,0,0,0.8);top:0;left:0;z-index:999;text-align:center;padding-top:15%;"><div class="up_msg">上传中....</div><progress></progress><span style="display:block;width:65px;height:30px;line-height:30px;background:#ccc;margin:30px auto;cursor:pointer;" onclick=jzm.updateFile({type:"'+e.type+'",id:["'+e.id[0]+'","'+e.id[1]+'","'+e.id[2]+'"],format:"'+e.format+'",oldFile:"true"})>重新上传</span></div>';
  var totalSize = 0,oldFile;
    $(e.id[1]).click().off('change').on('change',function() {
        var file = this.files; //假设file标签没打开multiple属性，那么只取第一个文件就行了
        if (!this.value.match(e.format.match('i') ? /.jpg|.gif|.png|.bmp/i : (e.format.match('v') ? /.mp4/i : /.apk/i) )) {  //检测文件类型 图片上传方式，视频上传方式
            alert('上传文件格式无效！');
            return false;
        }
        if(e.oldFile) {$(this).siblings('div#pager').remove();oldFile = $(e.id[2]).val();};
        $(e.id[1]).before(h);
        //创建FormData对象，初始化为form表单中的数据。需要添加其他数据可使用formData.append("property", "value");
        var data = document.querySelector(e.id[1]).files[0];
        var formData = new FormData();
        formData.append('id',jzm.uncompileStr(item.uname));
        formData.append('token',jzm.uncompileStr(item.utoken));
        formData.append('file',data);
        formData.append('type',e.type);
        //if(e.oldFile) {formData.append('oldName',oldFile.substring(oldFile.lastIndexOf('\/') + 1,oldFile.length));}; //旧文件
        if(e.format == 'apk') {  //机器版本APK
          if($("#mUpdateVersion").val()){formData.append('mUpdateVersion',$("#mUpdateVersion").val())}else{$("#mUpdateVersion").css("borderColor","red");$("#pager").remove();return false;};
        };
        $.ajax({
            url: httpUpload + "upload_file",
            type: "POST",
            data: formData,
            timeout:1200000,
            async:true,
            xhr: function(){ //获取ajaxSettings中的xhr对象，为它的upload属性绑定progress事件的处理函数
                myXhr = $.ajaxSettings.xhr();
                if(myXhr.upload){   //检查upload属性是否存在
                    myXhr.upload.addEventListener('progress',jzm.progressHandlingFunction, false);//绑定progress事件的回调函数
                }
                return myXhr;
            },
            success: function(reg){
                RegCode(statusCode).test(reg.statusCode.status) ? void function(){
                  $(e.id[1]).siblings('#pager').children('div.up_msg').text('上传完成');
                  $(e.id[1]).siblings('#pager').children('span').css('background','#406eb3');
                  $(e.id[1]).siblings('span.pbtn').css('display','none');
                  $(e.id[0]).attr('src',reg.realPath);$(e.id[2]).val(reg.realPath);
                  this.value='';
                  if(e.format == 'v'){jzm.createImages({file:file,node:e.id[0]})};
                }() : jzm.Error(reg);
            },
            error:function(xhr,status){
            	console.log(JSON.stringify(xhr)+'-*******-'+ status);
            	alert("err_status:" + status + "err_msg: 上传失败！");
                if(status == 'timeout') alert('请求超时！');
            },
            contentType: false, //必须false才会自动加上正确的Content-Type
            processData: false  //必须false才会避开jQuery对 formdata 的默认处理
        });
    });
    //上传进度回调函数：
    jzm.progressHandlingFunction = function(e) {
        if (e.lengthComputable) {
            $('progress').attr({value : e.loaded, max : e.total}); //更新数据到进度条
            var percent = e.loaded/e.total*100;
            $('#progress').html(e.loaded + "/" + e.total+" bytes. " + percent.toFixed(2) + "%");
        }
    }
}
jzm.moduleBox = function(e){
  e ? $('.editBox').fadeIn(100) : ~function(){
  	$('.editBox').fadeOut(100);
  	sessionStorage.removeItem('e');
//	$('body input').val('');
  }();
  $(".showBox").fadeOut();
  $("#productIds").text('请选择产品');
}
jzm.createImages = function(e){ //获取视频缩略图
  "use strict";
  if(!e.type){
    $('#video').html('<video style="max-width:100%;" src="' + (window.URL || window.webkitURL).createObjectURL(e.file[0]) + '" controls="controls"></video>');
  }
  setTimeout(function(){
    var video = $('#video').find('video')[0],
    canvas = document.createElement("canvas"),
    canvasFill = canvas.getContext('2d');
//  video.crossOrigin = "anonymous"; //启用资源跨域
    canvas.width = video.videoWidth * 0.25;
    canvas.height = video.videoHeight * 0.25;
    console.log(canvas.height);
    canvasFill.drawImage(video, 0, 0, canvas.width, canvas.height);
    var src = canvas.toDataURL("image/jpeg");
    $(e.node).attr('src',src);
  },500);
}
String.prototype.isTel = function(tel){
  return (/(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}/.test(tel));  //匹配移动手机号-固定电话
}
jzm.check = function(e){  //校验输入
  if(e.val.isTel(e.val)){
    $(e.id).css('borderColor','rgba(255, 255, 255, 0.3)');
  }else{
    $(e.id).css('border','2px solid red');
  }
}
//文件去重，编辑操作提交的时候删掉旧文件
jzm.delOldFile = function(e){
	e.f ? localStorage.setItem('temporary',JSON.stringify({val:e})) : void function(){
		var gettemporary = JSON.parse(localStorage.getItem('temporary')).val;
		for (var i = 0; i < gettemporary.f.length; i ++) {
			var xmldata = "id="+ jzm.uncompileStr(item.uname) +"&token="+ jzm.uncompileStr(item.utoken) +"&url="+ jzm.getQueryString('uri') + gettemporary.f[i];
			if(gettemporary.f[i].substring(gettemporary.f[i].lastIndexOf('\=') + 1, gettemporary.f[i].length) != $("#"+gettemporary.id[i]).val().substring($("#"+gettemporary.id[i]).val().lastIndexOf('\/') + 1,$("#"+gettemporary.id[i]).val().length)){
				$.ajax({
			      url: httpUpload + 'delete_old_file',
			      type: 'POST',
			      dataType: 'json',
			      async:true,
			      data: xmldata
			  })
			  .done(function(reg){
//			    alert("code:" + reg.statusCode.status + "msg:" + reg.statusCode.msg);
				localStorage.removeItem('temporary');
			  })
			}
		}
	}();
}
