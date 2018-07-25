//用户统计  收入数据-充值次数-充值人数
jzm.userCharts = function(id,time){
    var yName,cName,tName,calendar,timeLoad = []/*/x轴 数据/*/;
    if(!id){id=1;yName = '￥{value}';cName = '金额';tName = '收入金额';$(".opMoney").show();}
    else if(id == 1){$(".boxCharts").children('p').eq(0).addClass('active').siblings('p').removeClass('active');yName = '￥{value}';cName = '金额';tName = '收入金额';$(".opMoney").show();}
    else if(id == 2){$(".boxCharts").children('p').eq(1).addClass('active').siblings('p').removeClass('active');yName = '{value}';cName = '次数';tName = '充值次数';$(".opMoney").hide();}
    else if(id == 3){$(".boxCharts").children('p').eq(2).addClass('active').siblings('p').removeClass('active');yName = '{value}';cName = '人数';tName = '充值人数';$(".opMoney").hide();};
    if(time == 0){
    	$(".newtime").children('p').eq(0).addClass('active').siblings('p').removeClass('active');
    	timeLoad = dateLog(7);
    	$("#startTime").val(timeLoad[0]);$("#endTime").val(jzm.getDateTime(new Date()).split(' ')[0]);
    }else if(time == 1){
    	$(".newtime").children('p').eq(1).addClass('active').siblings('p').removeClass('active');
    	timeLoad = dateLog(jzm.mGetDate());
    	$("#startTime").val(timeLoad[0]);$("#endTime").val(jzm.getDateTime(new Date()).split(' ')[0]);
    }else if(time == 2){
    	$(".newtime").children('p').eq(2).addClass('active').siblings('p').removeClass('active');
    	timeLoad = dateLog(15);
    	$("#startTime").val(timeLoad[0]);$("#endTime").val(jzm.getDateTime(new Date()).split(' ')[0]);
    }else if(time == 3){
    	$(".newtime").children('p').eq(3).addClass('active').siblings('p').removeClass('active');
    	timeLoad = dateLog(1);
    	$("#startTime").val(timeLoad[0]);$("#endTime").val(jzm.getDateTime(new Date()).split(' ')[0]);
    }
    var usChart = echarts.init(document.getElementById('usCharts'));// 基于准备好的dom，初始化echarts实例
    var dateNum = [],/*/对应x轴数据描点/*/
    endTime = jzm.getDateTime(new Date()).split(' ')[0],        //结束日期
    d = new Date(),                                       //当前日期
    dtime = d.setDate(d.getDate() - 6),                     //当前日期前7天
    startTime = jzm.getDateTime(dtime).split(' ')[0];           //开始日期
    $("#typeId").val($(".boxCharts .active").attr("data-num"));
    if($("#startTime").val()){
        if(!$("#endTime").val()){$("#endTime").val(jzm.getDateTime(new Date()).split(' ')[0])};
        timeLoad = jzm.getAllDate($("#startTime").val(),$("#endTime").val());            //搜索日期区间
        startTime = $("#startTime").val();
        endTime = $("#endTime").val();
    }else{
            timeLoad = dateLog(7);                              //默认七天搜索
            $("#startTime").val(jzm.getDateTime(new Date().setDate(new Date().getDate() - 6)).split(' ')[0]);$("#endTime").val(jzm.getDateTime(new Date()).split(' ')[0]);
        };
    $.ajax({
        url: httpJoin + 'statistics_income',
        type: 'GET',
        dataType: 'json',
        async:false,
        data: {id:jzm.uncompileStr(item.uname),token:jzm.uncompileStr(item.utoken),type: $("#typeId").val(),startTime:startTime,endTime:endTime,url:window.location.pathname.split('?')[0]}
    })
    .done(function(reg) {
        $(".opMoney").text("总金额："+ reg.package.sum);
        for(var key in timeLoad){
            if(timeLoad[key] == jzm.countSubstr(timeLoad,jzm.moneyday(reg,timeLoad[key]))){
                dateNum.push(jzm.contentuser(reg,timeLoad[key],id));     //赋值
            }else{
               dateNum.push(0);     //赋值
            }
        };
        // 使用刚指定的配置项和数据显示图表。
        if(reg.statusCode.status == 6666){
            usChart.setOption({
                    title:{
                        text:tName,
                        textStyle: {
                            fontWeight: 'normal',              //标题颜色
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(1, 255, 255, 0.3)'
                            }
                        }
                    },
                    grid: {     //边距
                        left: '2%',
                        right: '4%',
                        bottom: '0%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: timeLoad,
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: yName
                        },
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    series: [
                        {
                            name: cName,
                            type:'line',
                            data:dateNum,
                            itemStyle:{
                                normal:{
                                    lineStyle:{     //设置颜色、大小
                                        color:'#fff',
                                        width:2
                                    }
                                }
                            },
                            areaStyle: {
                                normal: {//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(128,128,128,1)'
                                    }, {
                                        offset: .34,
                                        color: 'rgba(128,128,128,1)'
                                    },{
                                        offset: 1,
                                        color: 'rgba(128,128,128,1)'
                                    }])
                                }
                            }
                        }
                    ]
                }
                , true);
            }

    });
    function dateLog(calendar)  /*/x轴时间节点方法/*/{
        var dy = new Date();
        var dys = dy.setDate(dy.getDate() - calendar);
        for(var i = calendar; i > 0; i--){
            timeLoad.push(jzm.getDateTime(dy.setDate(dy.getDate() + 1)).split(' ')[0]);
          };
          return timeLoad;
    };
    jzm.userNumCharts();
};
//消费用户地区、渠道
jzm.userNumCharts = function(id){
    var usChart = echarts.init(document.getElementById('bar-addrchart'));// 基于准备好的dom，初始化echarts实例
    var usAddrChart = echarts.init(document.getElementById('bar-addrschart'));// 基于准备好的dom，初始化echarts实例
    var timeLoad = [],     //x轴 数据
    dateNum = [],       //对应x轴数据描点
    yName = [],         //y轴名称
    endTime = jzm.getDateTime(new Date()).split(' ')[0],        //结束日期
    d = new Date(),                                         //当前日期
    dtime = d.setDate(d.getDate() - 7),                     //当前日期前7天
    startTime = jzm.getDateTime(dtime).split(' ')[0];           //开始日期
    if($("#startTime").val()){
            if(!$("#endTime").val()){$("#endTime").val(jzm.getDateTime(new Date()).split(' ')[0])};
            timeLoad = jzm.getAllDate($("#startTime").val(),$("#endTime").val());            //搜索日期区间
            startTime = $("#startTime").val();
            endTime = $("#endTime").val();
      }else{
            timeLoad = dateLog();                              //默认七天搜索
            $("#startTime").val(jzm.getDateTime(new Date().setDate(new Date().getDate() - 6)).split(' ')[0]);$("#endTime").val(jzm.getDateTime(new Date()).split(' ')[0]);
        };
    $.ajax({
        url: httpJoin + 'statistics_user',
        type: 'GET',
        dataType: 'json',
        async:false,
        data: {id:jzm.uncompileStr(item.uname),token:jzm.uncompileStr(item.utoken),startTime:startTime,endTime:endTime,url: window.location.pathname.split('?')[0]}
    })
    .done(function(reg) {
        usChart.hideLoading();      //添加数据读取loading
        for(var i = 0; i < reg.package.areaContent.length; i++){
            dateNum.push(reg.package.areaContent[i].money);     //赋值
            yName.push(reg.package.areaContent[i].province);    //地区名称
        };
        // 使用刚指定的配置项和数据显示图表。
        if(reg.statusCode.status == 6666){
            usChart.setOption(          //异步数据获取填充
                {
                    title:{
                        text:'消费用户地区',
                        textStyle: {
                            fontWeight: 'normal',              //标题颜色
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(1, 255, 255, 0.3)'
                            }
                        }
                    },
                    grid: {     //边距
                        left: '2%',
                        right: '4%',
                        bottom: '0%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01],
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: yName,
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    series: [
                        {
                            name: '人数(个)',
                            type:'bar',
                            data: dateNum,
                            itemStyle:{
                                normal:{
                                    lineStyle:{     //设置颜色、大小
                                        color:'#fff',
                                        width:2
                                    }
                                }
                            },
                            itemStyle:{
                                normal:{
                                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                        offset: 0,
                                        color: 'rgba(128,128,128,0.8)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(128,128,128,0.8)'
                                    }])

                                }
                            },
                            barWidth:30  //固定bar的宽度
                        }
                    ]
                }
                , true);
                var arr = [],yarr = [];
                for(var i = 0; i < reg.package.userContent.length; i++){
                    arr.push(reg.package.userContent[i].userCount);     //赋值
                    yarr.push(reg.package.userContent[i].adminName);    //地区名称
                };
                usAddrChart.setOption(          //异步数据获取填充
                {
                    title:{
                        text:'商户人数总数',
                        textStyle: {
                            fontWeight: 'normal',              //标题颜色
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(1, 255, 255, 0.3)'
                            }
                        }
                    },
                    grid: {     //边距
                        left: '2%',
                        right: '4%',
                        bottom: '0%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01],
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: yarr,
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    series: [
                        {
                            name: '人数(个)',
                            type:'bar',
                            data: arr,
                            itemStyle:{
                                normal:{
                                    lineStyle:{     //设置颜色、大小
                                        color:'#fff',
                                        width:2
                                    }
                                }
                            },
                            itemStyle:{
                                normal:{
                                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                        offset: 0,
                                        color: 'rgba(128,128,128,0.8)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(128,128,128,0.8)'
                                    }])

                                }
                            },
                            barWidth:30  //固定bar的宽度
                        }
                    ]
                }
                , true);
            }

    });
    function dateLog()  /*/x轴时间节点方法/*/{
      for(var i = 6; i >= 0; i--){
        timeLoad.push(jzm.getDateTime(d.setDate(d.getDate() + 1)).split(' ')[0]);
      };
      return timeLoad;
    };
    jzm.userNewCharts();
};
//新增用户数量、新增用户地区、新增用户渠道
jzm.userNewCharts = function(id){
    var usNewChart = echarts.init(document.getElementById('usNewCharts'));// 基于准备好的dom，初始化echarts实例
    // var usAddrChart = echarts.init(document.getElementById('bar-addrschart'));// 基于准备好的dom，初始化echarts实例
    var timeLoad = [];      //x轴 数据
    var dateNum = [];       //对应x轴数据描点
    var dateWNum = [];    //总数
    var yName = [];         //y轴名称
    var endTime = jzm.getDateTime(new Date()).split(' ')[0];        //结束日期
    var d = new Date();                                         //当前日期
    var dtime = d.setDate(d.getDate() - 7);                     //当前日期前7天
    var startTime = jzm.getDateTime(dtime).split(' ')[0];           //开始日期
    if($("#newstartTime").val()){
        if(!$("#newendTime").val()){$("#newendTime").val(jzm.getDateTime(new Date()).split(' ')[0])};
        timeLoad = jzm.getAllDate($("#newstartTime").val(),$("#newendTime").val());            //搜索日期区间
        startTime = $("#newstartTime").val();
        endTime = $("#newendTime").val();
        }
    else{
        timeLoad = dateLog();                              //默认七天搜索
        $("#newstartTime").val(jzm.getDateTime(new Date().setDate(new Date().getDate() - 6)).split(' ')[0]);$("#newendTime").val(jzm.getDateTime(new Date()).split(' ')[0]);
      };
    $.ajax({
        url: httpJoin + 'statistics_adduser',
        type: 'GET',
        dataType: 'json',
        async:false,
        data: {id:jzm.uncompileStr(item.uname),token:jzm.uncompileStr(item.utoken),startTime:startTime,endTime:endTime,url: localURL +"chartsUser.html"}
    })
    .done(function(reg) {
        for(var i = 0; i < reg.package.userContent.length; i++){
            dateWNum.push(reg.package.userContent[i].total);     //个数
            yName.push(reg.package.userContent[i].registerDate);    //时间
            dateNum.push(reg.package.userContent[i].userCount);     //总数
        };
        // 使用刚指定的配置项和数据显示图表。
        if(reg.statusCode.status == 6666){
            usNewChart.setOption(          //异步数据获取填充
                {
                    title:{
                        text:'新增用户数量（手机端）',
                        textStyle: {
                            fontWeight: 'normal',              //标题颜色
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['新增用户数量'],
                        textStyle:{    //图例文字的样式
                            color:'#fff'
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(1, 255, 255, 0.3)'
                            }
                        }
                    },
                    grid: {     //边距
                        left: '2%',
                        right: '4%',
                        bottom: '0%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: yName,
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    series: [
                        {
                            name: '新增用户数量',
                            type:'line',
                            data:dateNum,
                            areaStyle: {
                                normal: {//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(128,128,128,1)'
                                    }, {
                                        offset: .34,
                                        color: 'rgba(128,128,128,1)'
                                    },{
                                        offset: 1,
                                        color: 'rgba(128,128,128,1)'
                                    }])
                                }
                            }
                        }
                    ]
                }
                , true);
            }

    });
    function dateLog()  //x轴时间节点方法
    {
        // alert(jzm.getDateTime(d.setDate(d.getDate() + 1)).split(' ')[0]);
        for(var i = 6; i >= 0; i--)
            {
                timeLoad.push(jzm.getDateTime(d.setDate(d.getDate() + 1)).split(' ')[0]);
            };
            return timeLoad;
    };
    jzm.userNewNumCharts();
};
//新增用户地区、渠道
jzm.userNewNumCharts = function(id){
    var usChart = echarts.init(document.getElementById('bar-addrNewchart'));// 基于准备好的dom，初始化echarts实例
    var usAddrChart = echarts.init(document.getElementById('bar-addrsNewchart'));// 基于准备好的dom，初始化echarts实例
    var timeLoad = [];      //x轴 数据
    var dateNum = [];       //对应x轴数据描点
    var yName = [];         //y轴名称
    var endTime = jzm.getDateTime(new Date()).split(' ')[0];        //结束日期
    var d = new Date();                                         //当前日期
    var dtime = d.setDate(d.getDate() - 7);                     //当前日期前7天
    var startTime = jzm.getDateTime(dtime).split(' ')[0];           //开始日期
    if($("#startTime").val())
        {
            if(!$("#endTime").val()){$("#endTime").val(jzm.getDateTime(new Date()).split(' ')[0])};
            timeLoad = jzm.getAllDate($("#startTime").val(),$("#endTime").val());            //搜索日期区间
            startTime = $("#startTime").val();
            endTime = $("#endTime").val();
        }
    else
        {
            timeLoad = dateLog();                              //默认七天搜索
            $("#startTime").val(jzm.getDateTime(new Date().setDate(new Date().getDate() - 6)).split(' ')[0]);$("#endTime").val(jzm.getDateTime(new Date()).split(' ')[0]);
        };
    $.ajax({
        url: httpJoin + 'statistics_adduser',
        type: 'GET',
        dataType: 'json',
        async:false,
        data: {id:jzm.uncompileStr(item.uname),token:jzm.uncompileStr(item.utoken),startTime:startTime,endTime:endTime,url: localURL +"chartsUser.html"}
    })
    .done(function(reg) {
        usChart.hideLoading();      //添加数据读取loading
        for(var i = 0; i < reg.package.userAreaContent.length; i++){
            dateNum.push(reg.package.userAreaContent[i].userCount);     //赋值
            yName.push(reg.package.userAreaContent[i].province);    //地区名称
        };
        // 使用刚指定的配置项和数据显示图表。
        if(reg.statusCode.status == 6666){
            usChart.setOption(          //异步数据获取填充
                {
                    title:{
                        text:'新增用户地区',
                        textStyle: {
                            fontWeight: 'normal',              //标题颜色
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(1, 255, 255, 0.3)'
                            }
                        }
                    },
                    grid: {     //边距
                        left: '2%',
                        right: '4%',
                        bottom: '0%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01],
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: yName,
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    series: [
                        {
                            name: '用户地区',
                            type:'bar',
                            data: dateNum,
                            itemStyle:{
                                normal:{
                                    lineStyle:{     //设置颜色、大小
                                        color:'#fff',
                                        width:2
                                    }
                                }
                            },
                            itemStyle:{
                                normal:{
                                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                        offset: 0,
                                        color: 'rgba(128,128,128,0.8)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(128,128,128,0.8)'
                                    }])

                                }
                            },
                            barWidth:30  //固定bar的宽度
                        }
                    ]
                }
                , true);
                var arr = [],yarr = [];
                if(reg.package.userChannel == 0){
                        arr.push(0);     //赋值
                        yarr.push("其他");    //地区名称
                    }
                else{
                        for(var i = 0; i < reg.package.userChannel.length; i++){
                            arr.push(reg.package.userChannel[i].userCount);     //赋值
                            yarr.push(reg.package.userChannel[i].adminName);    //地区名称
                        };
                    };

                usAddrChart.setOption(          //异步数据获取填充
                {
                    title:{
                        text:'新增用户渠道',
                        textStyle: {
                            fontWeight: 'normal',              //标题颜色
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(1, 255, 255, 0.3)'
                            }
                        }
                    },
                    grid: {     //边距
                        left: '2%',
                        right: '4%',
                        bottom: '0%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01],
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: yarr,
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    series: [
                        {
                            name: '用户渠道',
                            type:'bar',
                            data: arr,
                            itemStyle:{
                                normal:{
                                    lineStyle:{     //设置颜色、大小
                                        color:'#fff',
                                        width:2
                                    }
                                }
                            },
                            itemStyle:{
                                normal:{
                                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                        offset: 0,
                                        color: 'rgba(128,128,128,0.8)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(128,128,128,0.8)'
                                    }])

                                }
                            },
                            barWidth:30  //固定bar的宽度
                        }
                    ]
                }
                , true);
            }

    });
    function dateLog()  //x轴时间节点方法
    {
      for(var i = 6; i >= 0; i--)
        {
            timeLoad.push(jzm.getDateTime(d.setDate(d.getDate() + 1)).split(' ')[0]);
        };
        return timeLoad;
    };
};
//用户付费转化
jzm.rateCharts = function(id){
    var rateChart = echarts.init(document.getElementById('rateCharts'));// 基于准备好的dom，初始化echarts实例
    var probabilityCharts = echarts.init(document.getElementById('probabilityCharts'));
    // var usAddrChart = echarts.init(document.getElementById('bar-addrschart'));// 基于准备好的dom，初始化echarts实例
    var timeLoad = [];      //x轴 数据
    var dateNum = [];       //对应x轴数据描点
    var daterNum = [];    //总数
    var dateeNum = [];    //总数
    var dateaNum = [];    //总数
    var yName = [];         //y轴名称
    var endTime = jzm.getDateTime(new Date()).split(' ')[0];        //结束日期
    var d = new Date();                                         //当前日期
    var dtime = d.setDate(d.getDate() - 7);                     //当前日期前7天
    var startTime = jzm.getDateTime(dtime).split(' ')[0];           //开始日期
    if($("#ratestartTime").val())
        {
            if(!$("#rateendTime").val()){$("#rateendTime").val(jzm.getDateTime(new Date()).split(' ')[0])};
            timeLoad = jzm.getAllDate($("#ratestartTime").val(),$("#rateendTime").val());            //搜索日期区间
            startTime = $("#ratestartTime").val();
            endTime = $("#rateendTime").val();
        }
    else
        {
            timeLoad = dateLog();                              //默认七天搜索
            $("#ratestartTime").val(jzm.getDateTime(new Date().setDate(new Date().getDate() - 6)).split(' ')[0]);$("#rateendTime").val(jzm.getDateTime(new Date()).split(' ')[0]);
        };
    $.ajax({
        url: httpJoin + 'statistics_rate',
        type: 'GET',
        dataType: 'json',
        async:false,
        data: {id:jzm.uncompileStr(item.uname),token:jzm.uncompileStr(item.utoken),startTime:startTime,endTime:endTime,url: localURL +"chartsUser.html"}
    })
    .done(function(reg) {
        for(var i = 0; i < reg.package.importantUserContent.length; i++){  //新增充值用户内容明细
            daterNum.push(reg.package.importantUserContent[i].userCount);     //用户数
        };
        for(var i = 0; i < reg.package.cumulativeUserContent.length; i++){ //累计付费用户内容明细
            dateeNum.push(reg.package.cumulativeUserContent[i].userCount);     //个数
        };
        for(var i = 0; i < reg.package.conversionRate.length; i++){ //转化率内容明细
            dateaNum.push(reg.package.conversionRate[i].rate * 100);     //个数
            yName.push(reg.package.conversionRate[i].moneyDay);    //时间
        };
        // 使用刚指定的配置项和数据显示图表。
        if(reg.statusCode.status == 6666){
            rateChart.setOption(          //异步数据获取填充
                {
                    title:{
                        text:'付费转化',
                        textStyle: {
                            fontWeight: 'normal',              //标题颜色
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(1, 255, 255, 0.3)'
                            }
                        }
                    },
                    grid: {     //边距
                        left: '2%',
                        right: '4%',
                        bottom: '0%',
                        containLabel: true
                    },
                    legend: {
                        data:['新增付费用户','累计付费用户'],
                        textStyle:{    //图例文字的样式
                            color:'#fff'
                        }
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: yName,
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    series: [
                        {
                            name: '新增付费用户',
                            stack: '新增付费用户',
                            type:'line',
                            data:daterNum,
                            // itemStyle:{
                            //     normal:{
                            //         lineStyle:{     //设置颜色、大小
                            //             color:'#fff',
                            //             width:2
                            //         }
                            //     }
                            // },
                            areaStyle: {
                                normal: {//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(128,128,128,1)'
                                    }, {
                                        offset: .34,
                                        color: 'rgba(128,128,128,1)'
                                    },{
                                        offset: 1,
                                        color: 'rgba(128,128,128,1)'
                                    }])
                                }
                            }
                        },
                        {
                            name:'累计付费用户',
                            type:'line',
                            stack: '累计付费用户',
                            areaStyle: {normal: {}},
                            data:dateeNum
                        }
                    ]
                }
                , true);

            probabilityCharts.setOption(          //异步数据获取填充
                {
                    title:{
                        text:'转化率',
                        textStyle: {
                            fontWeight: 'normal',              //标题颜色
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(1, 255, 255, 0.3)'
                            }
                        }
                    },
                    grid: {     //边距
                        left: '2%',
                        right: '4%',
                        bottom: '0%',
                        containLabel: true
                    },
                    legend: {
                        data:['转化率'],
                        textStyle:{    //图例文字的样式
                            color:'#fff'
                        }
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: yName,
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        },
                        axisLabel: {
                            formatter: '{value} %'
                        }
                    },
                    series: [
                        {
                            name:'转化率',
                            type:'line',
                            stack: '转化率',
                            areaStyle: {normal: {}},
                            data:dateaNum
                        }
                    ]
                }
                , true);




            }

    });
    function dateLog()  //x轴时间节点方法
    {
        // alert(jzm.getDateTime(d.setDate(d.getDate() + 1)).split(' ')[0]);
        for(var i = 6; i >= 0; i--)
            {
                timeLoad.push(jzm.getDateTime(d.setDate(d.getDate() + 1)).split(' ')[0]);
            };
            return timeLoad;
    };
};
//商户统计列表
jzm.shopTaolList = function(sear){
    var searchUser = "";
    var staTime = document.getElementById("ratestartTime").value;
    var entTime = document.getElementById("rateendTime").value;
    if (sear){
        searchUser += "&checkName=" + document.getElementById("shopUserName").value;
        };
    if(!staTime){
        var d = new Date();                                         //当前日期
        var dtime = d.setDate(d.getDate() - 6);                     //当前日期前7天
        $("#ratestartTime").val(jzm.getDateTime(dtime).split(' ')[0]);
        searchUser += "&startTime=" + $("#ratestartTime").val() + "&endTime=" + jzm.getDateTime(new Date()).split(' ')[0];
        if(!$("#rateendTime").val()){$("#rateendTime").val(jzm.getDateTime(new Date()).split(' ')[0])};
    }else{
        searchUser += "&startTime=" + $("#ratestartTime").val() + "&endTime=" + $("#rateendTime").val();
    };

    jzm.paraMessage('loadAjaxdata',{url:"statistics_shop",xmldata:searchUser,callbackfn:function(reg){
        var str = "";
        RegCode(statusCode).test(reg.statusCode.status) ? void function(){
          for(var i = 0; i < reg.package.ShopMachine.length; i++){
              if(reg.package.ShopMachine[i].adminID == "无"){
                      reg.package.ShopMachine[i].adminID = -1;
                  };
              str += '<tr>'+
                  '<td>'+ reg.package.ShopMachine[i].adminName +'</td>'+
                  '<td>'+ reg.package.ShopMachine[i].payMoney +'</td>'+
                  '<td>'+ reg.package.ShopMachine[i].payCount +' </td>'+
                  '<td>'+ reg.package.ShopMachine[i].machineCount +'</td>'+
                  '<td>'+
                      '<a href="chartsShopDetails.html?uri=/manage/chartsFinance.html&v='+ jzm.randomNum() +'&shopid='+ reg.package.ShopMachine[i].adminID +'">查看详情</a>' +
                  '</td>'+
              '</tr>';
              };
          document.getElementById("tbodyhtml").innerHTML = str;
        }() : jzm.Error(reg);
    },type:"POST",trcny:true});
};

