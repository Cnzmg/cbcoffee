jzm.ManageUser = function(page) /*/用户列表/*/{
    jzm.loadAjaxdata({url:"find_user_list",xmldata:"&adminStatus=" + $('#adminStatus').val() + "&roleId=" + $('#roleId').val() + "&name=" + $('#userName').val() + "&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)),callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? (function(){
        for(var i = 0; i < reg.adminUserList.length; i++)
            {
                if (reg.adminUserList[i].roleId == 1)
                    {
                        reg.adminUserList[i].roleId = "超级管理员";
                    }
                else if(reg.adminUserList[i].roleId == 2)
                    {
                        reg.adminUserList[i].roleId = "系统管理员";
                    }
                else if(reg.adminUserList[i].roleId == 3)
                    {
                        reg.adminUserList[i].roleId = "商户管理员";
                    }
                else
                    {
                        reg.adminUserList[i].roleId = "普通用户";
                    };
                if(!reg.adminUserList[i].loginTime)
                    {
                       var d = jzm.getDateTime(reg.adminUserList[i].registerTime)
                    }
                else{
                       var d = jzm.getDateTime(reg.adminUserList[i].loginTime)
                    }
                str += '<tr>'+
                            '<td>'+ reg.adminUserList[i].realName +'</td>'+
                            '<td>'+ reg.adminUserList[i].adminName +'</td>'+
                            '<td>'+ reg.adminUserList[i].roleId +' </td>'+
                            '<td>'+ (reg.adminUserList[i].adminStatus == 0 ? "冻结" : "正常") +'</td>'+
                            '<td>'+ (reg.adminUserList[i].royaltyRate * 100) +' % </td>'+
                            '<td>'+ reg.adminUserList[i].wallet +'</td>'+
                            '<td>'+ reg.adminUserList[i].nickName +'/'+ reg.adminUserList[i].userId +'</td>'+
                            '<td>'+ d +'</td>'+
                            '<td><a href="userEnitTables.html?uri=/manage/tables.html&adminId='+ reg.adminUserList[i].adminId +'&v='+jzm.randomNum()+'">详情    |</a>';
                            if (reg.adminUserList[i].adminId != 1) {
                               str += '<a href="javascript:void(0);" onclick="jzm.prohibitman('+ reg.adminUserList[i].adminId +')">'+ (reg.adminUserList[i].adminStatus == 0 ? "激活" : "冻结") +'    |</a>'+
                                '<a href="javascript:void(0);" onclick="jzm.deleteman('+ reg.adminUserList[i].adminId +')">删除    </a>';
                            };
                          str += '</td>'+
                        '</tr>';
            };
            $("#pageNums").val(reg.pageCount * 20);
            $('#tbodyhtml').html(str);
            if($("#seach").attr('data-type')) jzm.search(reg);
      })() : (
        RegCode(isNullCode).test(reg.statusCode.status) ? void function(){
        $("#pageTool").css('display','none');
        $('#tbodyhtml').html(str);
      }() : jzm.Error(reg) );
    },type:"POST",trcny:false});
};
jzm.prohibitman = function(id) /*/冻结帐号/*/{
    var proAlex = confirm("是否更改该帐号状态？");
    if (proAlex == true){
      jzm.paraMessage('loadAjaxdata',{url:"manage_user",xmldata:"&type=3&toAdminId=" + id,callbackfn:function(reg){
            RegCode(statusCode).test(reg.statusCode.status) ? void function(){
              alert(reg.statusCode.msg);
              window.location.reload();
            }() : jzm.Error(reg);
          },type:"POST",trcny:true});
      };
};
jzm.deleteman = function(id)   /*/删除帐号/*/{
    var proAlex = confirm("是否删除该用户？");
    if (proAlex == true){
        jzm.paraMessage('loadAjaxdata',{url:"manage_user",xmldata:"&type=4&toAdminId=" + id,callbackfn:function(reg){
          RegCode(statusCode).test(reg.statusCode.status) ? void function(){
              alert(reg.statusCode.msg);
              window.location.reload();
            }() : jzm.Error(reg);
          },type:"POST",trcny:true});
        };
};
jzm.AddadminMan = function()  /*/添加用户/*/{
   var len = parseFloat($("#royaltyRate").val() * 10000) / (100 *10000).toFixed(2);
   $("input[name='royaltyRate']").val(len);
// var m = document.getElementsByTagName("input");
// for(var i = 0; i < m.length; i++){
//      if(!m[i].value){
//          if(i==6){continue};
//          alert("请将信息填写完整！");
//          return false;
//        }
//      };
    if ($("#adminName").val().length < 10){
          alert("用户名长度不能少于10个字符");
          return false;
        };
    if ($("#adminPwda").val() != $("#adminPwd").val()){
          $("#adminPwd").siblings('span').text("两次密码输入不一致！");
          return false;
        }
    else{
          $("#adminPwd").siblings('span').text("重复输入密码，确认正确输入");
          if ($("#adminPwd").val().length < 8)
              {
                  alert("密码长度不能少于8个字符");
                  return false;
              };
        };
    if($("#roleId option[data-select='true']").length < 1){$("#roleId").siblings('div.newSelect').css("border","2px solid red");return false;};
    if($("#royaltyRate").val() > 100){$("#royaltyRate").css("borderColor","red");return false;};

    $("#roleId").val($("#roleId option[data-select='true']").val());
    $("input[name='userId']").val($("#userId option[data-select='true']").length > 0 ? $("#userId option[data-select='true']").val() : $("input[name='userId']").val());
    jzm.paraMessage('loadAjaxdata',{url:"manage_user",xmldata:"&type=5&"+ $("#AddUser").serialize(),callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        alert(reg.statusCode.msg);
        window.location.href = "./tables.html";
      }() : jzm.Error(reg);
    },type:"POST",trcny:true});
};
jzm.EnitadminMan = function(w) /*/编辑用户/*/{
    if (w){
      if ($("#adminPwda").val() != $("#adminPwd").val()){
              $("#adminPwd").siblings('span').text("两次密码输入不一致！");
              return false;
          }
      else{
            $("#adminPwd").siblings('span').text("重复输入密码，确认正确输入");
//          if ($("#adminPwd").val() != "" && $("#adminPwd").val().length < 8)
//              {
//                  alert("密码长度不能少于8个字符");
//                  return false;
//              };
          };
        var len = parseFloat($("#royaltyRate").val() * 10000) / (100 * 10000).toFixed(2);
        $("input[name='royaltyRate']").val(len);
        if($("#royaltyRate").val() > 100){$("#royaltyRate").css("borderColor","red");return false;};
        $("input[name='roleId']").val($("#roleId option[data-select='true']").length > 0 ? $("#roleId option[data-select='true']").val() : $("input[name='roleId']").val());
        $("input[name='userId']").val($("#userId option[data-select='true']").length > 0 ? $("#userId option[data-select='true']").val() : $("input[name='userId']").val());
        var adminUser = $("#AddUser").serialize();
        jzm.paraMessage('loadAjaxdata',{url:"manage_user",xmldata:"&type=6&"+ adminUser,callbackfn:function(reg){
          RegCode(statusCode).test(reg.statusCode.status) ? void function(){
              alert(reg.statusCode.msg);
              window.location.href = "./tables.html";
            }() : jzm.Error(reg);
          },type:"POST",trcny:true});
        }
        else{
            jzm.paraMessage('loadAjaxdata',{url:"manage_user",xmldata:"&type=1&toAdminId=" + jzm.getQueryString("adminId"),callbackfn:function(reg){
              RegCode(statusCode).test(reg.statusCode.status) ? void function(){
                $("#adminName").val(reg.adminUser.adminName); // 用户名
                if (reg.adminUser.roleId == 1)
                    {
                        $("#roleId").html('<option value="1">超级管理员</option>');
                    };
                $("input[name='roleId']").val(reg.adminUser.roleId);  //角色权限ID

                $("#loginTime").val(reg.adminUser.loginTime != null ? jzm.getDateTime(reg.adminUser.loginTime) : ""); // 上次登录时间

                $("#loginIp").val(reg.adminUser.loginIp); // 上次登录ip

                $("#realName").val(reg.adminUser.realName); // 真实姓名
                $("#adminMobile").val(reg.adminUser.adminMobile); // 联系方式

                $("#adminId").val(reg.adminUser.adminId);
                $("#adminToken").val(reg.adminUser.adminToken);
                $("#registerTime").val(jzm.getDateTime(reg.adminUser.registerTime));
                $("#manageId").val(reg.adminUser.manageId);
                $("#rolereg").val(reg.adminUser.rolereg);
                $("#adminStatus").val(reg.adminUser.adminStatus);
                //密码
                $("#adminPwd").val(reg.adminUser.adminPwd);
                $("#adminPwda").val(reg.adminUser.adminPwd);
                $('#roleId').multiselect({
                  setMaxStrLength:100,
                  setWidth:'300px',
                  multiple:false,
                  selectedHtmlValue:(reg.adminUser.roleId == 1 ? "超级管理员" : (reg.adminUser.roleId == 2 ? "系统管理员" : "商户管理员"))
                });
                $("#royaltyRate").val(reg.adminUser.royaltyRate * 100);
                $("input[name='royaltyRate']").val(reg.adminUser.royaltyRate);
                $("input[name='userId']").val(reg.adminUser.userId);
                $('#userId').multiselect({
                  setMaxStrLength:100,
                  setWidth:'300px',
                  multiple:false,
                  selectedHtmlValue:reg.adminUser.nickName
                });
              }() : jzm.Error(reg);
            },type:"POST",trcny:true});
        };
};
jzm.JournalList = function (page)  /*/日志列表/*/{
    jzm.paraMessage('loadAjaxdata',{url:"find_log_list",xmldata:"&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)) + "&roleId=" + $("#roleId").val() + "&name=" + $("#userName").val(),callbackfn:function(reg){
        var str = ""; 
        RegCode(statusCode).test(reg.statusCode.status) ? void function(){
          for(var i = 0; i < reg.logInfoList.length; i++){
                  if (reg.logInfoList[i].roleId == 1){
                          reg.logInfoList[i].roleId = "超级管理员";
                      }
                  else if(reg.logInfoList[i].roleId == 2){
                          reg.logInfoList[i].roleId = "系统管理员";
                      }
                  else if(reg.logInfoList[i].roleId == 3){
                          reg.logInfoList[i].roleId = "商户管理员";
                      }
                  else{
                          reg.logInfoList[i].roleId = "普通用户";
                      };
                  str += '<tr>'+
                              '<td>'+ reg.logInfoList[i].realName +'</td>'+
                              '<td>'+ reg.logInfoList[i].adminName +'</td>'+
                              '<td>'+ reg.logInfoList[i].roleId +' </td>'+
                              '<td>'+ jzm.getDateTime(reg.logInfoList[i].logTime) +'</td>'+
                              '<td>'+ reg.logInfoList[i].logContent +'</td>'+
                          '</tr>';
              };
          $("#pageNums").val(reg.pageCount * 20);
          $('#tbodyhtml').html(str);
          if($("#seach").attr('data-type')) jzm.search(reg);
        }() : (
          RegCode(isNullCode).test(reg.statusCode.status) ? void function(){
            $("#pageTool").css('display','none');
            $('#tbodyhtml').html(str);
          }() : jzm.Error(reg)
        );
    },type:"POST",trcny:false});
};
//系统管理者
jzm.productList = function(page) /*/产品列表/*/{
    location.hash && $("#productName").val() != '' ? page = location.hash.split('=')[1] : null;
    jzm.paraMessage('loadAjaxdata',{url:"find_product_list",xmldata:"&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)) + "&name=" + $("#productName").val() + "&machineType=" + $('#machineType').val(),callbackfn:function(reg){
        var str = "";
        RegCode(statusCode).test(reg.statusCode.status) ? void function(){
          for(var i = 0; i < reg.productShowList.length; i++){
              str += '<tr>'+
                          '<td>'+ reg.productShowList[i].productId +'</td>'+
                          '<td>'+ reg.productShowList[i].productName +'</td>'+
                          '<td>'+ parseFloat((reg.productShowList[i].productPrice != null ? reg.productShowList[i].productPrice : 0) / 100).toFixed(2) +' </td>'+
                          '<td style="position:relative;cursor:poionter;"><img style="width:50px;height:25px" src="'+ reg.productShowList[i].productPicurl +'" alt="" data-img="'+ reg.productShowList[i].productPicurl +'" /></td>'+
                          '<td class=' + (reg.productShowList[i].machineType == 1 ? "machine-big-tip" : "machine-small-tip") +'>'+ ( reg.productShowList[i].machineType == 1 ? "大型柜式机" : "小型桌面机") +'</td>'+
                          '<td>'+ reg.productShowList[i].formulaName +'</td>'+
                          '<td>'+ reg.productShowList[i].bunkerNumber +'</td>'+
                          '<td>'+ jzm.getDateTime(reg.productShowList[i].createTime) +'</td>'+
                          '<td>'+ reg.productShowList[i].productRank +'</td>'+
                          '<td><a href="userEnitProduct.html?uri=/manage/productList.html&hstimer='+ new Date().getHours() +'&v='+jzm.randomNum()+'&productId='+ reg.productShowList[i].productId + location.hash+'">编辑</a></td>'+
                      '</tr>';
              };
              $("#pageNums").val(reg.pageCount * 20);
              $('#tbodyhtml').html(str);
              if($("#seach").attr('data-type')) jzm.search(reg);
        }() : (
          RegCode(isNullCode).test(reg.statusCode.status) ? void function(){
            $("#pageTool").css('display','none');
            $('#tbodyhtml').html(str);
          }() : jzm.Error(reg)
        );
    },type:"POST",trcny:false});
    $("img[data-img]").bind('mouseover',function(){
      $(this).before('<div style="position:absolute;bottom:42px;left:78px;width:100%;height:300%;background:url('+$(this).attr('src')+') no-repeat center center;background-size:100%;z-index:9;"></div>');
      $(this).mouseout(function(){
        $(this).siblings('div').remove();
      })
    })
};
jzm.productListAdd = function(e)  /*/产品添加/*/{
    if (e){
      if ($("#productTemperaturevalue").val() == ""){
              $("#productTemperaturevalue").removeAttr('name');
          }else{
              $("#productTemperature1").removeAttr('name');
          };
      if(!$("input[name='productTemperature']").is(":checked")){alert("请选择口味冷/热!");return false};
      if(!$('#productRank').val()) {$('#productRank').css('borderColor','red'); return false;};
      
      $("input[name='productPrice']").val($("#productPrice").val() * 100);
      jzm.paraMessage('loadAjaxdata',{url:"manage_product",xmldata:"&type=4&"+ $("#AddProduct").serialize() + $(".newSelectTitle span").attr('data-machine'),callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = "./productList.html" : /*/jzm.Error(reg)/*/console.log(reg);
      },type:"POST",trcny:true});
      }
  else{
      jzm.paraMessage('loadAjaxdata',{url:"manage_product",xmldata:"&type=2",callbackfn:function(reg){
          RegCode(statusCode).test(reg.statusCode.status) ? void function(){
            var str = "",_type = [];
            for(var i = 0; i< reg.formulaInfoList.length; i++){
                str += '<option value ="&formulaId='+ reg.formulaInfoList[i].formulaId +'&machineType='+ reg.formulaInfoList[i].machineType +'" >'+ reg.formulaInfoList[i].formulaName +'</option>';
                _type.push(reg.formulaInfoList[i].machineType);
              };
            $("#formulaId").html(str);
            $('#formulaId').multiselect({
              setMaxStrLength:100,
              setWidth:'100%',
              multiple:false,
              selectedHtmlValue:'请选择配方',
              __type:_type,
              callbackfn:function(e){
              	//回调函数
              	e = $(".newSelectTitle span").attr('data-machine');
              	e.substr(e.lastIndexOf('=') + 1, e.length) == 1 ? $('.machine-small').fadeOut() : $('.machine-small').fadeIn();
              	
              }
            });
          }() : jzm.Error(reg);
        },type:"POST",trcny:true});
    };
};
jzm.productListEnit = function(e)  /*/产品编辑/*/{
    if (e){
        $("input[name='productPrice']").val($("#productPrice").val() * 100);
        if(!$("input[name='productTemperature']").is(":checked")){alert("请选择口味冷/热!");return false};
        jzm.paraMessage('loadAjaxdata',{url:"manage_product",xmldata:"&type=5&"+$("#AddProduct").serialize() + $(".newSelectTitle span").attr('data-machine'),callbackfn:function(reg){
            RegCode(statusCode).test(reg.statusCode.status) ? void function(){
            	jzm.delOldFile('false');
            	window.location.href = jzm.getQueryString('uri') + location.hash;
            }(): jzm.Error(reg);
          },type:"POST",trcny:true});
        }
    else{
            jzm.paraMessage('loadAjaxdata',{url:"manage_product",xmldata:"&type=1&productId=" + jzm.getQueryString("productId"),callbackfn:function(reg){
                $("#productId").val(reg.productInfo.productId);
                $("#productName").val(reg.productInfo.productName);
                $("#productPrice").val(parseFloat((reg.productInfo.productPrice != null ? reg.productInfo.productPrice : 0) / 100).toFixed(2));
                $("input[name='productPrice']").val(parseFloat((reg.productInfo.productPrice != null ? reg.productInfo.productPrice : 0) / 100).toFixed(2));
                $("#productMachinePicurl").val(reg.productInfo.productMachinePicurl);
                $("#productPicurl").val(reg.productInfo.productPicurl);

                $("#productMachine_picurl_img").attr("src",reg.productInfo.productMachinePicurl);
                $("#productPicurl_img").attr("src",reg.productInfo.productPicurl);

                $("#productRank").val(reg.productInfo.productRank);
                $("#productCreateTime").val(jzm.getDateTime(reg.productInfo.productCreateTime));
                // productTemperature
                $("input[name='productTemperature']").prop('checked',false);  //清除之前的选中
                if (reg.productInfo.productTemperature == 0){  //冷热状态     冷
                        $("input[name='productTemperature']").eq(0).prop("checked",true);
                        $("input[name='productTemperature']").not('.cold').parents('label.tempera').hide(); //初始化对应
                    }
                else if (reg.productInfo.productTemperature == 1){   //热
                        $("input[name='productTemperature']").eq(1).prop("checked",true);
                        $("input[name='productTemperature']").not('.hot').parents('label.tempera').hide(); //初始化对应
                    }
                else if(reg.productInfo.productTemperature == 2){   //冷&热
                        $("input[name='productTemperature']").eq(2).prop("checked",true);
                    };
                if(reg.productInfo.operateType == 1){
                        $("input[name='operateType']").removeAttr('checked');
                        $("input[name='operateType']").eq(1).prop("checked",true);
                    }
                else if(reg.productInfo.operateType == 2){
                        $("input[name='operateType']").removeAttr('checked');
                        $("input[name='operateType']").eq(2).prop("checked",true);
                    }
                else{
                        $("input[name='operateType']").removeAttr('checked');
                        $("input[name='operateType']").eq(0).prop("checked",true);
                    };
                var str = "",name,_type=[];
                for(var i = 0; i< reg.formulaInfoList.length; i++){
                    if (reg.formulaInfoList[i].formulaId == reg.productInfo.formulaId){
                            name = reg.formulaInfoList[i].formulaName + "," + reg.formulaInfoList[i].formulaId;
                        };
                      str += '<option value =&formulaId='+ reg.formulaInfoList[i].formulaId +'&machineType=' + reg.formulaInfoList[i].machineType +'>'+ reg.formulaInfoList[i].formulaName +'</option>';
                      _type.push(reg.formulaInfoList[i].machineType);
                  };
                $("#formulaId").html(str);
                $('#formulaId').multiselect({
                  setMaxStrLength:100,
                  setWidth:'100%',
                  multiple:false,
                  selectedHtmlValue:name.split(',')[0],
                  __type:_type,
                  callbackfn:function(e){
                  	e = $('.newSelectTitle span').attr('data-machine');
                  	e.substr(e.lastIndexOf('=') + 1,e.length) == 1 ? $('.machine-small').fadeOut() : $('.machine-small').fadeIn();
                  	
                  }
                });
                //jzm.formulaIds(reg.productInfo.formulaId,reg.flavorInfoList);  //获取对应的配方
                //productStatus是否上架状态
                if(reg.productInfo.productStatus == 1){
                        $("#productStatus").attr("checked",true);
                        $("#productStatus1").removeAttr('checked');
                    }
                else{
                        $("#productStatus1").attr("checked",true);
                        $("#productStatus").removeAttr('checked');
                    };
                if(reg.productInfo.machineType == 1){
                	$(".newSelectTitle span").attr({class:'machine-big-tip',"data-machine":"&formulaId="+name.split(',')[1]+"&machineType=1"})
                }else{
                	$(".newSelectTitle span").attr({class:'machine-small-tip',"data-machine":"&formulaId="+name.split(',')[1]+"&machineType=2"})
                	$(".machine-small").fadeIn();
                	$("#productMachineDetailPicurl_img").attr("src",reg.productInfo.productMachineDetailPicurl);
                	$("#productMachineDetailPicurl").val(reg.productInfo.productMachineDetailPicurl);
                }
                jzm.delOldFile({f:["&type=2&oldName="+$("#productPicurl").val().substring($("#productPicurl").val().lastIndexOf('\/') + 1, $("#productPicurl").val().length),"&type=3&oldName=" + $("#productMachinePicurl").val().substring($("#productMachinePicurl").val().lastIndexOf('\/') + 1, $("#productMachinePicurl").val().length)],id:['productPicurl','productMachinePicurl']});
                },type:"POST",trcny:false});
        };

};

