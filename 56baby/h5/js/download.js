/*
56宝宝h5页，下载客户端
*/
$(function() {
    var userId = baby56.getUrlParams('userId');
    var searchUrl = 'http://baby.56.com/app/n/userinfo/search.do?userId={userId}';

    var url = baby56.replaceStr(searchUrl, {userId: userId});
    $.getJSON(url+'&callback=?', function(data){
        showname(data);
    });

    function showname(userInfo) {
        if(!userInfo.status) {
            $('.nickname').html(userInfo.nickname);
            $('#userId').html(userInfo.uid || userId);
        }
    }

    $('#downloadBtn').on('click', function() {
        baby56.downloadApp();
    });
});