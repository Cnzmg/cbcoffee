/*
* @Author: anchen
* @Date:   2018-01-27 14:43:53
* @Last Modified by:   anchen
* @Last Modified time: 2018-03-08 20:03:08
*/
jzm.findMachineList = function(page)  /*/设备列表/*/{
    var el = "",xl = "",search = "";
    if(localStorage.getItem('stat')){
      el = JSON.parse(localStorage.getItem('stat')).orderLine;
      xl = JSON.parse(localStorage.getItem('stat')).sort;
      search += "&orderLine="+ el +"&sort="+ xl;
    };
    if(!page){ //查询设备、离线、缺料、故障总数              //重复次数问题 
      jzm.paraMessage('loadAjaxdata',{url:"find_machine_number",xmldata:'',callbackfn:function(reg){
        $("#machineCount").html("设备总数<br />" + reg.machineCount);
        $("#offLineNum").html("离线总数<br />" + reg.offLineNum);
        $("#starvingNum").html("缺料总数<br />" + reg.starvingNum);
        $("#faultNum").html("故障总数<br />" + reg.faultNum);
      },type:"POST",trcny:true});
    };
    var searchUser = "&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)) + search +"&onlineStatus=" + $("#onlineStatus").val() + "&failureStatus=" + $("#failureStatus").val() + "&materialStatus=" + $("#materialStatus").val() + "&name=" + $("#userName").val();
    jzm.paraMessage('loadAjaxdata',{url:"find_machine_list",xmldata:searchUser,callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        for(var i = 0; i < reg.machineShowList.length; i ++){
                str += '<tr>'+
                            '<td>'+ reg.machineShowList[i].machineNumber +'</td>'+
                            '<td>'+ reg.machineShowList[i].adminName +'</td>'+
                            '<td>'+ reg.machineShowList[i].machineAddrDesc +'</td>'+
                            '<td>'+ reg.machineShowList[i].machineSn +'</td>'+
                            '<td class="'+ (reg.machineShowList[i].onlineStatus == '在线' ? 'msg_green' : (reg.machineShowList[i].onlineStatus == '无' ? '' : 'msg_hot')) +'">'+ reg.machineShowList[i].onlineStatus +'</td>'+
                            '<td class="'+ (reg.machineShowList[i].failureStatus == '正常' ? 'msg_green' : (reg.machineShowList[i].failureStatus == '无' ? '' : 'msg_hot')) +'">'+ reg.machineShowList[i].failureStatus +'</td>'+
                            '<td class="'+ (reg.machineShowList[i].materialStatus == '正常' ? 'msg_green' : (reg.machineShowList[i].materialStatus == '无' ? '' : 'msg_hot')) +'">'+ reg.machineShowList[i].materialStatus +'</td>'+
                            '<td>'+
                                '<a href="equipmentEnit.html?uri=/manage/equipmentList.html&v='+jzm.randomNum()+'&machineNumber='+ reg.machineShowList[i].machineNumber +'">编辑  |</a>'+
                                '<a href="equipmentLogShow.html?uri=/manage/equipmentList.html&v='+jzm.randomNum()+'&machineNumber='+ reg.machineShowList[i].machineNumber +'">查看日志   |</a>'+
                                '<a href="orderList.html?v='+jzm.randomNum()+'&machineNumber='+ reg.machineShowList[i].machineNumber +'">查看订单   |</a>'+
                                '<a href="equipmentLongRange.html?uri=/manage/equipmentList.html&v='+jzm.randomNum()+'&machineNumber='+ reg.machineShowList[i].machineNumber +'">远程操作</a>'+
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
jzm.searchequ = function()  /*/商户搜索/*/{
    jzm.paraMessage('loadAjaxdata',{url:"manage_machine",xmldata:"&type=6&name=" + $("#usshanghu").val(),callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        for(var i = 0; i < reg.adminUserList.length; i ++)
            {
                str += '<label for="rio'+ i +'" style="cursor:pointer;margin:1px 0;width:180px;" class="block-title equid_'+ reg.adminUserList[i].adminId +'"><input type="radio" style="opacity:1;" name="adminId" id="rio'+ i +'" value="'+ reg.adminUserList[i].adminId +'" />'+ reg.adminUserList[i].adminName +'</label> <br />';
            };
        $("#showhu").html(str);
      }() : (RegCode(isNullCode).test(reg.statusCode.status) ? $("#showhu").html(str) : jzm.Error(reg) );

    },type:"POST",trcny:true});
};
jzm.searchequEnit = function(log)    /*/编辑前查询设备信息  //日志查询/*/{
  if(!log){
      jzm.paraMessage('loadAjaxdata',{url:"manage_machine",xmldata:"&type=3&machineNumber=" + jzm.getQueryString("machineNumber"),callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? void function(){
          $("#adminId").html('<option value="'+ reg.machineInfo.adminId +'">'+ reg.adminName +'</option>');
          $("input[name='adminId']").val(reg.machineInfo.adminId);
          $("#machineAddrDesc").val(reg.machineInfo.machineAddrDesc);    //详细地址信息
          $("input[name='province']").val(reg.machineInfo.province);  //省
          $("input[name='city']").val(reg.machineInfo.city);  //市
          $("input[name='district']").val(reg.machineInfo.district);  //区
          $("input[name='machineAddrDesc']").val(reg.machineInfo.machineAddrDesc);  //详细地址
          $("#shoemap").val(reg.machineInfo.machineLongitude +","+ reg.machineInfo.machineLatitude);  //经纬度
        }() : jzm.Error(reg);
      },type:"POST",trcny:false});
    }else{
      jzm.paraMessage('loadAjaxdata',{url:"manage_machine",xmldata:"&type=5&machineNumber=" + jzm.getQueryString("machineNumber"),callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? void function(){
          for(var i = 0; i < reg.machineFaultList.length; i++)
            {
              $("#log").html("设备编号：" + reg.machineFaultList[i].machineNumber + " --------- 机器SN号："+ reg.machineFaultList[i].machineSn);
              $("#logshow").append(jzm.getDateTime(reg.machineFaultList[i].faultTime).split(' ')[0] + " --------- "+ reg.machineFaultList[i].faultContent + "\n" + "↓" +"\n");
            };
        }() : ( RegCode(isNullCode).test(reg.statusCode.status) ? $("#logshow").html('无') : jzm.Error(reg) );
      },type:"POST",trcny:true});
  };
};
jzm.searchRoot = function (id)   /*/搜索商户所有的机器/*/{
  jzm.paraMessage('loadAjaxdata',{url:"manage_machine",xmldata:"&type=7&adminId=" + id,callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      for(var i = 0; i < reg.machineNumberList.length; i ++){
              str += '<label for="mc'+ i +'" style="cursor:pointer;margin:1px 0;width:100%;" class="block-title"><input type="checkbox" id="mc'+ i +'" name="machineNumber" value="'+ reg.machineNumberList[i].machineNumber +'" style="opacity:1;" />'+ reg.machineNumberList[i].machineNumber +'-------'+ reg.machineNumberList[i].listName +'</label> <br />';
          };
          $("#shoproot").html(str);
    }() : (RegCode(isNullCode).test(reg.statusCode.status) ? $("#shoproot").html(str) : jzm.Error(reg) );
  },type:"POST",trcny:true});
};
jzm.manageMachineBinding = function(un)   /*/设备绑定 & 设备解绑/*/{
    var machineNumber = $("#equForm").serialize();
    if($("#equs input:first") == "" || $("#equs input:last") == ""){
            alert("请将数据填写完整！");
            return false;
        };
    if(!un){
            jzm.paraMessage('loadAjaxdata',{url:"manage_machine",xmldata:"&type=1&" + machineNumber,callbackfn:function(reg){
              RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = "./equipmentList.html" : jzm.Error(reg);
            },type:"POST",trcny:true});
        }
    else{
            jzm.paraMessage('loadAjaxdata',{url:"manage_machine",xmldata:"&type=2&" + machineNumber,callbackfn:function(reg){
              RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = "./equipmentList.html" : jzm.Error(reg);
            },type:"POST",trcny:true});
        };
};
jzm.manageMachineRootEnit = function () /*/设备编辑/*/{
    $("input[name='machineAddrDesc']").val($("#machineAddrDesc").val());
    $("#machineLongitude").val($("#shoemap").val().split(',')[0]);
    $("#machineLatitude").val($("#shoemap").val().split(',')[1]);
    jzm.paraMessage('loadAjaxdata',{url:"manage_machine",xmldata:"&type=4&"+ $("#equEnitForm").serialize() +"&machineNumber=" + jzm.getQueryString("machineNumber"),callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = "./equipmentList.html" : jzm.Error(reg);
    },type:"POST",trcny:true});
};
jzm.remoteOperation = function(typoe,operid) /*/机器远程操作、查看/*/{
  if (typoe){
    jzm.paraMessage('loadAjaxdata',{url:"remote_operation",xmldata:"&type=2&operationType=" + operid + "&machineNumber=" + jzm.getQueryString("machineNumber"),callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? alert(reg.statusCode.msg) : jzm.Error(reg);
    },type:"POST",trcny:true});
  }else{
    jzm.paraMessage('loadAjaxdata',{url:"remote_operation",xmldata:"&type=1&machineNumber=" + jzm.getQueryString("machineNumber"),callbackfn:function(reg){
      // console.log(reg);
      var str = "",machineConfig_Arr=[];
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        var m = document.getElementsByTagName("input");
        for(var key in reg.machineConfig){
            machineConfig_Arr.push(reg.machineConfig[key]);
        };
        for(var _key = 0; _key < m.length; _key++){
            m[_key].value =  machineConfig_Arr[_key];
        };
        $("#boilerTemperature").text(reg.machineStatus.boilerTemperature);
        $("#machineStatus").text(reg.machineStatus.machineStatus);
        $("#failureStatus").text(reg.machineStatus.failureStatus);
        $("#bootTime").text(reg.machineStatus.bootTime);
        $("#boilerPressure").text(reg.machineStatus.boilerPressure);
        $("#traffic").text(reg.machineStatus.traffic);
        $("#sensorStatus").text(reg.machineStatus.sensorStatus);
        $("#version").text("当前版本："+ reg.machineStatus.version);
        $("label[for='bin1']").text('料仓1-橙汁(容量:'+ reg.canister[1] +')');
        $("#bin1").text('剩余量:' + reg.canister[0]);
        $("label[for='bin2']").text('料仓2-奶粉(容量:'+ reg.canister[3] +')');
        $("#bin2").text('剩余量:' + reg.canister[2]);
        $("label[for='bin3']").text('料仓3-糖(容量:'+ reg.canister[5] +')');
        $("#bin3").text('剩余量:' + reg.canister[4]);
        $("label[for='bin4']").text('料仓4-奶粉(容量:'+ reg.canister[7] +')');
        $("#bin4").text('剩余量:' + reg.canister[6]);
        $("label[for='bin5']").text('料仓5-巧克力(容量:'+ reg.canister[9] +')');
        $("#bin5").text('剩余量:' + reg.canister[8]);
        $("label[for='bin6']").text('料仓6-茶(容量:'+ reg.canister[11] +')');
        $("#bin6").text('剩余量:' + reg.canister[10]);
        $("label[for='bin7']").text('料仓7-咖啡(容量:'+ reg.canister[13] +')');
        $("#bin7").text('剩余量:' + reg.canister[12]);
        $("label[for='bin8']").text('杯子(容量:'+ reg.canister[15] +')');
        $("#bin8").text('剩余量:' + reg.canister[14]);
      }() : jzm.Error(reg);
    },type:"POST",trcny:true});
  };
};
jzm.manageMachineVersionList = function(page)     /*/app应用版本更新  信息列表/*/{
  jzm.paraMessage('loadAjaxdata',{url:"manage_machine_version",xmldata:"&type=1&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)),callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      for(var i = 0; i < reg.machineUpdateList.length; i++)
        {
          str += '<tr>'+
                      '<td>'+ reg.machineUpdateList[i].mUpdateId +'</td>'+
                      '<td>'+ reg.machineUpdateList[i].mUpdateVersion +'</td>'+
                      '<td>'+ reg.machineUpdateList[i].versionCode +'</td>'+
                      '<td>'+ jzm.getDateTime(reg.machineUpdateList[i].mUpdateTime) +'</td>'+
                      '<td>'+ reg.machineUpdateList[i].mUpdateDes +'</td>'+
                      '<td><a href="'+ reg.machineUpdateList[i].mUpdateUrl +'">下载APK</a></td>'+
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
jzm.manageMachineVersion = function()     /*/app应用版本更新/*/{
  jzm.paraMessage('loadAjaxdata',{url:"manage_machine_version",xmldata:"&type=2&" + $("#vision").serialize(),callbackfn:function(reg){
    RegCode(statusCode).test(reg.statusCode.status) ? window.location.reload() : jzm.Error(reg);
  },type:"POST",trcny:true});
};
jzm.checkInMaintainer = function(page) /*/巡视签到/*/{
  jzm.paraMessage('loadAjaxdata',{url:"find_machine_inspect_log_list",xmldata:"&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)) + "&name=" + $("#cheakin").val() + "&machineNumber=" + $("#machineNumber").val(),callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      for(var i = 0; i < reg.machineInspectSignList.length; i ++)
        {
          str += '<tr>'+
                      '<td>'+ reg.machineInspectSignList[i].inspectId +'</td>'+
                      '<td>'+ reg.machineInspectSignList[i].maintainerName +'</td>'+
                      '<td>'+ reg.machineInspectSignList[i].maintainerId +'</td>'+
                      '<td>'+ reg.machineInspectSignList[i].machineNumber +'</td>'+
                      '<td>'+ reg.machineInspectSignList[i].inspectAddr +'</td>'+
                      '<td>'+ jzm.getDateTime(reg.machineInspectSignList[i].inspectTime) +'</td>'+
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
