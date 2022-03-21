
function hook_java()
{
    var ddex = Java.openClassFile("/data/local/tmp/ddex.dex");
    Java.perform(function(){
        ddex.load();
        var system_class = Java.use("java.lang.System");
        system_class.getProperty.overload('java.lang.String').implementation = function (arg1){
            if (arg1 == "user.home") {
                console.log("userhome:" + this.getProperty("user.home"));
                return "Russia";
            }
            return this.getProperty("user.home");
        }

        system_class.getenv.overload('java.lang.String').implementation = function(arg1){
            console.log("user:" + this.getenv("USER"));

            
            return "RkxBR3s1N0VSTDFOR180UkNIM1J9Cg==";
        };
        //hook 构造函数
        var a_init = Java.use("com.tlamb96.kgbmessenger.b.a");
        a_init.$init.implementation = function(i, str, str2, z){
            this.$init(i, str, str2, z);
            console.log("a_init_arg:",i, str, str2, z);
        };

        var decode_class = Java.use("com.example.mytest.Decode");
        console.log("decode:"+decode_class.decode_p());
        console.log("r2hex:"+decode_class.s2hex());
    });
}

function main()
{
    hook_java();
}

setImmediate(main)