//*****************************************************废弃
jzm.formulaIds = function(val,arr)    /*/查询产品口味信息/*/{
    var checkedAction = ''; //checked
      $("input[name='productTemperature']").not('.hot').parents('label.tempera').hide(); //初始化对应
    jzm.paraMessage('loadAjaxdata',{url:"find_optional_flavorInfo_by_formulaId",xmldata:"&formulaId="+ val,callbackfn:function(reg){
          var str = "";
          RegCode(statusCode).test(reg.statusCode.status) ? void function(){
            for(var i = 0; i < reg.flavorInfoList.length; i++){
                  if(i < 3){checkedAction = "checked";}else{checkedAction = "";};  //不可选超过三个口味时
                  reg.flavorInfoList[i].flavorTemperature == 1 ? $("input[name='productTemperature']").parents('label.tempera').show() : null;//可选择的冷热信息   //只要存在1 即可冷可热   0只能热
                  str += '<div class="form-group">'+
                      '<label class="col-sm-2 control-label"></label>'+
                      '<div class="col-xs-8">'+
                          '<input type="checkbox" style="margin:0;opacity:1;" '+ checkedAction +' class="selprodep" data-type="flavorId" name="flavorIdArray" id="flavorId'+ reg.flavorInfoList[i].flavorId +'"  value="'+ reg.flavorInfoList[i].flavorId +'">'+
                          '<span style="margin-right:10px;">口味名称：'+ reg.flavorInfoList[i].flavorName +'</span>'+
                      '</div>'+
                  '</div>';
                };
            $("#showProct").html(str);
          }() : $("#showProct").html('无数据');
          if(arr){  //编辑时的对应显示的勾选
            $("input[data-type='flavorId']").removeProp("checked");
            var list = $("input[data-type='flavorId']");
              for(var u in arr){
                for(var x = 0; x < list.length; x++){
                    if(list[x].value == arr[u]){
                      $("#flavorId"+arr[u]).prop("checked",true);
                    };
                };
              };
          };//初始化
      },type:"POST",trcny:true});
};