//商户设备统计列表
jzm.shopRootTaolList = function(sear,page){
    var searchUser = "";
    var staTime = document.getElementById("ratestartTime").value;
    var entTime = document.getElementById("rateendTime").value;
    if (sear){
      searchUser += "&name=" + document.getElementById("shopUserName").value;
    };
    if(!staTime){
        var d = new Date();                                         //当前日期
        var dtime = d.setDate(d.getDate() - 6);                     //当前日期前7天
        $("#ratestartTime").val(jzm.getDateTime(dtime).split(' ')[0]);
        searchUser += "&startTime=" + $("#ratestartTime").val() + "&endTime=" + jzm.getDateTime(new Date()).split(' ')[0];
        if(!$("#rateendTime").val()){$("#rateendTime").val(jzm.getDateTime(new Date()).split(' ')[0])};
      }else{
            searchUser += "&startTime=" + $("#ratestartTime").val() + "&endTime=" + $("#rateendTime").val();
        };
    jzm.paraMessage('loadAjaxdata',{url:"statistics_machinelist",xmldata:"&page=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1) ) + "&adminID=" +jzm.getQueryString("shopid") + searchUser,callbackfn:function(reg){
      RegCode(statusCode).test(reg.statusCode.status) ? void function(){
        var str = "";
        for(var i = 0; i < reg.package.MachineCountList.length; i++){
            str += '<tr>'+
                '<td>'+ reg.package.MachineCountList[i].machineNumber +'</td>'+
                '<td>'+ reg.package.MachineCountList[i].addr +'</td>'+
                '<td>'+ reg.package.MachineCountList[i].payMoney +' </td>'+
                '<td>'+ reg.package.MachineCountList[i].payCount +'</td>'+
                '<td>'+
                    '<a href="chartsShopSale.html?uri=/manage/chartsFinance.html&v='+ jzm.randomNum() +'&machineNumber='+ reg.package.MachineCountList[i].machineNumber +'">销售明细</a>' +
                '</td>'+
            '</tr>';
            };
        document.getElementById("tbodyhtml").innerHTML = str;
      }() : jzm.Error(reg);
    },type:"GET",trcny:true});
    //曲线图
    var rateChart = echarts.init(document.getElementById('rateCharts'));// 基于准备好的dom，初始化echarts实例
    // var usAddrChart = echarts.init(document.getElementById('bar-addrschart'));// 基于准备好的dom，初始化echarts实例
    var timeLoad = [];      //x轴 数据
    var dateNum = [];       //对应x轴数据描点
    var daterNum = [];    //总数
    var dateeNum = [];    //总数
    var yName = [];         //y轴名称
    var endTime = jzm.getDateTime(new Date()).split(' ')[0];        //结束日期
    var d = new Date();                                         //当前日期
    var dtime = d.setDate(d.getDate() - 7);                     //当前日期前7天
    var startTime = jzm.getDateTime(dtime).split(' ')[0];           //开始日期
    if($("#ratestartTime").val())
        {
            if(!$("#rateendTime").val()){$("#rateendTime").val(jzm.getDateTime(new Date()).split(' ')[0])};
            timeLoad = jzm.getAllDate($("#ratestartTime").val(),$("#rateendTime").val());            //搜索日期区间
            startTime = $("#ratestartTime").val();
            endTime = $("#rateendTime").val();
        }
    else
        {
            timeLoad = dateLog();                              //默认七天搜索
        };
    $.ajax({
        url: httpJoin + 'statistics_admin_sold_graph',
        type: 'GET',
        dataType: 'json',
        async:false,
        data: {id:jzm.uncompileStr(item.uname),token:jzm.uncompileStr(item.utoken),startTime:startTime,endTime:endTime,url: localURL +"chartsUser.html",adminId:jzm.getQueryString("shopid")}
    })
    .done(function(reg) {
        $("#allCountNum").text('总销售：' + reg.package.allCountNum);   //
        $("#allPayMoney").text('总金额：' + reg.package.allPayMoney);
        function shopday(key){
            var ss = "";
            for(var i = 0; i < reg.package.adminSoldGraphList.length; i++){
                if(key == reg.package.adminSoldGraphList[i].date){
                    ss = reg.package.adminSoldGraphList[i].date;
                    return ss;
                  };
            };
            return ss;
        }
        function shopmanay(dateeee){
            for(var i = 0; i < reg.package.adminSoldGraphList.length; i++){
                if(reg.package.adminSoldGraphList[i].date == dateeee)    //日期对比
                {
                    return reg.package.adminSoldGraphList[i].countNum +","+ reg.package.adminSoldGraphList[i].payMoney;     //赋值
                }
            }
            return 0;
        }
        for(var key in timeLoad){
            if(reg.package.adminSoldGraphList == null){
                daterNum.push(0);     //数
                dateeNum.push(0);     //金额
            }else{
                if(timeLoad[key] == jzm.countSubstr(timeLoad,shopday(timeLoad[key]))){
                    daterNum.push(shopmanay(timeLoad[key]).split(',')[0]);     //数
                    dateeNum.push(shopmanay(timeLoad[key]).split(',')[1]);     //金额
                }
                else
                {
                   daterNum.push(0);     //数
                    dateeNum.push(0);     //金额
                }
            };
        };
        // 使用刚指定的配置项和数据显示图表。
        if(reg.statusCode.status == 6666){
            rateChart.setOption(          //异步数据获取填充
                {
                    title:{
                        text:'销售额',
                        textStyle: {
                            fontWeight: 'normal',              //标题颜色
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(1, 255, 255, 0.3)'
                            }
                        }
                    },
                    grid: {     //边距
                        left: '2%',
                        right: '4%',
                        bottom: '0%',
                        containLabel: true
                    },
                    legend: {
                        data:['总销量','总金额'],
                        textStyle:{    //图例文字的样式
                            color:'#fff'
                        }
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: timeLoad,
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    series: [
                        {
                            name: '总销量',
                            type:'line',
                            data:daterNum,
                            areaStyle: {
                                normal: {//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(128,128,128,1)'
                                    }, {
                                        offset: .34,
                                        color: 'rgba(128,128,128,1)'
                                    },{
                                        offset: 1,
                                        color: 'rgba(128,128,128,1)'
                                    }])
                                }
                            }
                        },
                        {
                            name:'总金额',
                            type:'line',
                            stack: '总金额',
                            areaStyle: {normal: {}},
                            data:dateeNum
                        }
                    ]
                }
                , true);
            }

    });
    function dateLog()  //x轴时间节点方法
    {
        for(var i = 6; i >= 0; i--){
            timeLoad.push(jzm.getDateTime(d.setDate(d.getDate() + 1)).split(' ')[0]);
          };
        return timeLoad;
    };
};

