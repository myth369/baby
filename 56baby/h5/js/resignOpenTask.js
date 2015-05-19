/*
56宝宝h5页，OpenTask推广页面
*/
$(function() {
    var key = baby56.getUrlParams('key');
    $('.waya').on('click', function(event) {
        event.preventDefault ? event.preventDefault() : event.returnValue = false;
        var type = $(this).data('type');
        if(type) {
            location.href = 'http://10.10.53.157:8401/userinfo/dispatcher.do?type='+type+'&state='+key+'&form=h&role=100';
        } else {
            location.href = '../html/login.html?userId=' + key + '&role=100';
        }
    });

    // 统计扫码人数
    var url = 'http://10.10.53.157:8401/app/n/task/addSweep.do?key=' + key;
    $.getJSON(url+'&callback=?', function(data){});
});