jzm.mangFlavor = function()       /*/口味的管理/*/{
    jzm.paraMessage('loadAjaxdata',{url:"manage_flavor",xmldata:"&page=1&type=1",callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? void function(){
          var str = "";
          for(var i = 0; i < reg.flavorInfoList.length; i++){
                str += '<tr>'+
                            '<td>'+ reg.flavorInfoList[i].flavorId +'</td>'+
                            '<td>'+ reg.flavorInfoList[i].flavorName +'</td>'+
                            '<td><a href="javascript:void(0);" onclick="jzm.enitBox('+ reg.flavorInfoList[i].flavorId +')">编辑</a></td>'+
                        '</tr>';
              };
          document.getElementById("tbodyhtml").innerHTML = str;
          jzm.moduleBox();
        }() : jzm.Error(reg);
    },type:"POST",trcny:false});
};

jzm.enitBox = function(id)  /*/提交修改口味名称/*/{
    if (!id){
      jzm.paraMessage('loadAjaxdata',{url:"manage_flavor",xmldata:"&type=2&flavorId=" + $("#flId").val() + "&flavorName=" + $("#editBoxs").val(),callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? jzm.mangFlavor() : jzm.Error(reg);
      },type:"POST",trcny:true});
    }else{
        jzm.moduleBox('show');
        $("#flId").val(id);
    };
};
//*****************************************************废弃

