/*
56宝宝h5页，手机登陆
*/
$(function() {
    var getCodeUrl = 'http://10.10.53.157:8401/app/n/userinfo/getcode.do?phone={phone}';
    var thirdloginUrl = 'http://10.10.53.157:8401/userinfo/thridlogin.do?phone={phone}&code={code}&state={state}';
    var userId = baby56.getUrlParams('userId');
    var role = baby56.getUrlParams('role');
    log(userId);
    log(role);

    var msg = {
        MOBILE_EMPTY_ERROR: '手机号码不能为空',
        MOBILE_FORMAT_ERROR: '手机号码格式错误，请重新输入',
        CODE_EMPTY_ERROR: '验证码不能为空'
    };

    function isPhone(val){
        var phoneIsOk = false;
        var phoneOne = {
            //中国移动
            cm: /^(?:0?1)((?:3[56789]|5[0124789]|8[278])\d|34[0-8]|47\d)\d{7}$/,
            //中国联通
            cu: /^(?:0?1)(?:3[012]|4[5]|5[356]|8[356]\d|349)\d{7}$/,
            //中国电信
            ce: /^(?:0?1)(?:33|53|8[079])\d{8}$/,
            //中国大陆
            cn: /^(?:0?1)[3458]\d{9}$/
        };
        for(var i in phoneOne) {
            if(phoneOne[i].test(val)) {
                phoneIsOk = true;
                break;
            }
        }
        return phoneIsOk;
    }

    function bindEvent() {
        $('#phone,#phoneCode').on('input', function() {
            if($('#phone').val() && $('#phoneCode').val()) {
                $('#loginBtn').removeClass('disable');
            } else {
                $('#loginBtn').addClass('disable');
            }
        });

        $('#getCodeBtn').on('click', function() {
            if($(this).hasClass('disable') || !validPhone()) {
                return;
            }

            $.ajax({
                type: 'GET',
                url: baby56.replaceStr(getCodeUrl, {
                    phone: $('#phone').val()
                }),
                dataType : 'jsonp',
                jsonpCallback: 'getcode'
            });
        });

        $('#loginBtn').on('click', function() {
            if($(this).hasClass('disable') || !validPhone() || !validCode()) {
                return;
            }

            $.ajax({
                type: 'GET',
                url: baby56.replaceStr(thirdloginUrl, {
                    phone: $('#phone').val(),
                    code: $('#phoneCode').val(),
                    state: 'h_4_' + role + '_' + userId
                }),
                dataType : 'jsonp',
                jsonpCallback: 'thirdlogin'
            });
        });
    }

    function getcode(data) {
        // status：状态 1 参数错误   2 发送失败 3 调用频繁拒绝
        var status = data.status;
        switch(status) {
            case 0:
                log('验证码发送成功');
                waitToGetcode();
                break;
            case 1:
                $('#phone_error').html('参数错误').show();
                break;
            case 2:
                $('#phone_error').html('发送失败').show();
                break;
            case 3:
                $('#phone_error').html('操作频繁，60秒后再试').show();
                break;
            default:
                $('#phone_error').html('').hide();
                break;
        }
    }

    var min = 59;
    var timer = null;
    function waitToGetcode() {
        var $codeBtn = $('#getCodeBtn');
        $codeBtn.addClass('disable').html(min);
        timer = setInterval(function() {
            if(min == 0 && timer) {
                clearInterval(timer);
                min = 59;
                $codeBtn.removeClass('disable').html('获取验证码');
                return;
            }
            $codeBtn.html(--min);
        }, 1000);
    }

    function thirdlogin(data) {
        var status = data.status;
        switch(status) {
            case 0:
                location.href = '../html/download' + (role == 100 ? 'OpenTask' : '') + '.html?userId=' + userId;
                break;
            case 1:
                $('#phonecode_error').html('参数错误').show();
                break;
            case 2:
                $('#phonecode_error').html('验证码错误').show();
                break;
            default:
                $('#phonecode_error').html('').hide();
                break;
        }
    }

    function validPhone() {
        var phone = $('#phone').val();
        if(!phone) {
            $('#phone_error').html(msg.MOBILE_EMPTY_ERROR).show();
            return false;
        } else if(!isPhone(phone)) {
            $('#phone_error').html(msg.MOBILE_FORMAT_ERROR).show();
            return false;
        } else {
            $('#phone_error').hide();
            return true;
        }
    }

    function validCode() {
        var code = $('#phoneCode').val();
        if(!code) {
            $('#phonecode_error').html(msg.CODE_EMPTY_ERROR).show();
            return false;
        } else {
            $('#phonecode_error').hide();
            return true;
        }
    }

    function init() {
        bindEvent();
    }
    init();
    window.getcode = getcode;
    window.thirdlogin = thirdlogin;
});