//销售明细
jzm.shopRootSaleList = function(page){
    var searchUser = "";
    var staTime = document.getElementById("ratestartTime").value;
    var entTime = document.getElementById("rateendTime").value;
    if(!staTime){
            var d = new Date();                                         //当前日期
            var dtime = d.setDate(d.getDate() - 6);                     //当前日期前7天
            $("#ratestartTime").val(jzm.getDateTime(dtime).split(' ')[0]);
            searchUser += "&startTime=" + $("#ratestartTime").val() + "&endTime=" + jzm.getDateTime(new Date()).split(' ')[0];
            if(!$("#rateendTime").val()){$("#rateendTime").val(jzm.getDateTime(new Date()).split(' ')[0])};
        }
    else{
            searchUser += "&startTime=" + $("#ratestartTime").val() + "&endTime=" + $("#rateendTime").val();
        };
    jzm.paraMessage('loadAjaxdata',{url:"statistics_machineorder",xmldata:"&PageNum=" + (page ? page : (location.hash.match('page') ? page = location.hash.substring(location.hash.lastIndexOf('=') + 1,location.hash.length) : page = 1)) + searchUser + "&checkMachineNum=" +jzm.getQueryString("machineNumber"),callbackfn:function(reg){
      var str = "";
      if (reg.statusCode.status == 6666){
          for(var i = 0; i < reg.package.MachineOrderList.length; i++)
              {
                  str += '<tr>'+
                      '<td>'+ reg.package.MachineOrderList[i].orderID +'</td>'+
                      '<td>'+ reg.package.MachineOrderList[i].productName +'</td>'+
                      '<td>'+ reg.package.MachineOrderList[i].payMoney +' </td>'+
                      '<td>'+ reg.package.MachineOrderList[i].payType +'</td>'+
                      '<td>'+ reg.package.MachineOrderList[i].payTime +'</td>'+
                  '</tr>';
              };
          $("#pageNums").val(reg.package.PageCount * 20);
          $('#tbodyhtml').html(str);
          if($("#seach").attr('data-type')) jzm.search(reg);
          }
      else if(info.package.MachineOrderList == 0){
          $("#pageTool").css('display','none');
          $('#tbodyhtml').html(str);
      }
    },type:"GET",trcny:false});
    jzm.shopRootSaleListPic();
};
//明细曲线图
jzm.shopRootSaleListPic = function(id){
    //曲线图
    var rateChart = echarts.init(document.getElementById('rateCharts'));// 基于准备好的dom，初始化echarts实例
    // var usAddrChart = echarts.init(document.getElementById('bar-addrschart'));// 基于准备好的dom，初始化echarts实例
    var timeLoad = [];      //x轴 数据
    var dateNum = [];       //对应x轴数据描点
    var daterNum = [];    //总数
    var dateeNum = [];    //总数
    var yName = [];         //y轴名称
    var endTime = jzm.getDateTime(new Date()).split(' ')[0];        //结束日期
    var d = new Date();                                         //当前日期
    var dtime = d.setDate(d.getDate() - 6);                     //当前日期前7天
    var startTime = jzm.getDateTime(dtime).split(' ')[0];           //开始日期
    if($("#picRatestartTime").val())
        {
            if(!$("#picRateendTime").val()){$("#picRateendTime").val(jzm.getDateTime(new Date()).split(' ')[0])};
            timeLoad = jzm.getAllDate($("#picRatestartTime").val(),$("#picRateendTime").val());            //搜索日期区间
            startTime = $("#picRatestartTime").val();
            endTime = $("#picRateendTime").val();
        }
    else
        {
            timeLoad = dateLog();                              //默认七天搜索
            $("#picRatestartTime").val(jzm.getDateTime(new Date().setDate(new Date().getDate() - 6)).split(' ')[0]);$("#picRateendTime").val(jzm.getDateTime(new Date()).split(' ')[0]);
        };
    $.ajax({
        url: httpJoin + 'statistics_machine_sold_graph',
        type: 'GET',
        dataType: 'json',
        async:false,
        data: {id:jzm.uncompileStr(item.uname),token:jzm.uncompileStr(item.utoken),startTime:startTime,endTime:endTime,url: localURL +"chartsUser.html",machineNumber:jzm.getQueryString("machineNumber")}
    })
    .done(function(reg) {
        $("#allCountNum").text('总销售：' + reg.package.allCountNum);   //
        $("#allPayMoney").text('总金额：' + reg.package.allPayMoney);
        function test(key)
        {
            var ss = "";
            for(var i = 0; i < reg.package.machineSoldGraphList.length; i++){
                if(key == reg.package.machineSoldGraphList[i].date)
                    {
                        ss += reg.package.machineSoldGraphList[i].date;
                        return ss;
                    };
            };
            return ss;
        }
        function test222(dateeee)
        {
            for(var i = 0; i < reg.package.machineSoldGraphList.length; i++){
                if(reg.package.machineSoldGraphList[i].date == dateeee)    //日期对比
                {
                    return reg.package.machineSoldGraphList[i].countNum +","+ reg.package.machineSoldGraphList[i].payMoney;     //赋值
                }
            }
            return 0;
        }
        for(var key in timeLoad){
            if(timeLoad[key] == jzm.countSubstr(timeLoad,test(timeLoad[key]))){
                daterNum.push(test222(timeLoad[key]).split(',')[0]);     //数
                dateeNum.push(test222(timeLoad[key]).split(',')[1]);     //金额
            }
            else
            {
               daterNum.push(0);     //数
                dateeNum.push(0);     //金额
            }
        };
        // 使用刚指定的配置项和数据显示图表。
        if(reg.statusCode.status == 6666){
            rateChart.setOption(          //异步数据获取填充
                {
                    title:{
                        text:'总销售统计',
                        textStyle: {
                            fontWeight: 'normal',              //标题颜色
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(1, 255, 255, 0.3)'
                            }
                        }
                    },
                    grid: {     //边距
                        left: '2%',
                        right: '4%',
                        bottom: '0%',
                        containLabel: true
                    },
                    legend: {
                        data:['总销量(杯)','总金额(元)'],
                        textStyle:{    //图例文字的样式
                            color:'#fff'
                        }
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: timeLoad,
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    yAxis: {
                        type: 'value',
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    series: [
                        {
                            name: '总销量(杯)',
                            type:'line',
                            data:daterNum,
                            areaStyle: {
                                normal: {//颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
                                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                        offset: 0,
                                        color: 'rgba(128,128,128,1)'
                                    }, {
                                        offset: .34,
                                        color: 'rgba(128,128,128,1)'
                                    },{
                                        offset: 1,
                                        color: 'rgba(128,128,128,1)'
                                    }])
                                }
                            }
                        },
                        {
                            name:'总金额(元)',
                            type:'line',
                            stack: '总金额',
                            areaStyle: {normal: {}},
                            data:dateeNum
                        }
                    ]
                }
                , true);
            }

    });
    function dateLog()  //x轴时间节点方法
    {
        // alert(jzm.getDateTime(d.setDate(d.getDate() + 1)).split(' ')[0]);.
        var dy = new Date();
        var dys = dy.setDate(dy.getDate() - 7)
        for(var i = 7; i > 0; i--)
            {
                timeLoad.push(jzm.getDateTime(dy.setDate(dy.getDate() + 1)).split(' ')[0]);
            };
            return timeLoad;
    };
    jzm.shopRootSaleBar();
};
//明细销售分析
jzm.shopRootSaleBar = function(id)
{
    var usChart = echarts.init(document.getElementById('rateChartsBar'));// 基于准备好的dom，初始化echarts实例
    var timeLoad = [];      //x轴 数据
    var dateNum = [];       //对应x轴数据描点
    var yName = [];         //y轴名称
    var dateNum1 = [];       //对应x轴数据描点
    var endTime = jzm.getDateTime(new Date()).split(' ')[0];        //结束日期
    var d = new Date();                                         //当前日期
    var dtime = d.setDate(d.getDate() - 7);                     //当前日期前7天
    var startTime = jzm.getDateTime(dtime).split(' ')[0];           //开始日期
    if($("#barRatestartTime").val())
        {
            if(!$("#barRateendTime").val()){$("#barRateendTime").val(jzm.getDateTime(new Date()).split(' ')[0])};
            timeLoad = jzm.getAllDate($("#barRatestartTime").val(),$("#barRateendTime").val());            //搜索日期区间
            startTime = $("#barRatestartTime").val();
            endTime = $("#barRateendTime").val();
        }
    else
        {
            timeLoad = dateLog();                              //默认七天搜索
            $("#barRatestartTime").val(jzm.getDateTime(new Date().setDate(new Date().getDate() - 6)).split(' ')[0]);$("#barRateendTime").val(jzm.getDateTime(new Date()).split(' ')[0]);
        };
    $.ajax({
        url: httpJoin + 'statistics_machine_sold_analyze',
        type: 'GET',
        dataType: 'json',
        async:false,
        data: {id:jzm.uncompileStr(item.uname),token:jzm.uncompileStr(item.utoken),startTime:startTime,endTime:endTime,url: localURL +"chartsUser.html",machineNumber:jzm.getQueryString("machineNumber")}
    })
    .done(function(reg) {
        usChart.hideLoading();      //添加数据读取loading
        for(var i = 0; i < reg.package.package.machineSoldAnalyzeList.length; i++){
            dateNum.push(reg.package.package.machineSoldAnalyzeList[i].payMoney);     //赋值
            yName.push(reg.package.package.machineSoldAnalyzeList[i].productName);    //地区名称
            dateNum1.push(reg.package.package.machineSoldAnalyzeList[i].countNum);     //赋值
        };
        // 使用刚指定的配置项和数据显示图表。
        if(reg.statusCode.status == 6666){
            usChart.setOption(          //异步数据获取填充
                {
                    title:{
                        text:'销售额统计',
                        textStyle: {
                            fontWeight: 'normal',              //标题颜色
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: 'rgba(1, 255, 255, 0.3)'
                            }
                        }
                    },
                    grid: {     //边距
                        left: '2%',
                        right: '4%',
                        bottom: '0%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    legend: {
                        data: ['销售额(元)', '销量(杯)'],
                        textStyle:{
                            color:'#fff'
                        }
                    },
                    xAxis: {
                        type: 'value',
                        boundaryGap: [0, 0.01],
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    yAxis: {
                        type: 'category',
                        data: yName,
                        axisLine:{
                            lineStyle:{
                                color:'#fff'
                            }
                        }
                    },
                    series: [
                        {
                            name: '销售额(元)',
                            type:'bar',
                            data: dateNum,
                            itemStyle:{
                                normal:{
                                    lineStyle:{     //设置颜色、大小
                                        color:'#fff',
                                        width:2
                                    }
                                }
                            },
                            itemStyle:{
                                normal:{
                                    //颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上

                                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                                        offset: 0,
                                        color: 'rgba(128,128,128,0.8)'
                                    }, {
                                        offset: 1,
                                        color: 'rgba(128,128,128,0.8)'
                                    }])

                                }
                            }
                        },
                        {
                            name: '销量(杯)',
                            type: 'bar',
                            data: dateNum1
                        }
                    ]
                }
                , true);
             }

                });
                function dateLog()  //x轴时间节点方法
                {
                    // alert(jzm.getDateTime(d.setDate(d.getDate() + 1)).split(' ')[0]);
                    for(var i = 6; i >= 0; i--)
                        {
                            timeLoad.push(jzm.getDateTime(d.setDate(d.getDate() + 1)).split(' ')[0]);
                        };
                        return timeLoad;
                };
};

//抽取日期对比数据
jzm.moneyday =function(reg,key){
  for(var i = 0; i < reg.package.content.length; i++){
      if(key == reg.package.content[i].moneyDay){
          return reg.package.content[i].moneyDay;
        };
  };
  return "";
}
jzm.contentuser = function(reg,date,id){
    for(var i = 0; i < reg.package.content.length; i++){
        if(reg.package.content[i].moneyDay == date)    /*/日期对比/*/{
          if(id){
            return id == 1 ? reg.package.content[i].money : (id == 2 ? reg.package.content[i].count : reg.package.content[i].userCount) ;     //赋值
          }else{
            return reg.package.machineSoldGraphList[i].countNum +","+ reg.package.machineSoldGraphList[i].payMoney;     //赋值
          };

        }
    }
    return 0;
}
jzm.countSubstr = function(str, substr) {
    var reg = new RegExp(substr, "g");
    return str.toString().match(reg) ? str.toString().match(reg) : 0;
}