jzm.formulaList = function(page)   /*/配方列表/*/{
    jzm.paraMessage('loadAjaxdata',{url:"find_formula_list",xmldata:"&page=" + (page ? page : page =1 ) + "&name=" + $('#formulaLi').val() +"&machineType=" +$("#machineType").val(),callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        for(var i = 0; i < reg.formulaInfoList.length; i++)
            {
                str += '<tr>'+
                            '<td>'+ reg.formulaInfoList[i].formulaId +'</td>'+
                            '<td class="'+( reg.formulaInfoList[i].machineType == 1 ? "machine-big-tip" : "machine-small-tip" )+'">'+ reg.formulaInfoList[i].formulaName +' </td>'+
                            '<td>'+ jzm.getDateTime(reg.formulaInfoList[i].createTime) +'</td>'+
                            '<td><a href="EnitFormula.html?uri=/manage/formulaList.html&v='+ jzm.randomNum() +'&formulaId='+ reg.formulaInfoList[i].formulaId +'">编辑</a></td>'+
                        '</tr>';
            };
            $("#pageNums").val(reg.pageCount * 20);
            $('#tbodyhtml').html(str);
            if($("#seach").attr('data-type')) jzm.search(reg);
      }() : (
        RegCode(isNullCode).test(reg.statusCode.status) ? void function(){
          $("#pageTool").css('display','none');
          $('#tbodyhtml').html(str);
        }() : jzm.Error(reg)
      );
    },type:"POST",trcny:false});
};

