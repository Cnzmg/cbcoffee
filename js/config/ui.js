var str = '<!-- Sidbar Widgets -->'+
'<div class="side-widgets overflow">'+
    '<!-- Profile Menu -->'+
    '<div class="text-center s-widget m-b-25 dropdown" id="profile-menu">'+
        '<a href="" data-toggle="dropdown">'+
            '<img class="profile-pic animated" src="img/1516775224.jpg" alt="">'+
        '</a>'+
        '<ul class="dropdown-menu profile-menu">'+
        '</ul>'+
        '<h4 class="m-0" id="usAdministration">Admin</h4>'+
        '<span id="Administration"></span>'+
    '</div>'+
    '<!-- Calendar -->'+
    '<div class="s-widget m-b-25">'+
        '<div id="sidebar-calendar"></div>'+
    '</div>'+
'</div>'+
'<!-- Side Menu -->'+
'<ul class="list-unstyled side-menu" id="J_menuatch"></ul>';
var lbs = '<a href="" id="menu-toggle"></a>'+
'<a class="logo pull-left" href="index.html">咖啡蜗后台管理系统</a>'+
'<div class="media-body">'+
        '<div id="time" class="pull-right">'+
        '<div class="media" id="top-menu">'+
            '<span id="hours"></span>'+
            ':'+
            '<span id="min"></span>'+
            ':'+
            '<span id="sec"></span>'+
        '</div>'+

        '<div class="media-body" style="line-height:39px;">'+
            '<!-- <input type="text" class="main-search"> -->'+
            '广东圆梦实业发展有限公司'+
        '</div>'+
    '</div>'+
'</div>';
$(document).ready(function(){
  $("#header").html(lbs);
  $("#sidebar").html(str);
});
