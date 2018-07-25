/*
* @Author: anchen
* @Date:   2018-02-08 22:32:58
* @Last Modified by:   anchen
* @Last Modified time: 2018-03-09 18:55:38
*/
// **************************订单************************************
jzm.findOrderList = function(page)     /*/订单列表/*/{
    var search = "";
    var el = "",xl = "";
    if(localStorage.getItem('stat')){
      el = JSON.parse(localStorage.getItem('stat')).orderLine;
      xl = JSON.parse(localStorage.getItem('stat')).sort;
      search += "&orderLine="+ el +"&sort="+ xl;
    };
    if(jzm.getQueryString("machineNumber"))    //机器直连 带机器编号
        {
            $("#name").val(jzm.getQueryString("machineNumber"));
        };
       // if(!$("#endTime").val()){$("#startTime").val(jzm.getDateTime(new Date().setDate(new Date().getDate() - 6)).split(' ')[0]);$("#endTime").val(jzm.getDateTime(new Date()).split(' ')[0])};
       search = "&name=" + $("#name").val() + "&startTime=" + $("#startTime").val() + "&endTime=" + $("#endTime").val() + "&orderType=" +$("#orderType").val() +"&orderStatus="+$("#orderStatus").val()+"&consumptionType="+$("#consumptionType").val();

    jzm.paraMessage('loadAjaxdata',{url:"find_order_list",xmldata:"&type=1&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)) + search,callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        for(var i = 0; i < reg.orderShowList.length; i ++){
            str += '<tr>'+
                        '<td>'+ reg.orderShowList[i].orderId +'</td>'+
                        '<td>'+ reg.orderShowList[i].nickName +'/'+ reg.orderShowList[i].userId +'</td>'+
                        '<td>'+ reg.orderShowList[i].adminName +'/'+ reg.orderShowList[i].machineNumber +'</td>'+
                        '<td>'+ reg.orderShowList[i].sumMoney +'</td>'+
                        '<td>'+ reg.orderShowList[i].paymentMoney +'</td>'+
                        '<td>'+ reg.orderShowList[i].paymentType +'</td>'+
                        '<td>'+ reg.orderShowList[i].productName +'</td>'+
                        '<td>'+ reg.orderShowList[i].consumptionType +'</td>'+
                        '<td>'+ reg.orderShowList[i].couponInfo +'</td>'+
                        '<td>'+ reg.orderShowList[i].orderType +'</td>'+
                        '<td class="'+ ( reg.orderShowList[i].orderStatus == '已兑换' || reg.orderShowList[i].orderStatus ==  '已完成' ? 'msg_green' : ( reg.orderShowList[i].orderStatus == '制作中' ? 'msg_yellow' :  ( reg.orderShowList[i].orderStatus == '已退款' ? 'msg_999' : ( reg.orderShowList[i].orderStatus == '未兑换' ? 'msg_hot' : null ) )) ) +'">'+ reg.orderShowList[i].orderStatus +'</td>'+
                        '<td>'+ reg.orderShowList[i].paymentTime +'</td>';
                var od = reg.orderShowList[i].orderStatus != "制作中" ? (
                	reg.orderShowList[i].paymentType == "兑换码支付" && reg.orderShowList[i].orderStatus == "未兑换" ? '<a href="javascript:void(0);" onclick=jzm.ChangeState("'+ reg.orderShowList[i].orderId +'",2)>|  更改状态</a>' : ""   //校验状态
                ) : '<a href="javascript:void(0);" onclick=jzm.ChangeState("'+ reg.orderShowList[i].orderId +'",1)>|  更改状态</a>';   //校验状态
                if(reg.orderShowList[i].orderStatus != "已取消" && reg.orderShowList[i].orderStatus != "已退款" && reg.orderShowList[i].orderStatus != "未支付"){
                        str +=  '<td>'+ (jzm.uncompileStr(JSON.parse(localStorage.getItem("lnk")).shopLink) != 3 ? '<a href="javascript:void(0);" onclick=jzm.refundMoney("'+ reg.orderShowList[i].orderId +'")>退款</a>' : "") + od +'</td>';
                    };
            str +=  '</tr>';
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
//订单退款
jzm.refundMoney = function(id){
    var OL = confirm("请确认是否退款？");
    if(OL == true){
      jzm.paraMessage('loadAjaxdata',{url:"order_refund",xmldata:"&orderId=" + id,callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? jzm.findOrderList() : jzm.Error(reg);
      },type:"POST",trcny:false});
    };
};
//更改制作中订单状态
jzm.ChangeState = function(id,type){
    var OL = confirm("注：请确认是否修改该订单状态？");
    if(OL == true){
      jzm.paraMessage('loadAjaxdata',{url:"order_complete",xmldata:"&orderId=" + id +"&type=" + type,callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? jzm.findOrderList() : jzm.Error(reg);
      },type:"POST",trcny:false});
    };
};
// 维修管理模块
//维修人员列表
jzm.manageMaintainer = function(page){
    jzm.paraMessage('loadAjaxdata',{url:"manage_maintainer",xmldata:"&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)) + "&type=1&name=" + $("#userName").val(),callbackfn:function(reg){
        var str = "";
        RegCode(statusCode).test(reg.statusCode.status) ? void function(){
          for(var i = 0; i < reg.maintainerList.length; i ++){
            str += '<tr>'+
                        '<td>'+ reg.maintainerList[i].maintainerId +'</td>'+
                        '<td>'+ reg.maintainerList[i].maintainerName +'</td>'+
                        '<td>'+ reg.maintainerList[i].maintainerPhone +'</td>'+
                        '<td>'+ reg.maintainerList[i].adminName +'</td>'+
                        '<td>'+ (reg.maintainerList[i].royaltyRate * 10000) / 100 +' %</td>'+
                        '<td>'+ reg.maintainerList[i].wallet +'</td>'+
                        '<td>'+ reg.maintainerList[i].userName +'</td>'+
                        '<td>';
                        jzm.uncompileStr(JSON.parse(localStorage.getItem('lnk')).shopLink) == 2 && reg.maintainerList[i].adminName == 'admin' ? (
                        	str +=	'<a href="javascript:void(0);" onclick="jzm.showaddwx('+reg.maintainerList[i].maintainerId+')">编辑  |</a><a href="javascript:void(0);" onclick="jzm.delmanage('+reg.maintainerList[i].maintainerId+')">删除</a>'
                        ): null;
                        jzm.uncompileStr(JSON.parse(localStorage.getItem('lnk')).shopLink) == 3 && reg.maintainerList[i].adminName != 'admin' ? (
                        	str +=	'<a href="javascript:void(0);" onclick="jzm.showaddwx('+reg.maintainerList[i].maintainerId+')">编辑  |</a><a href="javascript:void(0);" onclick="jzm.delmanage('+reg.maintainerList[i].maintainerId+')">删除</a>'
                        ): null;
            str	+= '</td></tr>';
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
jzm.showaddwx = function(id,type) /*//编辑前查询/*/{
    $(".editBox").show();
    if(type){$("body input").val('');jzm.find_user_for_bind(2);return false;};
    jzm.paraMessage('loadAjaxdata',{url:"manage_maintainer",xmldata:"&type=2&maintainerId=" + id,callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? void function(){
          $("#editUserBoxs").val(reg.maintainerInfo.maintainerName);
          $("#editPhoneBoxs").val(reg.maintainerInfo.maintainerPhone);
          $("#royaltyRate").val((reg.maintainerInfo.royaltyRate * 10000) / 100);
          $("input[name='userId']").val(reg.maintainerInfo.userId);
          $("#maintainerId").val(reg.maintainerInfo.maintainerId);
          $('#userId').multiselect({
            setMaxOptionNum:10,
            setWidth:'300px',
            multiple:false,
            selectedHtmlValue:reg.maintainerInfo.nickName
          });
        }() : jzm.Error(reg);
      },type:"POST",trcny:true});
};
//添加、编辑维修人员
jzm.AddEnitmanageMaintainer = function(){
    if($("#maintainerId").val() != ""){id = "4&maintainerId=" + $("#maintainerId").val();}else{id = 3;};
    if($("#royaltyRate").val() > 100){$("#royaltyRate").css("border","1px solid red"); return false;};
    if($("#editPhoneBoxs").val().length != 11 ){$("#editPhoneBoxs").css("border","1px solid red");$("#editPhoneBoxs").siblings("span").remove();$("#editPhoneBoxs").after("<span style='color:red;font-size:10px;'>请正确输入11位手机号码</span>"); return false;};
    var rate = ($("#royaltyRate").val() * 10000) / (100 *10000);
    var sessionData = "&maintainerName=" + $("#editUserBoxs").val() + "&maintainerPhone=" +$("#editPhoneBoxs").val() +"&royaltyRate=" + rate + "&userId=" + ($("#userId option[data-select='true']").length > 0 ? $("#userId option[data-select='true']").val() : $("input[name='userId']").val());
    jzm.paraMessage('loadAjaxdata',{url:"manage_maintainer",xmldata:"&type="+ id+ sessionData,callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? window.location.reload() : jzm.Error(reg);
    },type:"POST",trcny:true});
};
//维修人员绑定设备列表
jzm.manageRootMaintainer = function(page){
  var xml = "&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)) + "&name=" + $("#userName").val() + "&onlineStatus=" + $("#onlineStatus").val() + "&failureStatus=" + $("#failureStatus").val() + "&maintainerStatus=" + $("#materialStatus").val();
  jzm.paraMessage('loadAjaxdata',{url:"find_maintainer_for_machine",xmldata:xml,callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      for(var i = 0; i < reg.machineShowList.length; i ++){
        str += '<tr>'+
                    '<td>'+ reg.machineShowList[i].machineNumber +'</td>'+
                    '<td>'+ reg.machineShowList[i].onlineStatus +'</td>'+
                    '<td>'+ reg.machineShowList[i].machineAddrDesc +'</td>'+
                    '<td>'+ reg.machineShowList[i].machineSn +'</td>'+
                    '<td>'+ reg.machineShowList[i].failureStatus +'</td>'+
                    '<td>'+ reg.machineShowList[i].maintainerName +'</td>'+
                    '<td>'+ reg.machineShowList[i].maintainerPhone +'</td>'+
                    //所属商户名称
                    '<td>'+ (reg.machineShowList[i].adminName == null ? "无" : reg.machineShowList[i].adminName) +'</td>' +
                    '<td>';
                	jzm.uncompileStr(JSON.parse(localStorage.getItem('lnk')).shopLink) == 2 && (reg.machineShowList[i].adminName == null || reg.machineShowList[i].adminName == 'admin') ? (
	                	reg.machineShowList[i].maintainerPhone == "无" ?  str += '<a href="javascript:void(0);" onclick="jzm.manageRootListMaintainer(1,'+ reg.machineShowList[i].machineNumber +')">绑定</a>' : str += '<a href="javascript:void(0);" onclick="jzm.manageRootListMaintainer(1,'+ reg.machineShowList[i].machineNumber +')">重新绑定</a>'
	                ): null;
	                jzm.uncompileStr(JSON.parse(localStorage.getItem('lnk')).shopLink) == 3 && (reg.machineShowList[i].adminName == null || reg.machineShowList[i].adminName != 'admin') ? (
	                	reg.machineShowList[i].maintainerPhone == "无" ?  str += '<a href="javascript:void(0);" onclick="jzm.manageRootListMaintainer(1,'+ reg.machineShowList[i].machineNumber +')">绑定</a>' : str += '<a href="javascript:void(0);" onclick="jzm.manageRootListMaintainer(1,'+ reg.machineShowList[i].machineNumber +')">重新绑定</a>'
	                ): null;
                str += '</td></tr>';
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
//维修人员绑定设备查询 所有维修人员
jzm.manageRootListMaintainer = function(page,id){
    $("#machineNumber").val(id);
    $("#RejectInfo").show();
    jzm.paraMessage('loadAjaxdata',{url:"manage_maintainer",xmldata:"&type=1&page="+(page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)),callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        for(var i = 0; i < reg.maintainerList.length; i ++){
            str += '<div class="col-sm-12" style="text-align:center;font-size:1.4rem;background:rgba(0,0,0,0.4);padding:10px 0;">'+
                        '<span class="col-sm-4">'+ reg.maintainerList[i].maintainerName +'</span>'+
                        '<span class="col-sm-5">'+ reg.maintainerList[i].maintainerPhone +'</span>'+
                        '<span class="col-sm-3">'+
                            '<a href="javascript:void(0);" onclick="jzm.BdingRootServer('+ reg.maintainerList[i].maintainerId +')">绑定</a>' +
                        '</span>'+
                    '</div>';
            };
        $("#showList").html(str);
        $("#UserpageTool").css("display","block");
        $("#UserpageNums").val(reg.pageCount * 20);
      }() : ( RegCode(isNullCode).test(reg.statusCode.status) ? void function(){
        $("#showList").html(str);
        $("#UserpageTool").css("display","none");
      }() : jzm.Error(reg) );
    },type:"POST",trcny:false});
    $("#UserpageTool").remove();
};
//维修人员绑定设备
jzm.BdingRootServer = function(id){
  jzm.paraMessage('loadAjaxdata',{url:"bind_maintainer_for_machine",xmldata:"&machineNumber="+ $("#machineNumber").val() +"&maintainerId="+ id,callbackfn:function(reg){
    RegCode(statusCode).test(reg.statusCode.status) ? window.location.reload() : jzm.Error(reg);
  },type:"POST",trcny:false});
  $("#UserpageTool").remove();
};
//删除维护人员
jzm.delmanage = function(id){
  var o = confirm("是否删除该维护人员（删除后将清除该用户的所有信息包括钱包余额、机器绑定信息、签到信息等，删除前请确认是否已经检查所有的信息）");
  if(o == true){
    jzm.paraMessage('loadAjaxdata',{url:"manage_maintainer",xmldata:"&type=6&maintainerId=" + id,callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? window.location.reload() : jzm.Error(reg);
    },type:"POST",trcny:true});
  }
}
//反馈信息
jzm.feedbackList = function(page){
  jzm.paraMessage('loadAjaxdata',{url:"find_fault_feedback_list",xmldata:"&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)) +"&name=" +$("#name").val() +"&machineNumber=" +$("#machineNumber").val(),callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      for(var i = 0; i < reg.faultFeedbackShowList.length; i ++){
        str += '<tr>'+
                    '<td>'+ reg.faultFeedbackShowList[i].nickName +'</td>'+
                    '<td>'+ reg.faultFeedbackShowList[i].faultPhone +'</td>'+
                    '<td>'+ reg.faultFeedbackShowList[i].machineNumber +'</td>'+
                    '<td>'+ reg.faultFeedbackShowList[i].machineAddr +'</td>'+
                    '<td>'+ jzm.getDateTime(reg.faultFeedbackShowList[i].faultTime) +'</td>'+
                    '<td style="max-width:700px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;cursor:pointer;position:relative;">'+ reg.faultFeedbackShowList[i].faultContent + '</td>'+
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

//渠道商信息
jzm.manageDistributor = function(page){
  jzm.paraMessage('loadAjaxdata',{url:"manage_distributor",xmldata:"&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)) + "&type=1&name=" + $("#userName").val(),callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      for(var i = 0; i < reg.dList.length; i ++){
        str += '<tr>'+
                    '<td>'+ reg.dList[i].dId +'</td>'+
                    '<td>'+ reg.dList[i].dName +'</td>'+
                    '<td>'+ reg.dList[i].dPhone +'</td>'+
                    '<td>'+ jzm.getDateTime(reg.dList[i].createTime) +'</td>'+
                    '<td>'+ parseFloat(reg.dList[i].royaltyRate * 100000) / 1000 +' %</td>'+
                    '<td>'+ reg.dList[i].wallet +'</td>'+
                    '<td>'+ reg.dList[i].userId+"/"+reg.dList[i].nickName +'</td>'+
                    '<td>'+
                        '<a href="javascript:void(0);" onclick="jzm.distrshowaddwx('+reg.dList[i].dId+')">编辑</a>'+
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
}
///编辑前查询
jzm.distrshowaddwx = function(id,type){
    $(".editBox").show();
    if(type){$("body input").val('');jzm.find_user_for_bind(3); return false;};
    jzm.paraMessage('loadAjaxdata',{url:"manage_distributor",xmldata:"&type=2&dId=" + id,callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        $("#editUserBoxs").val(reg.d.dName);
        $("#editPhoneBoxs").val(reg.d.dPhone);
        $("#royaltyRate").val((reg.d.royaltyRate * 10000) / 100);
        $("input[name='userId']").val(reg.d.userId);
        $("#maintainerId").val(reg.d.dId);
        $('#userId').multiselect({
          setMaxOptionNum:10,
          setWidth:'300px',
          multiple:false,
          selectedHtmlValue:reg.d.nickName
        });
      }() : jzm.Error(reg);
    },type:"POST",trcny:true});
};
//添加、编辑渠道商信息
jzm.AddEnitmanageDistributor = function(){
    if($("#maintainerId").val() != ""){id = "4&dId=" + $("#maintainerId").val();}else{id = 3;};
    if($("#royaltyRate").val() > 100){$("#royaltyRate").css("border","1px solid red"); return false;};
    if($("#editPhoneBoxs").val().length != 11 ){$("#editPhoneBoxs").css("border","1px solid red");$("#editPhoneBoxs").siblings("span").remove();$("#editPhoneBoxs").after("<span style='color:red;font-size:10px;'>请正确输入11位手机号码</span>"); return false;};
    var rate = ($("#royaltyRate").val() * 10000) / (100 *10000);
    var sessionData = "&dName=" + $("#editUserBoxs").val() + "&dPhone=" +$("#editPhoneBoxs").val() +"&royaltyRate=" + rate + "&userId=" + ($("#userId option[data-select='true']").length > 0 ? $("#userId option[data-select='true']").val() : $("input[name='userId']").val());
    jzm.paraMessage('loadAjaxdata',{url:"manage_distributor",xmldata:"&type="+ id + sessionData,callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? window.location.reload() : jzm.Error(reg);
    },type:"POST",trcny:true});
};

/*财务管理模块*/
jzm.manageDividendList = function(page)     /*/每单分润记录列表/*/{
  if(!$("#endTime").val()){$("#endTime").val(jzm.getDateTime(new Date()).split(' ')[0])};
  jzm.paraMessage('loadAjaxdata',{url:"manage_dividend_list",xmldata:"&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)) + "&type=1&name=" + $("#name").val() + "&startTime=" + $("#startTime").val() + "&endTime=" + $("#endTime").val(),callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      for(var i = 0; i < reg.dList.length; i ++){
          str += '<tr>'+
                      '<td>'+ reg.dList[i].dId +'</td>'+
                      '<td><a href="javascript:void(0)">'+ reg.dList[i].orderId +'</a></td>'+
                      '<td>'+ reg.dList[i].recId +'</td>'+
                      '<td>'+ reg.dList[i].recName +'</td>'+
                      '<td>'+ reg.dList[i].recType +'</td>'+
                      '<td>'+ reg.dList[i].recMoney +'</td>'+
                      '<td>'+ reg.dList[i].allMoney +'</td>'+
                      '<td>'+ reg.dList[i].recTime +'</td>'+
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
jzm.manageSafeBox = function(page)     /*/保险箱列表/*/{
  jzm.paraMessage('loadAjaxdata',{url:"manage_safe_box",xmldata:"&type=1&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)) + "&name=" + $("#name").val(),callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      for(var i = 0; i < reg.sbList.length; i ++){
          str += '<tr>'+
                      '<td>'+ reg.sbList[i].sBId +'</td>'+
                      '<td><a href="javascript:void(0)">'+ reg.sbList[i].adminId +'</a></td>'+
                      '<td>'+ reg.sbList[i].name +'</td>'+
                      '<td>'+ reg.sbList[i].type +'</td>'+
                      '<td>'+ reg.sbList[i].sBMoney +'</td>'+
                      '<td>'+ reg.sbList[i].lastCheckOutTime +'</td>'+
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
jzm.accountsDivision = function()     /*/统一分账/*/{
    var account = confirm("是否确定分账？");
    if(account == true){
    jzm.paraMessage('loadAjaxdata',{url:"manage_safe_box",xmldata:"&type=2",callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? jzm.manageSafeBox() : jzm.Error(reg);
    },type:"POST",trcny:false});
  };
};

//个人信息管理
jzm.msginformation = function (type){
  var type = "&type="+ type + (type == 1 ? "" : "&" + $("#AddUser").serialize());
  jzm.paraMessage('loadAjaxdata',{url:"edit_information",xmldata:type,callbackfn:function(reg){
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      if(reg.statusCode.status == 2010){
//    	alert('修改成功！请重新登陆~');
//    	window.location.href = './login.html?code=resetCode&v=' + new Date().getTime();
		window.location.reload(); // 刷新 - 
      };
      $('#realName').val(reg.adminUser.realName);
      $('#adminMobile').val(reg.adminUser.adminMobile);
      $("input[name='userId']").val(reg.adminUser.userId);
      $('#searchName').val(reg.adminUser.nickName);
      $('#userId').multiselect({
        setMaxOptionNum:10,
        setWidth:'300px',
        multiple:false,
        selectedHtmlValue:reg.adminUser.nickName
      });
    }() : jzm.Error(reg);
  },type:"POST",trcny:false});
};

//客如云账单转换后台账单
jzm.krybill = function(){
	$("#filexls").off().change(function(){
		$('#pager').remove();
		var h = '<div id="pager" style="position:absolute;width:100%;height:100%;background:rgba(0,0,0,0.8);top:0;left:0;z-index:999;text-align:center;padding-top:15%;"><div class="up_msg">文件已经准备好请点击确认提交</div><label style="display:block;width:65px;height:30px;background:#146375;line-height:30px;margin:30px 56px;cursor:pointer;" for="filexls">重新上传</label></div>';
		$("#filexls").before(h);
		$("#pager").parent().after('<span class="block-title showpager" style="padding: 7px 10px;cursor: pointer;background: red;margin-left: -15px;position:absolute;z-index:999;    height: 30px;line-height: 17px;top: 95px;" id="krybill">确定提交</span>');
	});
	$("body").off().delegate('#krybill','click',function(){
		$("#pager").html('<div style="text-align:center;">正在处理中...<br />请稍后</div>');
		$('.showpager').remove();
		var forDom = new FormData();
		forDom.append('file',document.querySelector("#filexls").files[0]);
		$.ajax({
	            url: httpJoin + "excel_to_order?id=" + jzm.uncompileStr(item.uname) + "&token=" + jzm.uncompileStr(item.utoken) + "&url=" +location.pathname.split('?')[0],
	            type: "POST",
	            data: forDom,
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
	                	alert(reg.statusCode.msg);
	                  window.location.reload();
	                }() : jzm.Error(reg);
	            },
	            error:function(xhr,status){
	                if(status == 'timeout') {alert('请求超时！');}else{alert(xhr.statusText)};
	            },
	            contentType: false, //必须false才会自动加上正确的Content-Type
	            processData: false  //必须false才会避开jQuery对 formdata 的默认处理
	        });
		});
	
}
__load.location.pathname.split('?')[0] == '/manage/krybill.html' ? jzm.krybill() : null;