jzm.Addformula = function (e)       /*/配方添加/*/{
	var m = document.getElementsByTagName("input"),d;
    for(var j = 0; j < m.length; j++)
        {
            if (m[j].getAttribute("placeholder"))
                {
                    if (m[j].value != "")
                        {
                        var op = m[j].getAttribute("placeholder");
                        if (m[j].value > parseInt(op.split('=')[1]))
                            {
                                alert("请输入规范数值！");
                                $(m[j]).css("borderColor","red");
                                return false;
                            }
                        else
                            {
                                $(m[j]).css("borderColor","#dca28c");
                            };
                    };
                };
        };
    e ? ~function(){d = "2&"+$("#formulaMakeList").serialize();return}() : ~function(){d = "1&" + $("#AddProduct").serialize()}();
    jzm.paraMessage('loadAjaxdata',{url:"manage_formula",xmldata:"&type=2&machineType="+ d,callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = './formulaList.html' : jzm.Error(reg);
    },type:"POST",trcny:true});
};

jzm.Enitformula = function (e)       /*/配方编辑/*/{
    if (e){
        var m = document.getElementsByTagName("input"),d;
        for(var j = 0; j < m.length; j++)
            {
                if (m[j].getAttribute("placeholder"))
                    {
                        if (m[j].value != "")
                            {
                            var op = m[j].getAttribute("placeholder");
                            if (m[j].value > parseInt(op.split('=')[1]))
                                {
                                    alert("请输入规范数值！");
                                    $(m[j]).css("borderColor","red");
                                    return false;
                                }
                            else
                                {
                                    $(m[j]).css("borderColor","#dca28c");
                                };
                            }
                    };
            };
			e === "formulaMakeList" ? ~function(){d = "2&formulaId="+ jzm.getQueryString('formulaId') +"&"+$("#formulaMakeList").serialize();return}() : ~function(){d = "1&formulaId="+ jzm.getQueryString('formulaId') +"&" + $("#EnitProduct").serialize()}();
            jzm.paraMessage('loadAjaxdata',{url:"manage_formula",xmldata:"&type=3&machineType=" + d,callbackfn:function(reg){
              RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = './formulaList.html' : jzm.Error(reg);
            },type:"POST",trcny:true});
        }
    else{
            jzm.paraMessage('loadAjaxdata',{url:"manage_formula",xmldata:"&type=1&formulaId=" + jzm.getQueryString("formulaId"),callbackfn:function(reg){
                RegCode(statusCode).test(reg.statusCode.status) ? void function(){
                  $("input[name='formulaName']").val(reg.formulaInfo.formulaName);
                  $("#machineType").val(reg.formulaInfo.machineType);
                  if(reg.formulaInfo.formulaMakeList != null){
                  	for(var i = 0; i < reg.formulaInfo.formulaMakeList.length; i++){
                          if (reg.formulaInfo.formulaMakeList[i].canisterId == 170){
                                $("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 164) +"].waterVolume']").val(reg.formulaInfo.formulaMakeList[i].waterVolume);
                                $("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 164) +"].gradientWeight']").val(reg.formulaInfo.formulaMakeList[i].gradientWeight);
                                $("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 164) +"].mixSpeed']").val(reg.formulaInfo.formulaMakeList[i].mixSpeed);
                                $("select[name='formulaMakeList[" + parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 164) +"].recipeOutOrder']" ).val(reg.formulaInfo.formulaMakeList[i].recipeOutOrder);
                                $("input[name='formulaMakeList[" + parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 164) +"].recipeOutSpeed']" ).val(reg.formulaInfo.formulaMakeList[i].recipeOutSpeed);
                                $("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 164) +"].delayTime']").val(reg.formulaInfo.formulaMakeList[i].delayTime);
                                $("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 164) +"].flavorName']").val(reg.formulaInfo.formulaMakeList[i].flavorName);
                                  
	                            if(reg.formulaInfo.formulaMakeList[i].flavorCanChange == 1){
	                                $("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 164) +"].flavorCanChange']").eq(0).prop('checked',true);
	                            }else{
	                            	$("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 164) +"].flavorCanChange']").eq(1).prop('checked',true);
	                            }
	                            if(reg.formulaInfo.formulaMakeList[i].flavorTemperature == 0){
	                                $("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 164) +"].flavorTemperature']").eq(0).prop('checked',true);
	                            }else{
	                            	$("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 164) +"].flavorTemperature']").eq(1).prop('checked',true);
	                            }
                                  
                              }
                          else{
                                  $("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 1) +"].waterVolume']").val(reg.formulaInfo.formulaMakeList[i].waterVolume);
                                  $("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 1) +"].gradientWeight']").val(reg.formulaInfo.formulaMakeList[i].gradientWeight);
                                  $("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 1) +"].mixSpeed']").val(reg.formulaInfo.formulaMakeList[i].mixSpeed);
                                  $("select[name='formulaMakeList[" + parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 1) +"].recipeOutOrder']" ).val(reg.formulaInfo.formulaMakeList[i].recipeOutOrder);
                                $("input[name='formulaMakeList[" + parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 1) +"].recipeOutSpeed']" ).val(reg.formulaInfo.formulaMakeList[i].recipeOutSpeed);
                                
                                $("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 1) +"].flavorName']").val(reg.formulaInfo.formulaMakeList[i].flavorName);
                                  if(reg.formulaInfo.formulaMakeList[i].canisterId == 6)
                                  {
                                      $("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 1) +"].delayTime']").val(reg.formulaInfo.formulaMakeList[i].delayTime);
                                  }
                                  if(reg.formulaInfo.formulaMakeList[i].flavorCanChange == 1){
		                                $("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 1) +"].flavorCanChange']").eq(0).prop('checked',true);
		                            }else{
		                            	$("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 1) +"].flavorCanChange']").eq(1).prop('checked',true);
		                            }
		                            if(reg.formulaInfo.formulaMakeList[i].flavorTemperature == 0){
		                                $("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 1) +"].flavorTemperature']").eq(0).prop('checked',true);
		                            }else{
		                            	$("input[name='formulaMakeList["+ parseInt(reg.formulaInfo.formulaMakeList[i].canisterId - 1) +"].flavorTemperature']").eq(1).prop('checked',true);
		                            }
                              };
                              
                      };
                  }else{
                  	for(var i = 0; i < reg.formulaInfo.officeFormulaMakeList.length; i++){
                  		$("#coffeeFlow").val(reg.formulaInfo.officeFormulaMakeList[i].coffeeFlow);
                  		$("#coffeeTemporature").val(reg.formulaInfo.officeFormulaMakeList[i].coffeeTemporature);
                  		$("#coffeeWeight").val(reg.formulaInfo.officeFormulaMakeList[i].coffeeWeight);
                  		$("#playMilkTime").val(reg.formulaInfo.officeFormulaMakeList[i].playMilkTime);
                  		if(reg.formulaInfo.officeFormulaMakeList[i].pumpPressure == -1){
                  			$("input[name='officeFormulaMakeList[0].pumpPressure']").eq(0).prop('checked',true);
                  		}else if(reg.formulaInfo.officeFormulaMakeList[i].pumpPressure == 0){
                  			$("input[name='officeFormulaMakeList[0].pumpPressure']").eq(2).prop('checked',true);
                  		}else{
                  			$("input[name='officeFormulaMakeList[0].pumpPressure']").eq(1).prop('checked',true);
                  		}
                  		$("#americanHotWaterWeight").val(reg.formulaInfo.officeFormulaMakeList[i].americanHotWaterWeight);
                  	}
                  }
                   jzm.machine_btn();
                }() : jzm.Error(reg);
            },type:"POST",trcny:false});
        };

};

