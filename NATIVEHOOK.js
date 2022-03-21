function hook_java()
{
    Java.perform(function(){
        var MyApp = Java.use("com.gdufs.xman.MyApp");
        MyApp.saveSN.implementation = function(str){
            console.log("savesn:",str);
            this.saveSN(str);
        }

        var proc = Java.use("android.os.Process");
        proc.killProcess.implementation = function(pid){
            console.log("kill pid:",pid);
        }
    });
}

function hook_native()
{
    var base_jni = Module.findBaseAddress("libmyjni.so");
    var n2 = Module.findExportByName("libmyjni.so","n2");
    console.log("base:",base_jni," n2:",n2);
    if (base_jni!=null) {
        Interceptor.attach(n2,{
            onEnter : function(args){
                console.log("n2 onEnter:",args[0],args[1],args[2]);
            },
            onLeave : function(retval){
                
            }
        })
    }
}

function hook_libart()
{
    //symbol   (no checkjni)
    var module_libart = Process.findModuleByName("libart.so");
    //or?const hooks = Module.load('libc.so');   var Symbol = hooks.enumerateSymbols();
    var symbols = module_libart.enumerateSymbols();
    
    var addr_GetStringUTFChars = null;
    var addr_FindClass = null;
    var addr_GetStaticFieldID = null;
    var addr_SetStaticIntField = null;

    for(var i = 0; i < symbols.length;i++)
    {
        if (symbols[i].name.indexOf("art") != -1) {
            if (symbols[i].name.indexOf("CheckJNI") == -1) {
                if (symbols[i].name.indexOf("GetStringUTFChars") != -1) {
                    addr_GetStringUTFChars = symbols[i].address;
                    console.log(symbols[i].name,addr_GetStringUTFChars);
                }
                if (symbols[i].name.indexOf("art3JNI9FindClass") != -1) {
                    addr_FindClass = symbols[i].address;
                    console.log(symbols[i].name,addr_FindClass);
                }
                if (symbols[i].name.indexOf("GetStaticFieldID") != -1) {
                    addr_GetStaticFieldID = symbols[i].address;
                    console.log(symbols[i].name,addr_GetStaticFieldID);
                }
                if (symbols[i].name.indexOf("SetStaticIntField") != -1) {
                    addr_SetStaticIntField = symbols[i].address;
                    console.log(symbols[i].name,addr_SetStaticIntField);
                }

            }
        }
    }
    //print str 
    
    //print so stack  :  FUZZY and ACCURATE两种方式
    if (addr_GetStringUTFChars) {
        Interceptor.attach(addr_GetStringUTFChars,{
            onEnter : function(args){
                // console.log('addr_GetStringUTFChars onEnter called from:\n' +
                //     Thread.backtrace(this.context, Backtracer.FUZZY)
                //         .map(DebugSymbol.fromAddress).join('\n') + '\n');
            },
            onLeave : function(retval){
                console.log("GetStringUTFChars:",ptr(retval).readCString())
            }
        });
    }
    
    if (addr_FindClass) {
        Interceptor.attach(addr_FindClass,{
            onEnter : function(args){
                console.log("FindClass Arg:", ptr(args[1]).readCString());
            },
            onLeave : function(retval){
            }
        });
    }
    
    if (addr_GetStaticFieldID) {
        Interceptor.attach(addr_GetStaticFieldID,{
            onEnter : function(args){
                console.log("GetStaticFieldID Arg3:", ptr(args[2]).readCString(),"Arg4:",ptr(args[3]).readCString());
            },
            onLeave : function(retval){
            }
        });
    }
    
    if (addr_SetStaticIntField) {
        Interceptor.attach(addr_SetStaticIntField,{
            onEnter : function(args){
                console.log("SetStaticIntField Arg4:",args[3]);
            },
            onLeave : function(retval){
            }
        });
    }
    //hook findclass getstaticfiledid 
    
    
}

function hook_libc()
{
    //strcmp(or hook lib import)
    var addr_strcmp =  Module.findExportByName("libc.so","strcmp");
    Interceptor.attach(addr_strcmp,{
        onEnter: function(args){
            var str_dst = ptr(args[1]).readCString();
            if (str_dst == "EoPAoY62@ElRD") {
                console.log("strcmp:", ptr(args[0]).readCString(),
                    ptr(args[1]).readCString());
            }
        }
    });
}

function writefile()
{   
    //frida api write file
        //frida 的api来写文件
        var file = new File("/sdcard/reg.dat", "w");
        file.write("EoPAoY62@ElRD");
        file.flush();
        file.close();
}
function writefile2()
{   
    //frida native function write file
    var addr_fopen =  Module.findExportByName("libc.so","fopen");
    var addr_fputs =  Module.findExportByName("libc.so","fputs");
    var addr_fclose =  Module.findExportByName("libc.so","fclose");

    console.log("addr file api:",addr_fopen,addr_fputs,addr_fclose);

    var fopen = new NativeFunction(addr_fopen,"pointer",["pointer","pointer"]);
    var fputs = new NativeFunction(addr_fputs,"int",["pointer","pointer"]);
    var fclose = new NativeFunction(addr_fclose,"int",["pointer"]);

    var filename = Memory.allocUtf8String("/sdcard/reg.dat");
    var open_type = Memory.allocUtf8String("w+");
    var handle = fopen(filename,open_type);

    var buffer = Memory.allocUtf8String("EoPAoY62@ElRD");
    var ret = fputs(buffer,handle);
    fclose(handle);
}

function main()
{
    hook_java();
    hook_native();
    hook_libart();
    hook_libc();
}

setImmediate(main);
