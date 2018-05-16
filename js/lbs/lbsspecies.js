/*
* @Author: anchen
* @Date:   2018-02-01 10:50:14
* @Last Modified by:   anchen
* @Last Modified time: 2018-03-01 19:11:24
*/

// **************************礼券************************************
jzm.findCouponList = function(page)/*/优惠券列表/*/{
  jzm.paraMessage('loadAjaxdata',{url:"find_coupon_list",xmldata:"&page=" + (page ? page : page = 1 ) + "&name=" + $("#name").val(),callbackfn:function(reg){
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      var str = "";
      for(var i = 0; i < reg.couponInfoList.length; i ++){
        str += '<tr>'+
                    '<td>'+ reg.couponInfoList[i].couponId +'</td>'+
                    '<td>'+ reg.couponInfoList[i].couponName +'</td>'+
                    '<td style="max-width:820px;">'+ reg.couponInfoList[i].couponRange +'</td>'+
                    '<td>'+ parseFloat((reg.couponInfoList[i].couponMoney != null ? reg.couponInfoList[i].couponMoney : 0) / 100).toFixed(2) +'</td>'+
                    '<td>'+ reg.couponInfoList[i].couponTime +'</td>'+
                    '<td>'+
                        '<a href="couponGrant.html?uri=/manage/couponList.html&v='+ jzm.randomNum() +'&couponId='+ reg.couponInfoList[i].couponId +'&name='+ encodeURI(reg.couponInfoList[i].couponName) +'">发放  |</a>'+
                        '<a href="javascript:void(0);" onclick="jzm.deleManageCoupon('+ reg.couponInfoList[i].couponId +')">     删除</a>'+
                    '</td>'+
                '</tr>';
          };
        $("#pageNums").val(reg.pageCount * 20);
        $('#tbodyhtml').html(str);
        if($("#seach").attr('data-type')) jzm.search(reg);
      }() : (
        RegCode(isNullCode).test(reg.statusCode.status) ? void function(){
        $("#pageTool").css('display','none');
        $('#tbodyhtml').html(str);
      }() : jzm.Error(reg) );
  },type:"POST",trcny:false});
};
jzm.deleManageCoupon = function(id)     /*/删除优惠券/*/{
    var del = confirm("是否删除？");
    if (del == true){
        jzm.paraMessage('loadAjaxdata',{url:"manage_coupon",xmldata:"&type=3&couponId=" + id,callbackfn:function(reg){
          RegCode(statusCode).test(reg.statusCode.status) ? jzm.findCouponList() : jzm.Error(reg);
        },type:"POST",trcny:true});
    };
};
jzm.AddShowProduct = function()     /*/添加优惠券前查看可优惠产品/*/{
  jzm.paraMessage('loadAjaxdata',{url:"manage_coupon",xmldata:"&type=1",callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      for(var i = 0; i < reg.productList.length; i++){
        str += '<option value="'+ reg.productList[i].productId +'">'+ reg.productList[i].productId +'·'+ reg.productList[i].productName +'</option>';
      };
      $(".multiselect").html(str);
    }() : jzm.Error(reg);
  },type:"POST",trcny:false});
};
jzm.AddManageCoupon = function()     /*/添加优惠券/*/{
    var m = document.getElementsByTagName("input");
    $("input[name='couponMoney']").val($("#couponMoney").val() * 100);
    var sp = $(".newSelectTitle").eq(0).children('span').text().split('·');
    var couponRange = $("#couponRange").val();
    var crange = "";
    for(var p = 0; p < sp.length - 1; p++){
        if(!crange){
            crange += sp[p].replace(/[^0-9]/ig,"");
        }else{
            crange += couponRange +","+ sp[p].replace(/[^0-9]/ig,"");
        };
    };
    $("#couponRange").val(crange);
    for(var i = 0; i < m.length; i ++)
        {
            if(m[i].value == "")
                {
                    alert("请将信息填写完整！");
                    $("#couponRange").val("");
                    return false;
                };
        };
    jzm.paraMessage('loadAjaxdata',{url:"manage_coupon",xmldata:"&type=2&" + $("#AddConpon").serialize(),callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = jzm.getQueryString('uri') : jzm.Error(reg);
    },type:"POST",trcny:true});
};
jzm.faShowCoupon = function(s,page)     /*/ 发放优惠券前查询/*/{
    $("#conponName").val(decodeURI(jzm.getQueryString('name')));
    jzm.paraMessage('loadAjaxdata',{url:"manage_coupon",xmldata:"&type=4&page=" + (page ? page : page = 1) + "&name=" + $("#userName").val(),callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        for(var i = 0; i < reg.clientUserList.length; i++){
            str +='<tr>'+
                    '<td>'+ reg.clientUserList[i].userId +'</td>'+
                    '<td>'+ reg.clientUserList[i].nickName +'</td>'+
                    '<td>'+ reg.clientUserList[i].memberLevelName +'</td>'+
                    '<td>'+ jzm.getDateTime(reg.clientUserList[i].registerTime) +'</td>'+
                    '<td>'+
                        '<a href="javascript:void(0);"><input type="checkbox" name="userId" value="'+ reg.clientUserList[i].userId +'" style="opacity:1;" /></a>'+
                    '</td>'+
                '</tr>';
            };
        $("#pageNums").val(reg.pageCount * 20);
        $('#tbodyhtml').html(str);
        if($("#seach").attr('data-type')) jzm.search(reg);
      }() : (
        RegCode(isNullCode).test(reg.statusCode.status) ? void function(){
        $("#pageTool").css('display','none');
        $('#tbodyhtml').html(str);
      }() : jzm.Error(reg) );
    },type:"POST",trcny:false});
};
jzm.faGoConpon = function(){//发放优惠券
    var ch = $("input[name='userId']");
    var use = "";
    for(var i = 0; i < ch.length; i++){
      if($(ch[i]).is(":checked")){
          use = $(ch[i]).val();
          $("#poUser").append('<input type="hidden" id="userId" name="userId" value="'+ $(ch[i]).val() +'" />');
        }
      };
      if($("#allcheck").is(":checked"))
          {
              $("#poUser").html('<input type="hidden" id="userId" name="userId" value="'+ $("#allcheck").val() +'" />');
          };
      jzm.paraMessage('loadAjaxdata',{url:"manage_coupon",xmldata:"&type=5&" + $("#poUser").serialize() + "&couponId=" + jzm.getQueryString("couponId"),callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ?  window.location.href = './couponList.html' : jzm.Error(reg);
      },type:"POST",trcny:true});
};
jzm.faGoRedeem = function(page)       /*/发放兑换码/*/{
  jzm.paraMessage('loadAjaxdata',{url:"manage_c_redeem",xmldata:"&type=4&page=" + (page ? page : page = 1) +"&name=" + $("#name").val(),callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      for(var i = 0; i < reg.clientUserList.length; i++)
          {
              str +='<tr>'+
                      '<td>'+ reg.clientUserList[i].userId +'</td>'+
                      '<td>'+ reg.clientUserList[i].nickName +'</td>'+
                      '<td>'+ reg.clientUserList[i].memberLevelName +'</td>'+
                      '<td>'+ jzm.getDateTime(reg.clientUserList[i].registerTime) +'</td>'+
                      '<td>'+
                          '<a href="javascript:void(0);"><input type="checkbox" name="userId" value="'+ reg.clientUserList[i].userId +'" style="opacity:1;" /></a>'+
                      '</td>'+
                  '</tr>';
          };
      $("#pageNums").val(reg.pageCount * 20);
      $('#tbodyhtml').html(str);
      if($("#seach").attr('data-type')) jzm.search(reg);
    }() : (
      RegCode(isNullCode).test(reg.statusCode.status) ? void function(){
      $("#pageTool").css('display','none');
      $('#tbodyhtml').html(str);
    }() : jzm.Error(reg) );
  },type:"POST",trcny:false});
};
jzm.faGoConponAction = function(){
  var ch = $("input[name='userId']");
  var use = "";
  for(var i = 0; i < ch.length; i++)
      {
          if($(ch[i]).is(":checked"))
              {
                  use = $(ch[i]).val();
                  $("#poUser").append('<input type="hidden" id="userId" name="userId" value="'+ $(ch[i]).val() +'" />');
              }
      };
      if($("#allcheck").is(":checked"))
          {
              $("#poUser").html('<input type="hidden" id="userId" name="userId" value="'+ $("#allcheck").val() +'" />');
          };
      jzm.paraMessage('loadAjaxdata',{url:"manage_c_redeem",xmldata:"&type=5&cId=1&" + $("#poUser").serialize(),callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? ~function(){
          alert(reg.statusCode.msg);
          jzm.faGoRedeem();
        }() : jzm.Error(reg);
      },type:"POST",trcny:true});
}