// ********************************清单列表***************************************************
jzm.detailedList = function(page)     /*/清单列表/*/{
    jzm.paraMessage('loadAjaxdata',{url:"manage_prodcut_list_list",xmldata:"&type=1&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)) + "&name=" + $("#name").val() + "&machineType=" + $('#machineType').val(),callbackfn:function(reg){
        var str = "";
        str += '<div>'+
                      '<span>清单ID</span>'+
                      '<span>清单名称</span>'+
                      '<span>机器类型</span>'+
                      '<span>操作</span>'+
                  '</div>';
        RegCode(statusCode).test(reg.statusCode.status) ? void function(){
          for(var i = 0; i < reg.productListList.length; i ++)
              {
                  str += '<div class="ledShow" id="led'+ reg.productListList[i].listId +'"><span>'+ reg.productListList[i].listId +'</span>'+
                          '<span >'+ reg.productListList[i].listName +'</span>'+
                          '<span class='+ (reg.productListList[i].machineType == 1 ? "machine-big-tip" : "machine-small-tip") +'>'+ (reg.productListList[i].machineType == 1 ? "大型柜式机" : "小型桌面机") +'</span>'+
                          '<span>'+
                              '<a href="javascript:void(0);" onclick="jzm.msgDetailedList('+ reg.productListList[i].listId +')">清单详情  |</a>'+
                              '<a href="javascript:void(0)" onclick="jzm.detailedEnit('+ reg.productListList[i].listId +')">编辑  |</a>';
                  if(i != 0 && i != 1 && i != 2)
                      {
                          str += '<a href="javascript:void(0);" onclick="jzm.deleDetailed('+ reg.productListList[i].listId +')">     删除</a>';
                      };

                  str += '</span></div>';
              };
              $("#pageNums").val(reg.pageCount * 20);
              $('#tbodyhtml').html(str);
              if($("#seach").attr('data-type')) jzm.search(reg);
          }() : (
            RegCode(isNullCode).test(reg.statusCode.status) ? void function(){
              $("#pageTool").css('display','none');
              $('#tbodyhtml').html(str);
            }() : jzm.Error(reg)
          );
        },type:"POST",trcny:false});
};
jzm.msgDetailedList = function(id,page,pnum)  /*/清单详情/*/{
    if(!pnum){
        if($("#showhide").val() == 6){
                if($("#hideshow").val() == id){
                        $(".show").remove();
                        $(".hidepage").remove();
                        $("#showhide").val(3);
                        return false;
                    }
                    else{
                            $(".hidepage").remove();
                        };
                 $(".show").remove();
            };
        }else{
            $(".show").remove();
            $("#pageTool .ui-paging-container:not(:first)").remove();
        };
    jzm.paraMessage('loadAjaxdata',{url:"manage_prodcut_list_list",xmldata:"&type=2&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)) +"&listId=" + id,callbackfn:function(reg){
        var str = "";
        RegCode(statusCode).test(reg.statusCode.status) ? void function(){
          str += '<div class="show">'+
                      '<p>产品ID</p>'+
                      '<p>产品名称</p>'+
                      '<p>产品价格</p>'+
                      '<p>使用配方</p>'+
                      '<p>料盒ID</p>'+
                      '<p>创建日期</p>'+
                      '<p>排序</p>'+
                  '</div>';
          for(var i = 0; i < reg.productShowList.length; i ++){
                  str += '<div class="show">'+
                              '<p>'+ reg.productShowList[i].productId +'</p>'+
                              '<p class='+ (reg.productShowList[i].machineType == 1 ? "machine-big-tip" : "machine-small-tip") +'>'+ reg.productShowList[i].productName +'</p>'+
                              '<p>'+ parseFloat((reg.productShowList[i].productPrice != null ? reg.productShowList[i].productPrice : 0) / 100).toFixed(2) +'</p>'+
                              '<p>'+ reg.productShowList[i].formulaName +'</p>'+
                              '<p>'+ reg.productShowList[i].bunkerNumber +'</p>'+
                              '<p>'+ jzm.getDateTime(reg.productShowList[i].createTime) +'</p>'+
                              '<p>'+ reg.productShowList[i].productRank +'</p>'+
                          '</div>';
              };
              if($("#showhide").val() != 6 || $("#hideshow").val() != id){
                      var str2 = '<div class="hidepage"><div class="col-sm-6"></div>'+
                              '<div id="pageTool" class="col-sm-6" style="height:35px;overflow:hidden;"></div>'+
                              '<input type="hidden" id="pageNums" value="'+ reg.pageCount * 20 +'" /></div>';
                      $("#led"+ id).after(str2);
                  };
          $("#led"+ id).append(str);
          $("#showhide").val(6);
          $("#hideshow").val(id);
      }() : (RegCode(isNullCode).test(reg.statusCode.status) ? $("#led"+ id).append(str) : jzm.Error(reg));
    },type:"POST",trcny:false});
};
jzm.AddDetaile = function (add)/*/清单名称添加/*/{
    if(!add){
            $("#editBoxAdd").fadeIn();
        }
    else{
            jzm.paraMessage('loadAjaxdata',{url:"manage_prodcut_list_list",xmldata:"&type=6&name=" + $("#detaName").val() +"&machineType=" +$('input[name="machineType"]:checked').val(),callbackfn:function(reg){
              RegCode(statusCode).test(reg.statusCode.status) ? void function(){
                $("#editBoxAdd").fadeOut(100);
                $("#detaName").val('')
                jzm.detailedList();
              }() : jzm.Error(reg);
            },type:"POST",trcny:true});
        };
};
jzm.detailedEnit = function (id)      /*/清单数据编辑/*/{
  if(id){
    $("#editBoxEnit").fadeIn(100);
    $(".showBox").show();
    jzm.paraMessage('loadAjaxdata',{url:"manage_prodcut_list_list",xmldata:"&type=3&listId=" + id,callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        var str = "";
        str += '<li class="showlog"><p>产品ID</p><p>产品名称</p><p>产品价格</p><p>产品图片</p><p>使用配方</p><p>创建日期</p><p>操作</p></li>';
            for(var i = 0; i < reg.productInfoList.length; i ++){
                    str += '<li class="showlog"><p>'+ reg.productInfoList[i].productId +'</p><p class='+ (reg.productInfoList[i].machineType == 1 ? "machine-big-tip" : "machine-small-tip") +' >'+ reg.productInfoList[i].productName +'</p><p>'+ parseFloat((reg.productInfoList[i].productPrice != null ? reg.productInfoList[i].productPrice : 0) / 100).toFixed(2) +'</p><p><img style="width:27px;height:17px;" src="'+ reg.productInfoList[i].productPicurl +'" alt="" /></p><p>'+ reg.productInfoList[i].formulaName +'</p><p>'+ jzm.getDateTime(reg.productInfoList[i].createTime) +'</p>';
                    str += '<p>添加<input style="opacity:1;" type="checkbox" name="productId" id="productId'+ i +'" value="'+ reg.productInfoList[i].productId +'" /></p>';
                    str += '</div>';
                };
            $("#showlog").html(str);
            $("#listId").val(id);
            var pid = $("#productIdList").val(reg.productIdList);
            var produist = $("input[name='productId']");
            if(reg.productIdList){
              var pids = $("#productIdList").val().split(',');
              for(var o = 0; o < pids.length; o ++){
                  for(var p = 0; p < produist.length; p ++){
                      if(pids[o] == produist[p].value){
                          $("#productId"+ p).attr("checked",true);
                        };
                      };
                  };
                };
        str = "";
        str += '<li class="showlog"><p>产品ID</p><p>产品名称</p><p>产品价格</p><p>产品图片</p><p>使用配方</p><p>创建日期</p><p>操作</p></li>';
            for(var i = 0; i < reg.productInfoList.length; i ++)
                {
                    str += '<li class="showlog"><p>'+ reg.productInfoList[i].productId +'</p><p class='+ (reg.productInfoList[i].machineType == 1 ? "machine-big-tip" : "machine-small-tip") +'>'+ reg.productInfoList[i].productName +'</p><p>'+ parseFloat((reg.productInfoList[i].productPrice != null ? reg.productInfoList[i].productPrice : 0) / 100).toFixed(2) +'</p><p><img style="width:27px;height:17px;" src="'+ reg.productInfoList[i].productPicurl +'" alt="" /></p><p>'+ reg.productInfoList[i].formulaName +'</p><p>'+ jzm.getDateTime(reg.productInfoList[i].createTime) +'</p>';
                    str += '<p>添加<input style="opacity:1;" type="checkbox" name="productId" id="productId'+ i +'" value="'+ reg.productInfoList[i].productId +'" /></p>';
                    str += '</li>';
                };
            $("#showlog").html(str);
            $("#listId").val(id);
            var pid = $("#productIdList").val(reg.productIdList);
            var produist = $("input[name='productId']");
            if(reg.productIdList){
                var pids = $("#productIdList").val().split(',');
                for(var o = 0; o < pids.length; o ++){
                    for(var p = 0; p < produist.length; p ++){
                        if(pids[o] == produist[p].value){
                              $("#productId"+ p).attr("checked",true);
                            };
                        };
                    };
                };
            }()  : jzm.Error(reg);
          },type:"POST",trcny:false});
      }
  else{
        jzm.paraMessage('loadAjaxdata',{url:"manage_prodcut_list_list",xmldata:"&type=4&"+ $("#equForm").serialize() +"&listId=" + $("#listId").val(),callbackfn:function(reg){
          RegCode(statusCode).test(reg.statusCode.status) ? window.location.reload() : jzm.Error(reg);
        },type:"POST",trcny:false});
      };
};
jzm.deleDetailed = function(id)      /*/清单删除/*/{
    var del = confirm("是否删除？");
    if(del == true){
      jzm.paraMessage('loadAjaxdata',{url:"manage_prodcut_list_list",xmldata:"&type=5&listId=" + id,callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? jzm.detailedList() : jzm.Error(reg);
      },type:"POST",trcny:true});
  };
};
jzm.detailedBindingShop = function()      /*/清单 前商户搜索/*/{
    jzm.paraMessage('loadAjaxdata',{url:"manage_machine_product_relation",xmldata:"&type=2",callbackfn:function(reg){
      var str = "",_type;
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        for(var i = 0; i < reg.userList.length; i++){
                str = str + '<option value=&adminId='+ reg.userList[i].adminId +'>'+ reg.userList[i].adminName +'</option>';
            };
            $("select[name='detailed-shop']").html(str).multiselect({
		          setMaxStrLength:100,
		          setWidth:'30%',
		          multiple:false,
		          selectedHtmlValue:'请选择商户',
		          callbackfn:function(e){
		          	e = $('.shop span').attr('data-machine');
		          	jzm.detailedBindingShebei(e);
		          }
		        });
      }() :(RegCode(isNullCode).test(reg.statusCode.status) ? $("#showhu").html("无") : jzm.Error(reg) );
  },type:"POST",trcny:true});
};
jzm.detailedBindingShebei = function(e)      /*/清单 前商户的设备搜索/*/{
	var type = $('.newSelectTitle span').attr('data-machine');
	type && type.split('=')[0] != "&adminId" ? type = type.substr(type.lastIndexOf('=') + 1, type.length) : type = '';
    jzm.paraMessage('loadAjaxdata',{url:"manage_machine_product_relation",xmldata:"&type=3&adminId=" + e.split('=')[1] +"&machineType=" + type,callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? void function(_type = []){
        for(var i = 0; i < reg.machineNumberList.length; i++)
            {
                e = e + '<option value='+ reg.machineNumberList[i].machineNumber+'>设备编号：'+ reg.machineNumberList[i].machineNumber +'---当前清单：' +reg.machineNumberList[i].listName +'</option>';
                _type.push(reg.machineNumberList[i].machineType);
            };
            return _type;
      }() : (RegCode(isNullCode).test(reg.statusCode.status) ? e = '<option value=-1>暂无设备</option>' : jzm.Error(reg) );
      $("select[name='machineNumber']").html(e).multiselect({
          setMaxStrLength:100,
          setWidth:'30%',
          selectedHtmlValue:'请选择设备',
          __type:window._type,
          callbackfn:function(e){
          	//待优化 正则表达式
          }
        });
   },type:"POST",trcny:true});
};

