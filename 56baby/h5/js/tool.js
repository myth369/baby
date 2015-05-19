function log(msg) {
    console && console.log(msg);
}

var downloadAppUrl = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.baby56';
var baby56 = {
    replaceStr : function(str, map) {
        return str.replace(/\{(\w+)(?:-(\w+))?\}/g, function (res, $1, $2) {
            var proc = map[$1];
            return proc || '';
        })
    },
    getUrlParams : function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return r[2]; return null;
    },
    setHref : function($html) {
        var aist = baby56.getUrlParams('isappinstalled');
        var isAndroid=navigator.userAgent.match(/android/ig),
        isIos=navigator.userAgent.match(/iphone|ipod/ig),
        isIpad=navigator.userAgent.match(/ipad/ig),
        weixin=navigator.userAgent.match(/MicroMessenger/ig),
        aurl = '';
        
        if(!weixin){
            if(isAndroid){
                aurl = androidUrl
            } else if(isIos||isIpad){
                aurl = '';
            }
            if(aist=='1'){
                aurl = '';
            }
        }else{
            aurl='';
            if(aist=='1'){
                aurl = '../html/jump1.html';
            }
        }

        if(aist=='1'){
            $html.html('打开');
        }

        $html.attr('href', aurl);
    },
    /**
     * 下载APP
    // if (/(iphone|itouch|ipad|ios)/.test(navigator.userAgent.toLowerCase())) {
    //     window.location.href = "pbwc://index";
    //     setTimeout(function() {
    //         window.location.href = "https://xxx";
    //     }, 30);
    // }
     */
    downloadApp : function() {
        var isAndroid=navigator.userAgent.match(/android/ig),
        isIos=navigator.userAgent.match(/iphone|ipod/ig),
        isIpad=navigator.userAgent.match(/ipad/ig),
        weixin=navigator.userAgent.match(/MicroMessenger/ig),
        downloadUrl = downloadAppUrl;
            
        if(downloadUrl){
            window.location = downloadUrl;
        }
    }
}