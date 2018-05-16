/*
* @Author: anchen
* @Date:   2018-01-30 17:41:24
* @Last Modified by:   anchen
* @Last Modified time: 2018-03-01 19:11:04
*/
// **************************广告************************************
jzm.findAdvertisementList = function (page)     /*/网页广告列表/*/{ //page is null
    jzm.paraMessage('loadAjaxdata',{url:"find_advertisement_list",xmldata:"&type=1&name=" + $("#name").val(),callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        for(var i = 0; i < reg.advertisementList.length; i ++){
          str += '<tr>'+
                      '<td>'+ reg.advertisementList[i].adId +'</td>'+
                      '<td>'+ reg.advertisementList[i].adTitle +'</td>'+
                      '<td>'+ reg.advertisementList[i].adUrl +'</td>'+
                      '<td>'+ jzm.getDateTime(reg.advertisementList[i].adTime) +'</td>'+
                      '<td>'+ reg.advertisementList[i].adOrder +'</td>'+
                      '<td>'+
                          '<a href="advertisementH5Enit.html?uri=/manage/advertisementH5List.html&v='+ jzm.randomNum() +'&advsement='+ reg.advertisementList[i].adId +'">编辑  |</a>'+
                          '<a href="javascript:void(0);" onclick=jzm.deelAdvment('+ reg.advertisementList[i].adId +',"manage_advertisement","findAdvertisementList")>     删除</a>'+
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
    },type:"POST",trcny:true});
};
jzm.deelAdvment = function(i,u,e)  /*/删除广告--H5网页广告，机器视频广告/*/{   //i = ID, u = URL, e = type
    var adv = confirm("是否删除广告？"),advx;
    if (adv == true){
        e != "findAdvertisementList" ? advx = "madId=" + i : advx = "adId=" + i;
        jzm.paraMessage('loadAjaxdata',{url:u,xmldata:"&type=2&"+ advx,callbackfn:function(reg){
          RegCode(statusCode).test(reg.statusCode.status) ? jzm.paraMessage(e) : jzm.Error(reg);    //网页广告 //机器视频广告
      },type:"POST",trcny:true});
    };
};
jzm.AddAdvment = function()  /*/添加网页广告/*/{
  jzm.paraMessage('loadAjaxdata',{url:"manage_advertisement",xmldata:"&type=3&" + $("#advInfo").serialize(),callbackfn:function(reg){
    RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = jzm.getQueryString('uri') : jzm.Error(reg);
  },type:"POST",trcny:true});
};
jzm.EnitAdvment = function(show)  /*/编辑网页广告/*/{
    if(show){
      jzm.paraMessage('loadAjaxdata',{url:"manage_advertisement",xmldata:"&type=4&"+ $("#advInfo").serialize() +"&adId="+ jzm.getQueryString("advsement"),callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = jzm.getQueryString('uri') : jzm.Error(reg);
      },type:"POST",trcny:true});
  }else{
      jzm.paraMessage('loadAjaxdata',{url:"manage_advertisement",xmldata:"&type=1&adId=" + jzm.getQueryString("advsement"),callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? void function(){
          $("#adTitle").val(reg.advertisementInfo.adTitle);
          $("#adUrl").val(reg.advertisementInfo.adUrl);
          $("#adOrder").val(reg.advertisementInfo.adOrder);
          $("#adShowUrl").val(reg.advertisementInfo.adShowUrl);
          $("#adShowUrl_img").attr("src",reg.advertisementInfo.adShowUrl);
        }() : jzm.Error(reg);
      },type:"POST",trcny:true});
    };
};
jzm.findMachineAdvertisementList = function(seroot)     /*/机器广告列表/*/{
  jzm.paraMessage('loadAjaxdata',{url:"find_machine_advertisement_list",xmldata:"&type=1&name=" + $("#name").val(),callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      for(var i = 0; i < reg.machineAdvertisementList.length; i ++){
        str += '<tr>'+
                    '<td>'+ reg.machineAdvertisementList[i].madId +'</td>'+
                    '<td>'+ reg.machineAdvertisementList[i].madTitle +'</td>'+
                    '<td><a target="_break" href="'+ reg.machineAdvertisementList[i].madUrl +'">'+ reg.machineAdvertisementList[i].madUrl +'</a></td>'+
                    '<td>'+ (reg.machineAdvertisementList[i].madStatus == 0 ? "下架" : "上架") +'</td>'+
                    '<td>'+ jzm.getDateTime(reg.machineAdvertisementList[i].madTime) +'</td>'+
                    '<td>'+ reg.machineAdvertisementList[i].madOrder +'</td>'+
                    '<td>'+
                        '<a href="advertisementRootEnit.html?uri=/manage/advertisementRootList.html&v='+ jzm.randomNum() +'&Advsement='+ reg.machineAdvertisementList[i].madId +'">编辑  |</a>'+
                        '<a href="javascript:void(0)" onclick="jzm.AddmanageMachineAdvertisement('+ reg.machineAdvertisementList[i].madId +','+ (reg.machineAdvertisementList[i].madStatus == 1 ? 0 : 1) +')">'+(reg.machineAdvertisementList[i].madStatus == 1 ? "下架" : "上架")+'   |</a>'+
                        '<a href="javascript:void(0);" onclick=jzm.deelAdvment('+ reg.machineAdvertisementList[i].madId +',"manage_machine_advertisement","findMachineAdvertisementList")>     删除</a>'+
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
  },type:"POST",trcny:true});
};
jzm.AddmanageMachineAdvertisement = function(Id,state)    /*/添加视频广告/视频上下架/*/{
  if(!Id){
    if($("#madUrl").val() == ""){
            alert("请等待上传完成！");
            return false;
        };
    jzm.paraMessage('loadAjaxdata',{url:"manage_machine_advertisement",xmldata:"&type=3&" + $("#macInfo").serialize(),callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = jzm.getQueryString('uri') : jzm.Error(reg);
    },type:"POST",trcny:true});
  }else{
      var shelves = confirm("是否更改状态？");
      if(shelves == true){
        jzm.paraMessage('loadAjaxdata',{url:"manage_machine_advertisement",xmldata:"&type=5&madStatus=" + state +"&madId=" + Id,callbackfn:function(reg){
          RegCode(statusCode).test(reg.statusCode.status) ? jzm.findMachineAdvertisementList() : jzm.Error(reg);
        },type:"POST",trcny:true});
      };
    };
};
jzm.EnitmanageMachineAdvertisement = function(show)  /*/编辑视频广告/*/{
  if(show){
    if($("#madUrl").val() == $("#key").val()){ $("#key").removeAttr('name');};
    jzm.paraMessage('loadAjaxdata',{url:"manage_machine_advertisement",xmldata:"&type=4&"+$("#macInfo").serialize()+"&madId="+ jzm.getQueryString("Advsement"),callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = jzm.getQueryString('uri') : jzm.Error(reg);
    },type:"POST",trcny:true});
  }else{
    jzm.paraMessage('loadAjaxdata',{url:"manage_machine_advertisement",xmldata:"&type=1&madId=" + jzm.getQueryString("Advsement"),callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        var url = reg.machineAdvertisementInfo.madUrl;
        $("#madTitle").val(reg.machineAdvertisementInfo.madTitle);
        $("#madOrder").val(reg.machineAdvertisementInfo.madOrder);
        $("#madUrl").val(url);
        $("#madUrl_video").attr('src',url);
        jzm.createImages({file:'',node:'#madUrl_img',type:url});
      }() : jzm.Error(reg);
    },type:"POST",trcny:true});
  };
};
// ********************************视频广告清单列表***************************************************
jzm.advdetailedList = function(deta,page)     /*/视频广告清单列表/*/{
    jzm.paraMessage('loadAjaxdata',{url:"manage_advertisement_list_list",xmldata:"&type=1&page=" + (page ? page : page = 1) + "&name=" + $("#name").val(),callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        str += '<div>'+
                    '<span>清单ID</span>'+
                    '<span>清单名称</span>'+
                    '<span>操作</span>'+
                '</div>';
        for(var i = 0; i < reg.advertisementListList.length; i ++)
            {
                str += '<div class="ledShow" id="led'+ reg.advertisementListList[i].listId +'"><span>'+ reg.advertisementListList[i].listId +'</span>'+
                        '<span>'+ reg.advertisementListList[i].listName +'</span>'+
                        '<span>'+
                            '<a href="javascript:void(0);" onclick="jzm.msgDetailedList('+ reg.advertisementListList[i].listId +')">清单详情  |</a>'+
                            '<a href="javascript:void(0)" onclick="jzm.detailedEnit('+ reg.advertisementListList[i].listId +')">编辑  |</a>';
                if(i != 0 && i != 1)
                    {
                        str += '<a href="javascript:void(0);" onclick="jzm.deleDetailed('+ reg.advertisementListList[i].listId +')">     删除</a>';
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
      }() : jzm.Error(reg) );
    },type:"POST",trcny:false});
};
jzm.msgDetailedList = function(id,page,pnum)  /*/视频广告清单详情/*/{
    if(!pnum){
      if($("#showhide").val() == 6){
        if($("#hideshow").val() == id){
          $(".show").remove();
          $(".hidepage").remove();
          $("#showhide").val(3);
          return false;
        }else{
          $(".hidepage").remove();
        };
        $(".show").remove();
      };
  }else{
      $(".show").remove();
      $("#pageTool .ui-paging-container:not(:first)").remove();
    };
    jzm.paraMessage('loadAjaxdata',{url:"manage_advertisement_list_list",xmldata:"&type=2&page=" + (page ? page : page = 1 ) +"&listId=" + id,callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        str += '<div class="show">'+
                    '<p>广告ID</p>'+
                    '<p>广告名称</p>'+
                    '<p>视频地址</p>'+
                    '<p>排序</p>'+
                    '<p>状态</p>'+
                    '<p>创建日期</p>'+
                    '<p>类型</p>'+
                '</div>';
        for(var i = 0; i < reg.advertisementList.length; i ++){
          str += '<div class="show">'+
                      '<p>'+ reg.advertisementList[i].madId +'</p>'+
                      '<p>'+ reg.advertisementList[i].madTitle +'</p>'+
                      '<p><a href="'+ reg.advertisementList[i].madUrl +'" target="_blank">'+ reg.advertisementList[i].madUrl +'</a></p>'+
                      '<p>'+ reg.advertisementList[i].madOrder +'</p>'+
                      '<p>'+ (reg.advertisementList[i].madStatus == 1 ? "上架" : "下架") +'</p>'+
                      '<p>'+ jzm.getDateTime(reg.advertisementList[i].madTime) +'</p>'+
                      '<p>'+ (reg.advertisementList[i].madType == 2 ? "机器端" : "网页端") +'</p>'+
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
      }() : (RegCode(isNullCode).test(reg.statusCode.status) ? $("#led"+ id).append(str) : jzm.Error(reg) );
    },type:"POST",trcny:false});
};
jzm.AddDetaile = function(add)      /*/视频广告清单添加/*/{
  if(!add){$("#editBoxAdd").show(100);}
  else{
    jzm.paraMessage('loadAjaxdata',{url:"manage_advertisement_list_list",xmldata:"&type=6&name=" + $("#detaName").val(),callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        jzm.moduleBox();
        jzm.advdetailedList();
      }() : jzm.Error(reg);
    },type:"POST",trcny:true});
  };
};
jzm.detailedEnit = function(id)/*/视频广告清单编辑equForm/*/{
  if(id){
    $("#editBoxEnit").fadeIn(100);
    $(".showBox").show();
    jzm.paraMessage('loadAjaxdata',{url:"manage_advertisement_list_list",xmldata:"&type=3&listId=" + id,callbackfn:function(reg){
        var str = "";
        str += '<div class="showlog"><p>广告ID</p><p>广告名称</p><p>视频地址</p><p>排序</p><p>状态</p><p>创建日期</p><p>操作</p></div>';
        RegCode(statusCode).test(reg.statusCode.status) ? void function(){
          for(var i = 0; i < reg.advertisementInfoList.length; i ++){
            str += '<div class="showlog"><p>'+ reg.advertisementInfoList[i].madId +'</p><p>'+ reg.advertisementInfoList[i].madTitle +'</p><p>'+ reg.advertisementInfoList[i].madUrl  +'</p><p>'+ reg.advertisementInfoList[i].madOrder +'</p><p>'+ reg.advertisementInfoList[i].madStatus +'</p><p>'+ jzm.getDateTime(reg.advertisementInfoList[i].madTime) +'</p>';
            str += '<p>添加<input style="opacity:1;" type="checkbox" name="adId" id="adId'+ i +'" value="'+ reg.advertisementInfoList[i].madId +'" /></p>';
            str += '</div>';
          };
          $("#showlog").html(str);
          $("#listId").val(id);
          var pid = $("#productIdList").val(reg.adIdList);
          var produist = $("input[name='adId']");
          console.log(produist.length);
          if(reg.adIdList){
            var pids = ($("#productIdList").val().split(',') == undefined ? [$("#productIdList").val()] : $("#productIdList").val().split(','));
            for(var o = 0; o < pids.length; o ++){
                for(var p = 0; p < produist.length; p ++){
                  if(pids[o] == produist[p].value){
                      $("#adId"+ p).attr("checked",true);
                  };
                };
              };
            };
        }() : jzm.Error(reg);
      },type:"POST",trcny:false});
    }else{
      jzm.paraMessage('loadAjaxdata',{url:"manage_advertisement_list_list",xmldata:"&type=4&" + $("#equForm").serialize(),callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? void function(){
          $("#editBoxEnit").fadeOut(100);
          $(".showBox").hide();
        }() : jzm.Error(reg);
      },type:"POST",trcny:false});
    };
};
jzm.deleDetailed = function(id)      /*/视频广告清单删除/*/{
  var del = confirm("是否删除？");
  if(del == true){
    jzm.paraMessage('loadAjaxdata',{url:"manage_advertisement_list_list",xmldata:"&type=5&listId=" + id,callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? jzm.advdetailedList() : jzm.Error(reg);
    },type:"POST",trcny:true});
  };
};
jzm.detailedBindingShop = function(e)      /*/视频广告清单 前商户搜索/*/{
    jzm.paraMessage('loadAjaxdata',{url:"manage_advertisement_list_relation",xmldata:"&type=2&name=" + $("#usshanghu").val(),callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        for(var i = 0; i < reg.userList.length; i++){
            str += '<input type="checkbox" style="opacity:1;" name="adminId" id="rio'+ i +'" value="'+ reg.userList[i].adminId +'" /><label for="rio'+ i +'" style="cursor:pointer;margin:1px 0;" class="block-title equid_'+ reg.userList[i].adminId +'"><span style="width:150px;display:inline-block;">'+ reg.userList[i].adminName +'</span><span style="margin-left:30px;">当前绑定商户：'+ reg.userList[i].listName +'</span></label> <br />';
          };
          $("#showhu").html(str);
      }() : ( RegCode(isNullCode).test(reg.statusCode.status) ? $("#showhu").html('无') : jzm.Error(reg) );
    },type:"POST",trcny:true});
};
jzm.detailedBindingDeta = function()    /*/视频广告清单绑定 指定清单搜索/*/{
    jzm.paraMessage('loadAjaxdata',{url:"manage_advertisement_list_relation",xmldata:"&type=1&name=" + $("#usshanghuDeta").val(),callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        for(var i = 0; i < reg.advertisementListList.length; i++){
          str += '<input type="radio" style="opacity:1;" name="listId" id="listId'+ i +'" value="'+ reg.advertisementListList[i].listId +'" /><label for="listId'+ i +'" style="cursor:pointer;margin:1px 0;width:180px;" class="block-title equid_'+ reg.advertisementListList[i].listId +'">'+ reg.advertisementListList[i].listName +'</label> <br />';
        };
        $("#showhuDeta").html(str);
      }() : ( RegCode(isNullCode).test(reg.statusCode.status) ? $("#showhuDeta").html(str) : jzm.Error(reg) );
    },type:"POST",trcny:true});
};
jzm.detailedBinding = function()      /*/视频广告清单绑定/*/{
  jzm.paraMessage('loadAjaxdata',{url:"manage_advertisement_list_relation",xmldata:"&type=3&" + $("#dateForm").serialize(),callbackfn:function(reg){
    RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = jzm.getQueryString('uri') : jzm.Error(reg);
  },type:"POST",trcny:true});
};
jzm.detailedUnBinding = function()      /*/视频广告清单解绑/*/{
  jzm.paraMessage('loadAjaxdata',{url:"manage_advertisement_list_relation",xmldata:"&type=4&" + $("#dateForm").serialize(),callbackfn:function(reg){
    RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = jzm.getQueryString('uri') : jzm.Error(reg);
  },type:"POST",trcny:true});
};

