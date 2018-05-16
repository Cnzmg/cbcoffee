//用户统计  收入数据-充值次数-充值人数
var userCharts = function(id){
    var yName,cName;
    if(!id){id=1;yName = '￥{value}';cName = '金额'}
    else if(id == 1){$(".boxCharts").children('p').eq(0).addClass('active').siblings('p').removeClass('active');yName = '￥{value}';cName = '金额'}
    else if(id == 2){$(".boxCharts").children('p').eq(1).addClass('active').siblings('p').removeClass('active');yName = '{value}';cName = '次数'}
    else if(id == 3){$(".boxCharts").children('p').eq(2).addClass('active').siblings('p').removeClass('active');yName = '{value}';cName = '人数'};
    var usChart = echarts.init(document.getElementById('usCharts'));// 基于准备好的dom，初始化echarts实例
    var timeLoad = [];      //x轴 数据
    var dateNum = [];       //对应x轴数据描点
    var endTime = getDateTime(new Date()).split(' ')[0];        //结束日期
    var d = new Date();                                         //当前日期
    var dtime = d.setDate(d.getDate() - 6);                     //当前日期前7天
    var startTime = getDateTime(dtime).split(' ')[0];           //开始日期
    $("#typeId").val($(".boxCharts .active").attr("data-num"));
    if($("#startTime").val())
        {
            if(!$("#endTime").val()){$("#endTime").val(getDateTime(new Date()).split(' ')[0])};
            timeLoad = getAllDate($("#startTime").val(),$("#endTime").val());            //搜索日期区间
            startTime = $("#startTime").val();
            endTime = $("#endTime").val();
        }
    else
        {
            timeLoad = dateLog();                              //默认七天搜索
        };
    usChart.setOption({                                         //使用默认图表 初始化
                title: {
                    text: ''
                },
                tooltip: {},
                legend: {
                    data:['']
                },
                xAxis: {
                    data: []
                },
                yAxis: {},
                series: [{
                    name: '',
                    type: 'bar',
                    data: []
                }]
            });

    $.ajax({
        url: httpJoin + 'statistics_income',
        type: 'GET',
        dataType: 'json',
        async:false,
        data: {id:item.uname,token:item.utoken,type: $("#typeId").val(),startTime:startTime,endTime:endTime,url:localURL + "chartsUser.html"}
    })
    .done(function(reg) {
        usChart.hideLoading();      //添加数据读取loading
        if(reg.package.content == 0)
        {
            for(var key in timeLoad){
                dateNum.push(0);
            };
        }else{
            for(var key in timeLoad){
                for(var i = 0; i < reg.package.content.length; i++ ){
                    if(timeLoad[key] == reg.package.content[i].moneyday)    //日期对比
                    {
                        dateNum.push(reg.package.content[i].money);     //赋值
                        break;
                    }
                    else
                    {
                        continue;
                    };
                };
                dateNum.push(0);      //空数据赋0
            };
        };
        console.log(dateNum);
        // 使用刚指定的配置项和数据显示图表。
        if(reg.statusCode.status == 6666){
            usChart.setOption(          //异步数据获取填充
                {
                    title:{
                        text:'收入数据',
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
    function dateLog()  //x轴时间节点方法
    {
        // alert(getDateTime(d.setDate(d.getDate() + 1)).split(' ')[0]);
        var dy = new Date();
        var dyn = dy.setDate(dy.getDate() - 7);
        for(var i = 7; i > 0; i--)
            {
                timeLoad.push(getDateTime(dy.setDate(dy.getDate() + 1)).split(' ')[0]);
            };
            console.log(timeLoad);
            return timeLoad;
    };
};

var userNumCharts = function(id){
    var usChart = echarts.init(document.getElementById('bar-addrchart'));// 基于准备好的dom，初始化echarts实例
    var timeLoad = [];      //x轴 数据
    var dateNum = [];       //对应x轴数据描点
    var yName = [];         //y轴名称
    var endTime = getDateTime(new Date()).split(' ')[0];        //结束日期
    var d = new Date();                                         //当前日期
    var dtime = d.setDate(d.getDate() - 6);                     //当前日期前7天
    var startTime = getDateTime(dtime).split(' ')[0];           //开始日期
    if($("#startTime").val())
        {
            if(!$("#endTime").val()){$("#endTime").val(getDateTime(new Date()).split(' ')[0])};
            timeLoad = getAllDate($("#startTime").val(),$("#endTime").val());            //搜索日期区间
            startTime = $("#startTime").val();
            endTime = $("#endTime").val();
        }
    else
        {
            timeLoad = dateLog();                              //默认七天搜索
        };
    usChart.setOption({                                         //使用默认图表 初始化
                title: {
                    text: ''
                },
                tooltip: {},
                legend: {
                    data:['']
                },
                xAxis: {
                    data: []
                },
                yAxis: {},
                series: [{
                    name: '',
                    type: 'bar',
                    data: []
                }]
            });

    $.ajax({
        url: httpJoin + 'statistics_user',
        type: 'GET',
        dataType: 'json',
        async:false,
        data: {id:item.uname,token:item.utoken,startTime:startTime,endTime:endTime,url: localURL +"chartsUser.html"}
    })
    .done(function(reg) {
        usChart.hideLoading();      //添加数据读取loading
        for(var i = 0; i < reg.package.areaContent.length; i++){
            dateNum.push(reg.package.areaContent[i].money);     //赋值
            yName.push(reg.package.areaContent[i].province);    //地区名称
        };
        console.log("date---" + dateNum);
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
                                        color: '#808080'
                                    }, {
                                        offset: 1,
                                        color: '#808080'
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
        // alert(getDateTime(d.setDate(d.getDate() + 1)).split(' ')[0]);
        var dy = new Date();
        var dyn = dy.setDate(dy.getDate() - 7);
        for(var i = 6; i >= 0; i--)
            {
                timeLoad.push(getDateTime(dy.setDate(dy.getDate() + 1)).split(' ')[0]);
            };
            return timeLoad;
    };
}

