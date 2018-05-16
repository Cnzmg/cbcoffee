var user = document.getElementById("user"),pwd =document.getElementById("pwd"),login = document.getElementById("coffeeLogin");
window.onload = function()
{
    localStorage.removeItem("token");
    if(localStorage.getItem("remember"))
        {
            user.value = jzm.uncompileStr(JSON.parse(localStorage.getItem("remember")).name);
            pwd.value = jzm.uncompileStr(JSON.parse(localStorage.getItem("remember")).pwd);
            $("#remember").attr("checked",true);
            $("label[for='remember']").children('div').addClass('checked');
        };
};
document.onkeydown = function(event)
{
    e = event ? event : (window.event ? window.event : null);
    if (e.keyCode == 13)
        {
            login.onclick();
        };
};
login.onclick = function(e)
{
    login.innerHTML = "正在登录···";
    if (!user.value)
        {
            alert("请输入用户名！");
            login.innerHTML = "登录";
            return false;
        };
    if (!pwd.value)
        {
            alert("请输入密码！");
            login.innerHTML = "登录";
            return false;
        };
    jzm.paraMessage('loadAjaxdata',{url:"admin_login",xmldata:"adminName="+user.value +"&adminPwd="+pwd.value,callbackfn:function(reg){
      if (reg.statusCode.status == 2000)
          {
              localStorage.setItem("token",JSON.stringify({uname:jzm.compileStr(reg.id.toString()),utoken:jzm.compileStr(reg.token)}));
              if($("#remember").is(":checked"))
                  {
                      localStorage.setItem("remember",JSON.stringify({name:jzm.compileStr(user.value),pwd:jzm.compileStr(pwd.value)}));
                  }
              else
                  {
                      localStorage.removeItem("remember");
                  };
              jzm.paraMessage('rangelider');
              window.location.href = "./index.html?v=" + jzm.randomNum();
          }
      else
          {
              alert(reg.statusCode.msg);
              login.innerHTML = "登录";
          };
    },type:"POST",trcny:true})
};