// *-******************普通用户列表************************************
jzm.findVipUser = function() /*/查找用户等级/*/{
  jzm.paraMessage('loadAjaxdata',{url:"find_client_user_list",xmldata:"&type=1",callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function (){
      str += '<div class="block-title" style="font-size:12px;width:87px;text-align:center;margin-right:10px;">会员等级</div><span class="block-title spanaction" data-unity="memberLevel, ,findClientUserList" style="font-size:12px;cursor:pointer;padding: 3px 12px;margin-right:3px;">不限</span>';
      for(var i = 0; i < reg.memberRuleList.length; i ++)
          {
              str += '<span class="block-title spannoaction" data-unity="memberLevel,'+ reg.memberRuleList[i].memberLevelId +',findClientUserList" style="font-size:12px;padding: 3px 12px;margin-right:3px;cursor:pointer;">'+ reg.memberRuleList[i].memberLevelName +'</span>';
          };
      $("#mylv").html(str);
    }() : jzm.Error(reg);
  },type:"POST",trcny:true});
};
jzm.findClientUserList = function(page)  /*/用户列表/*/{
    var el = "",xl = "",search = "";
    if(localStorage.getItem('stat')){
      el = JSON.parse(localStorage.getItem('stat')).orderLine;
      xl = JSON.parse(localStorage.getItem('stat')).sort;
      search += "&orderLine="+ el +"&sort="+ xl;
    };
    jzm.paraMessage('loadAjaxdata',{url:"find_client_user_list",xmldata:"&type=2&page="+ (page ? page : page = 1) + search + "&memberLevel=" + $("#memberLevel").val() + "&name=" + $("#userName").val() +"&userType=" + $("#userType").val(),callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        for(var i = 0; i < reg.clientUserList.length; i ++){
          str += '<tr>'+
                      '<td>'+ reg.clientUserList[i].userId +'</td>'+
                      '<td>'+ reg.clientUserList[i].nickName +'</td>'+
                      '<td>'+ reg.clientUserList[i].mobile +'</td>'+
                      '<td>'+ reg.clientUserList[i].userType +'</td>'+
                      '<td>'+ reg.clientUserList[i].memberLevelName +'</td>'+
                      '<td>'+ reg.clientUserList[i].userStatus +'</td>'+
                      '<td>'+ jzm.getDateTime(reg.clientUserList[i].registerTime) +'</td>'+
                      '<td>'+ parseFloat((reg.clientUserList[i].sumPaymentMoney != null ? reg.clientUserList[i].sumPaymentMoney : 0) / 100).toFixed(2) +'</td>'+
                      '<td>'+
                          '<a href="systemUserEnit.html?uri=/manage/systemUserList.html&v='+ jzm.randomNum() +'&uid='+ reg.clientUserList[i].userId +'">编辑  |</a>'+
                          '<a href="###" onclick="jzm.manageclientuser('+ reg.clientUserList[i].userId +')">'+(reg.clientUserList[i].userStatus =="冻结" ? "激活" : "冻结")+'</a>'+
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
    $("#HrefPath").click(function(e){
      $.ajax({
          url: httpJoin + 'find_client_user_list',
          type: 'POST',
          dataType: 'json',
          data: {id:jzm.uncompileStr(item.uname),token:jzm.uncompileStr(item.utoken),type:3,url:localURL +"systemUserList.html"}
      })
      .done(function(reg) {
        RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = httpJoin + reg.path : jzm.Error(reg);
      })
    });
};
jzm.manageClientUser = function(u)     /*/查询用户信息、编辑用户/*/{
  if(u){
      $("input[name='balance']").val($("#balance").val() * 100);
      $("input[name='integral']").val($("#integral").val() * 100);
      $("input[name='nickName']").val($("#nickName").val());
      jzm.paraMessage('loadAjaxdata',{url:"manage_client_user",xmldata:"&type=2&"+ $("#uList").serialize() +"&userId="+ jzm.getQueryString("uid"),callbackfn:function(reg){
        RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = jzm.getQueryString('uri') : jzm.Error(reg);
      },type:"POST",trcny:false});
  }else{
      jzm.paraMessage('loadAjaxdata',{url:"manage_client_user",xmldata:"&type=1&userId=" + jzm.getQueryString("uid"),callbackfn:function(reg){
        var str = "";
        RegCode(statusCode).test(reg.statusCode.status) ? void function(){
          $("#userId").val(reg.clientUser.userId);
          $("#nickName").val(reg.clientUser.nickName);
          $("#balance").val(parseFloat((reg.clientUser.balance != null ? reg.clientUser.balance : 0) / 100).toFixed(2));
          $("#integral").val(parseFloat((reg.clientUser.integral != null ? reg.clientUser.integral : 0) / 100).toFixed(2));
          $("#memberLevel").val(reg.clientUser.memberLevel);
          $("#userType").val(reg.clientUser.userType);
          for(var i = 0; i < reg.memberRuleList.length; i++){
              if (reg.clientUser.memberLevel == reg.memberRuleList[i].memberLevelId){
                str += '<option value ="'+ reg.memberRuleList[i].memberLevelId +'" >'+ reg.memberRuleList[i].memberLevelName +'</option>';
              };
            };
          for(var i = 0; i < reg.memberRuleList.length; i++){
              if (reg.clientUser.memberLevel != reg.memberRuleList[i].memberLevelId){
                str += '<option value ="'+ reg.memberRuleList[i].memberLevelId +'" >'+ reg.memberRuleList[i].memberLevelName +'</option>';
              };
            };
          $("#memberLevel").html(str);
        }() : jzm.Error(reg);
      },type:"POST",trcny:true});
    };
};
jzm.manageMemberLevel = function()    /*/会员等级管理列表/*/{
  jzm.paraMessage('loadAjaxdata',{url:"manage_member_level",xmldata:"&type=1",callbackfn:function(reg){
    var str = "";
    RegCode(statusCode).test(reg.statusCode.status) ? void function(){
      for(var i = 0; i < reg.memberRuleList.length; i ++){
          str += '<tr>'+
                      '<td>'+ reg.memberRuleList[i].memberLevelName +'</td>'+
                      '<td>'+ parseFloat((reg.memberRuleList[i].countMoney != null ? reg.memberRuleList[i].countMoney : 0) / 100).toFixed(2) +'</td>'+
                      '<td>'+ parseFloat((reg.memberRuleList[i].disposableRecharge != null ? reg.memberRuleList[i].disposableRecharge : 0) / 100).toFixed(2) +'</td>'+
                      '<td>'+ reg.memberRuleList[i].integralDouble +'</td>'+
                      '<td>'+ reg.memberRuleList[i].memberLevel +'</td>'+
                      '<td>'+
                          '<a href="systemUserLvEnit.html?uri=/manage/systemUserLvList.html&v='+ jzm.randomNum() +'&lvUserid='+ reg.memberRuleList[i].memberLevelId +'">编辑  </a>'+
                      '</td>'+
                  '</tr>';
          };
      $("#tbodyhtml").html(str);
   }() : ( RegCode(isNullCode).test(reg.statusCode.status) ? $("#tbodyhtml").html(str) : jzm.Error(reg) );
 },type:"POST",trcny:true});
};
jzm.EnitmanageMemberLevel = function(lv)    /*/会员等级管理查询、编辑/*/{
  if (lv){
    $("input[name='countMoney']").val($("#countMoney").val() * 100);
    $("input[name='disposableRecharge']").val($("#disposableRecharge").val() * 100);
    jzm.paraMessage('loadAjaxdata',{url:"manage_member_level",xmldata:"&type=2&"+ $("#AddUser").serialize() +"&memberLevelId=" + jzm.getQueryString("lvUserid"),callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? window.location.href = jzm.getQueryString('uri') : jzm.Error(reg);
    },type:"POST",trcny:true});
  }else{
    jzm.paraMessage('loadAjaxdata',{url:"manage_member_level",xmldata:"&type=3&memberLevelId=" + jzm.getQueryString("lvUserid"),callbackfn:function(reg){
      var str = "";
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        $("#memberLevelName").val(reg.memberRule.memberLevelName);
        $("#memberLevel").val(reg.memberRule.memberLevel);
        $("#countMoney").val(parseFloat((reg.memberRule.countMoney != null ? reg.memberRule.countMoney : 0) / 100).toFixed(2));
        $("#disposableRecharge").val(parseFloat((reg.memberRule.disposableRecharge != null ? reg.memberRule.disposableRecharge : 0) / 100).toFixed(2));
        $("#integralDouble").val(reg.memberRule.integralDouble);
        $("#integralDouble").val(reg.memberRule.integralDouble);
      }() : jzm.Error(reg);
    },type:"POST",trcny:true});
  };
};
jzm.manageclientuser = function(id){
  var perpol = confirm("是否改变该用户状态？");
  if(perpol == true){
    jzm.paraMessage('loadAjaxdata',{url:"manage_client_user",xmldata:"&type=3&userId="+ id,callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? jzm.findClientUserList() : jzm.Error(reg);
    },type:"POST",trcny:false});
  }
}
