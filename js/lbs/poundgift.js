/*
* @Author: anchen
* @Date:   2018-02-04 12:31:30
* @Last Modified by:   anchen
* @Last Modified time: 2018-03-02 18:38:22
*/
jzm.findIntegralLogList = function(page)      /*/积分明细/*/{
    jzm.paraMessage('loadAjaxdata',{url:"find_integral_log_list",xmldata:"&name=" + $("#integName").val() + "&integralType=" + $("#integralType").val() +"&page=" + ( page ? page : page = 1),callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        $("#income").html("收入总数<br />" + reg.income);$("#total").html("收入/支出的总差<br />" + reg.total);$("#expend").html("支出总数<br />" + reg.expend);
        var just="";
        for(var i = 0; i < reg.integralLogList.length; i++)
            {
                if(reg.integralLogList[i].integralType == 1)
                    {
                        reg.integralLogList[i].integralType = "购买咖啡";
                        just = "+";
                    }
                else if(reg.integralLogList[i].integralType == 2)
                    {
                        reg.integralLogList[i].integralType = "充值";
                        just = "+";
                    }
                else if(reg.integralLogList[i].integralType == 3)
                    {
                        reg.integralLogList[i].integralType = "签到";
                        just = "+";
                    }
                else if(reg.integralLogList[i].integralType == 4)
                    {
                        reg.integralLogList[i].integralType = "兑换码";
                        just = "-";
                    }
                else
                    {
                        reg.integralLogList[i].integralType = "优惠券";
                        just = "-";
                    };
                str += '<tr>'+
                            '<td>'+ reg.integralLogList[i].userName +'</td>'+
                            '<td>'+ reg.integralLogList[i].integralProduct +'</td>'+
                            '<td>'+ reg.integralLogList[i].integralType +'</td>'+
                            '<td>'+ jzm.getDateTime(reg.integralLogList[i].integralTime) +'</td>'+
                            '<td>'+ just + parseFloat((reg.integralLogList[i].integral != null ? reg.integralLogList[i].integral : 0) / 100).toFixed(2) +'</td>'+
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
jzm.manageIntegralShop = function(page)      /*/积分兑换/*/{
  jzm.paraMessage('loadAjaxdata',{url:"manage_integral_shop",xmldata:"&type=1&page=" + (page ? page : page = 1 ),callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      for(var i = 0; i < reg.integralShopList.length; i++){
          if(reg.integralShopList[i].shopType == 1){
                  reg.integralShopList[i].shopType = "兑换码";
              }
          else if(reg.integralShopList[i].shopType == 2){
                  reg.integralShopList[i].shopType = "优惠券";
              };
          str += '<tr>'+
                      '<td>'+ reg.integralShopList[i].shopName +'</td>'+
                      '<td>'+ reg.integralShopList[i].shopDesc +'</td>'+
                      '<td>'+ reg.integralShopList[i].shopType +'</td>'+
                      '<td>'+ parseFloat((reg.integralShopList[i].shopIntegral != null ? reg.integralShopList[i].shopIntegral : 0) / 100).toFixed(2) +'</td>'+
                      '<td>'+
                          '<a href="integralExchangeEnit.html?uri=/manage/integralExchangeList.html&v='+ jzm.randomNum() +'&shopId='+ reg.integralShopList[i].shopId +'">编辑   |</a>'+
                          '<a href="javascript:void(0);" onclick="jzm.delIntegExc('+ reg.integralShopList[i].shopId +')"> 删除</a>'+
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
jzm.delIntegExc = function(id)  {  //删除积分商品
  var exc = confirm("是否删除？");
  if (exc == true){
    jzm.paraMessage('loadAjaxdata',{url:"manage_integral_shop",xmldata:"&type=6&shopId=" + id,callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? jzm.manageIntegralShop() : jzm.Error(reg);
    },type:"POST",trcny:true});
  };
};
jzm.seachIntegExc = function()  { //查询优惠卷
    jzm.paraMessage('loadAjaxdata',{url:"manage_integral_shop",xmldata:"&type=2",callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        for(var i = 0; i < reg.couponList.length; i ++){
            str += '<option value="'+ reg.couponList[i].couponId +'">'+ reg.couponList[i].couponName +'</option>';
        };
        $("#shopProductid").html(str);
      }() : jzm.Error(reg);
    },type:"POST",trcny:true});
};
jzm.AddManageIntegral = function() {//添加兑换码与优惠卷
    var shopProductId = "";
    if($("#shopProductidShow").val() == 6){
        shopProductId = "&shopProductid=1";
    };
    $("input[name='shopIntegral']").val($("#shopIntegral").val() * 100);
    jzm.paraMessage('loadAjaxdata',{url:"manage_integral_shop",xmldata:"&type=4&" + $("#dateForm").serialize() + shopProductId,callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = './integralExchangeList.html' : jzm.Error(reg);
    },type:"POST",trcny:true});
};
jzm.seachManageIntegralEnit = function() { //编辑前 查询兑换码与优惠卷
  jzm.paraMessage('loadAjaxdata',{url:"manage_integral_shop",xmldata:"&type=3&shopId=" + jzm.getQueryString("shopId"),callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      $("#shopName").val(reg.integralShop.shopName);
      $("#shopDesc").val(reg.integralShop.shopDesc);

      $("#shopUrl").val(reg.integralShop.shopUrl);
      $("#shopUrl_img").attr("src",reg.integralShop.shopUrl);

      $("#shopIntegral").val(parseFloat((reg.integralShop.shopIntegral != null ? reg.integralShop.shopIntegral : 0) / 100).toFixed(2));
      $("input[name='shopIntegral']").val(parseFloat((reg.integralShop.shopIntegral != null ? reg.integralShop.shopIntegral : 0) / 100).toFixed(2));

      for(var i = 0; i < reg.couponList.length; i++){
          str += '<option value="'+ reg.couponList[i].couponId +'">'+ reg.couponList[i].couponName +'</option>';
        };
      $("#shopProductid").html(str);
      if(reg.integralShop.shopType == 1){
          $("#shopType").attr("checked",true);
          $("#shopType1").removeAttr("checked");
          $("#shopProductid").attr("disabled",true);
          $("#shopProductidShow").val(6);
          }
      else{
            $("#shopType").removeAttr("checked");
            $("#shopType1").attr("checked",true);
            $("#shopProductid").val(reg.integralShop.shopProductid);
          };
      jzm.delOldFile({f:["&type=7&oldName="+$("#shopUrl").val().substring($("#shopUrl").val().lastIndexOf('\/') + 1, $("#shopUrl").val().length)],id:['shopUrl']});
    }() : jzm.Error(reg);
  },type:"POST",trcny:true});
};
jzm.EmitManageIntegral = function(){
  var shopProductId = "";
  if($("#shopProductidShow").val() == 6){
      shopProductId = "&shopProductid=1";
    };
  $("input[name='shopIntegral']").val($("#shopIntegral").val() * 100);
  jzm.paraMessage('loadAjaxdata',{url:"manage_integral_shop",xmldata:"&type=5&" + $("#dateForm").serialize() + shopProductId + "&shopId=" + jzm.getQueryString("shopId"),callbackfn:function(reg){
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
    	jzm.delOldFile('false');
    	window.location.href = './integralExchangeList.html';
    }() : jzm.Error(reg);
  },type:"POST",trcny:true});
};
