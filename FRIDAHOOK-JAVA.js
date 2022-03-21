function hook_java()
{
    //hook java static函数
    Java.perform(function ()
    {
        console.log("[*]:" + "L0\n");
        var LoginActivity = Java.use("com.example.androiddemo.Activity.LoginActivity");  
        LoginActivity.a.overload('java.lang.String', 'java.lang.String').implementation = function (arg0){
            console.log("L1:",arg0,this.a(arg0,arg0));
            return "kanxue";
        }
    });

    Java.perform(function(){
        console.log("[*]:" + "L1\n");
        var FridaActivity1 = Java.use("com.example.androiddemo.Activity.FridaActivity1");
        FridaActivity1.a.implementation = function(arg0){
            console.log("L2:",this.a(arg0));
            return "R4jSLLLLLLLLLLOrLE7/5B+Z6fsl65yj6BgC6YWz66gO6g2t65Pk6a+P65NK44NNROl0wNOLLLL=";
        }
    });

    //可以通过call_FridaActivity2方式主动调用 也可以通过下面的方式重写check函数 check函数中直接调用或choose调用其他静态或非静态函数均可

    Java.perform(function(){    
        console.log("[*]:" + "L2\n");
        var FridaActivity2 = Java.use("com.example.androiddemo.Activity.FridaActivity2");
        FridaActivity2.onCheck.implementation = function(){
            this.setStatic_bool_var();
            Java.choose("com.example.androiddemo.Activity.FridaActivity2" , {
                onMatch : function(instance){
                    instance.setBool_var();
                },
                onComplete : function(){

                } 
            });
            // 不用Java.choose直接调用this.setBool_var也可
            //this.setBool_var();
            return this.onCheck();
        }
    });
}
//注意主动调用只有在示例存在时调用才有效，在未进入该activity时调用无效
function call_FridaActivity2(){
    Java.perform(function(){
        var FridaActivity2 = Java.use("com.example.androiddemo.Activity.FridaActivity2");
        FridaActivity2.setStatic_bool_var();
        Java.choose("com.example.androiddemo.Activity.FridaActivity2" , {
            onMatch : function(instance){
                instance.setBool_var();
            },
            onComplete : function(){

            } 
        });
    });
}
//修改变量
function call_FridaActivity3(){
    Java.perform(function(){
        var FridaActivity3 =Java.use("com.example.androiddemo.Activity.FridaActivity3");
        FridaActivity3.static_bool_var.value = true;
        console.log(FridaActivity3.static_bool_var.value);
        Java.choose("com.example.androiddemo.Activity.FridaActivity3" , {
            onMatch : function(instance){
                instance.bool_var.value = true;
                instance._same_name_bool_var.value = true;
                console.log(instance.bool_var.value,instance._same_name_bool_var.value)
            },
            onComplete : function(){

            } 
        });
    });
}
//hook innerclass
function call_FridaActivity4(){
    Java.perform(function(){
        var FridaActivity4InnerClass =Java.use("com.example.androiddemo.Activity.FridaActivity4$InnerClasses");
        console.log(FridaActivity4InnerClass);
        FridaActivity4InnerClass.check1.implementation = function(){
            return true;
        };
        FridaActivity4InnerClass.check2.implementation = function(){
            return true;
        };
        FridaActivity4InnerClass.check3.implementation = function(){
            return true;
        };
        FridaActivity4InnerClass.check4.implementation = function(){
            return true;
        };
        FridaActivity4InnerClass.check5.implementation = function(){
            return true;
        };
        FridaActivity4InnerClass.check6.implementation = function(){
            return true;
        };

    });
}


function call_FridaActivity4_hookmulclass(){
    Java.perform(function(){
        var classname = "com.example.androiddemo.Activity.FridaActivity4$InnerClasses";
        var FridaActivity4InnerClass =Java.use(classname);
        //console.log(FridaActivity4InnerClass.class.getDeclaredMethods());
        var allMethods = FridaActivity4InnerClass.class.getDeclaredMethods();
        for(var i = 0; i< allMethods.length ;i++)
        {
            console.log(allMethods[i]);
            var method = allMethods[i];
            var methodStr = method.toString();
            //字符串处理
            var substring = methodStr.substr(methodStr.indexOf(classname) + classname.length + 1);
            var methodname = substring.substr(0,substring.indexOf("("));
            console.log(methodname);
            FridaActivity4InnerClass[methodname].implementation = function (){
                console.log("hook mul function\n",this);
                return true;
            }
        }
    });
}
//hook动态加载的类
function call_FridaActivity5_hookdyndex()
{
    Java.perform(function(){
        var FridaActivity5 = Java.use("com.example.androiddemo.Activity.FridaActivity5");
        Java.choose("com.example.androiddemo.Activity.FridaActivity5",{
            onMatch : function (instance){
                console.log(instance.getDynamicDexCheck().$className);
             },onComplete: function(){

            }
        });

        Java.enumerateClassLoaders({
            onMatch : function(loader){
                try {
                    if(loader.findClass("com.example.androiddemo.Dynamic.DynamicCheck"))
                    {
                        console.log(loader);
                        Java.classFactory.loader = loader;
                    }                    
                } catch (error) {
                    
                }
            },
            onComplete : function(){

            }
        });
        var DynamicCheck = Java.use("com.example.androiddemo.Dynamic.DynamicCheck");
        console.log(DynamicCheck);
        DynamicCheck.check.implementation = function (){
            console.log("DynamicCheck.check");
            return true;
        }

    });
}


function call_FridaActivity6()
{
    Java.perform(function(){
        console.log(com.example.androiddemo.Activity.Frida6);
        var Frida6Class0 = Java.use("com.example.androiddemo.Activity.Frida6.Frida6Class0");
        Frida6Class0.check.implementation = function (){
            return true;
        };
        var Frida6Class1 = Java.use("com.example.androiddemo.Activity.Frida6.Frida6Class1");
        Frida6Class1.check.implementation = function (){
            return true;
        };
        var Frida6Class2 = Java.use("com.example.androiddemo.Activity.Frida6.Frida6Class2");
        Frida6Class2.check.implementation = function (){
            return true;
        };
    });
}

function call_FridaActivity6_mulclass()
{
    Java.perform(function(){
        Java.enumerateLoadedClasses({
            onMatch: function(name ,handle){
                if(name.indexOf("com.example.androiddemo.Activity.Frida6") >= 0){
                    console.log(name);
                    var tmp = Java.use(name);
                    tmp.check.implementation = function(){
                        console.log("Frida6 Check");
                        return true;
                    }
                }
            },
            onComplete : function()
            {

            }
        });
    });
}
function main()
{
    hook_java();
}

setImmediate(main);
