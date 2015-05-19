/*
56宝宝h5页，第三方登录
*/
$(function() {
    var userId = baby56.getUrlParams('userId');
    var role = baby56.getUrlParams('role');
    $('.waya').on('click', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        var type = $(this).data('type');
        if(type) {
            location.href = 'http://baby.56.com/userinfo/dispatcher.do?type='+type+'&state='+userId+'&form=h&role='+role;
        } else {
            location.href = '../html/login.html?userId=' + userId + '&role=' + role;
        }
    });
});
