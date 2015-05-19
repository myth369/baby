/*
56宝宝h5页，中间页
*/
$(function() {
    var agent = navigator.userAgent,
        isAndroid = agent.match(/android/ig),
        isIos = agent.match(/iphone|ipod/ig),
        isIpad = agent.match(/ipad/ig),
        isWeixin = (/MicroMessenger/ig).test(agent),
        openurl = '',
        iframe = document.getElementById('ifr');
    if(isIos || isIpad) {
        openurl = openurl || downloadAppUrl;
    }else if(isAndroid) {
        openurl = openurl || downloadAppUrl;
    }

    var jumpImageEl = $('#jumpImg');
    if(isIos || isIpad) {
        jumpImageEl.attr('src', '../css/images/jump-1.jpg');
    }else if(isAndroid) {
        jumpImageEl.attr('src', '../css/images/jump-2.jpg');
    }
    if(!isWeixin) {
        if(openurl){
            window.location = openurl;
        }
    }
});