jzm.detailedBindingDeta = function()          /*/清单绑定 指定清单搜索/*/{
    jzm.paraMessage('loadAjaxdata',{url:"manage_machine_product_relation",xmldata:"&type=1",callbackfn:function(reg){
      var str = "",_type = [];
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        for(var i = 0; i < reg.productListList.length; i++){
                str += '<option value=&listId='+ reg.productListList[i].listId +'&machineType='+ reg.productListList[i].machineType +'>'+ reg.productListList[i].listName +'</option>';
                _type.push(reg.productListList[i].machineType);
            };
        $("select[name='detailed-list']").html(str).multiselect({
          setMaxStrLength:100,
          setWidth:'30%',
          multiple:false,
          selectedHtmlValue:'请选择清单',
          __type:_type,
          callbackfn:function(e){
          	jzm.detailedBindingShop();
          }
        });
      }() : ( RegCode(isNullCode).test(reg.statusCode.status) ? $("#showhuDeta").html("无") : jzm.Error(reg) );
  },type:"POST",trcny:true});
};
jzm.detailedBinding = function(e)      /*/清单绑定/*/{
	$(".newSelectTitle span").each(function(){
		e = (!e ? '' : e) + $(this).attr('data-machine');
	});
    jzm.paraMessage('loadAjaxdata',{url:"manage_machine_product_relation",xmldata:"&type=4" + e.replace('undefined','') +"&machineNumber=" + $('.last-machinenumber').html().match(/：\d+(\d*)(?=-)/g).toString().replace(/：/g,''),callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = './detailedList.html' : jzm.Error(reg);
    },type:"POST",trcny:true});
};
jzm.detailedUnBinding = function()      /*/清单解绑/*/{
    jzm.paraMessage('loadAjaxdata',{url:"manage_machine_product_relation",xmldata:"&type=5&machineNumber=" + $('.last-machinenumber').html().match(/：\d+(\d*)(?=-)/g).toString().replace(/：/g,'') + $('.newSelectTitle span').attr('data-machine'),callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = './detailedList.html' : jzm.Error(reg);
    },type:"POST",trcny:true});
};
//**************ui action*******************
jzm.machine_btn = function(){
	$('#machineType').val() != 1 ? ~function(){$(".offFormulaMakeList").show();$(".formulaMakeList").hide()}() : ~function(){$(".formulaMakeList").show();$(".offFormulaMakeList").hide()}();
}
//*********************************************
