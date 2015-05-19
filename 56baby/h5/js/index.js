$(function() {
    var babyInfo = null;
    var photoCount = 0;     // 图片数量(photoCount)用于排版
    var userId = null;      // userId登录时需要
    var role = null;
    function feedData(data) {
        log(data);
        babyInfo = data.msg;
        
        // 1.分享数据被删，显示错误页样式
        // 如果用户只分享了一个视频或者照片，然后被删除了给用户看错误。
        // 如果用户分享了好几个东西  而这几个都被删除了  给用户看错误页
        // 如果用户分享的内容，的娃被删   则给用户看错误页
        userId = babyInfo.userId;
        role = babyInfo.role;
        if(babyInfo.from == 2) {
            if(data.code == 5) {
                invite.renderExpire();
                return;
            }
        } else {
            if(data.code != 200 || !validContents()) {
                share.renderNobaby();
                return;
            }
        }
        render();
    }

    function render() {
        // 最多展示9张图
        photoCount = Math.min(babyInfo.contentlist.length, 9);
        if(babyInfo.baby) {
            babyInfo.baby.age = babyInfo.age;
        }
        
        if(babyInfo.from == 1) {
            share.render();
        } else {
            invite.render();
        }
    }

    var share = {
        render: function(){
            var html = [share.renderTop(), share.renderContent(), renderFoot()].join('');
            $('body').html(html);
            share.addPoster();
            $('.flayer-btn').on('click', baby56.downloadApp);
            // sex:1男2女
            if(babyInfo.baby.sex == 1) {
                $('.user').addClass('user-boy');
            }else {
                $('.user').addClass('user-girl');
            }
            // share.previewImage();
            previewImage.run('.diary');
            // 图片居中方形显示，溢出部分裁剪。
            var loaded = 0,srcLength = $(".diary img").length;
            $(".diary img").each(function(index, item) {
                $(item).on("load", function() {
                    if (++loaded == srcLength) {
                        $(".diary img").centerToCutImage();
                    }
                });
            });
        },
        renderTop : function() {
            var html = [
                '<div class="user rel">',
                '    <img src="../css/images/blank/64x41.png" class="w100b" />',
                '    <div class="user-info w100b abs">',
                '       <h1 class="tac user-name">{name}</h1>',
                '       <div class="user-img"><img src="{scalePic}" data-originsrc="{pic}" alt="图片" /></div>',
                '       <p class="tac days">{age}</p>',
                '    </div>',
                '</div>'
            ];
            babyInfo.baby.scalePic = scaleImage(babyInfo.baby.pic, null, null, '50');
            html = baby56.replaceStr(html.join(''), babyInfo.baby);
            return html;
        },
        renderContent: function(){
            var html = [
                '<div class="diary">',
                '    <div class="diary-time tac"><time class="disib">' + babyInfo.feedtime + '</time></div>',
                '    <article class="art">',
                '        <header>' + share.renderContentHead() + '</header>' + share.renderContentFeed(),
                '    </article>',
                '</div>',
                '<div style="height: 5.6rem;"></div>'
            ];
            return html.join('');
        },
        renderContentHead: function() {
            var html = [
                '<div class="art-info cfix">',
                '    <span class="l">{feedAge}</span>',
                '    <span class="r">{count}</span>',
                '</div>',
                '<h3 class="art-h3 fs14 elli"><a href="">{feedText}</a></h3>'
            ];

            if(!$.isEmptyObject(babyInfo.infotext)) {
                babyInfo.feedText = babyInfo.infotext.feedText;
            }
            html = baby56.replaceStr(html.join(''), babyInfo);
            return html;
        },
        renderContentFeed: function() {
            var docWidth = $(document).width(),
                halfWidth = Math.floor(docWidth/2);

            var html = [],
                boxHtml = [],
                colHtml = [];

            var copyContentlist = babyInfo.contentlist.slice(0, photoCount);

            //0. 所有视频置顶显示(视频两列布局时播放按钮位置无法居中)
            var videos = $.grep(copyContentlist, function(item, index) { return item.contentType == 2; });
            var videoInfo = '';
            var videosLength = videos.length;
            $.each(videos, function(index, item) {
                videoInfo = item.videoCoverUrl ? 'poster="{videoCoverUrl}"' : '';
                boxHtml = [
                    '<div class="photo cf rel" ' + videoInfo + '>',
                    showVrsPlayer({bid:item.videoId ,width: '100%',showCtrlBar:1,sogouBtn:'0',getHTML:1, poster:item.videoCoverUrl}),
                    '</div>'
                ].join('');
                html.push(baby56.replaceStr(boxHtml, item));
            });

            //1. 根据图片数量取得置顶的资源
            var images = $.grep(copyContentlist, function(item, index) { return item.contentType == 1; });
            var spliceIndex = (photoCount - videosLength) % 2 == 0 ? videosLength > 0 ? 0 : 2 : 1;
            var topList = images.splice(0, Math.min(spliceIndex,photoCount));
            $.each(topList, function(index, item) {
                boxHtml = [
                    '<div class="photo cf rel">',
                    '<a href="javascript:void(0);"><img src="{scaleImageUrl}" data-viewsrc="{viewImageUrl}" alt="" class="w100b" /></a>',
                    '</div>'
                ].join('');
                item.scaleImageUrl = scaleImage(item.imageUrl, item.imgWidth, docWidth);
                item.viewImageUrl = scaleImage(item.imageUrl, item.imgWidth, docWidth);
                html.push(baby56.replaceStr(boxHtml, item));
            });

            //2. 左右排列的资源
            var colItems = images.splice(0,2);
            while(colItems.length) {
                boxHtml = ['<div class="photo cf">'];
                $.each(colItems, function(index, item) {
                    colHtml = [
                        '<div class="photo-col ' + (index % 2 == 0 ? 'l' : 'r') + ' rel">',
                        '<a href="javascript:void(0);"><img src="{scaleImageUrl}" data-viewsrc="{imageUrl}" alt="" class="w100b" /></a>',
                        '</div>'
                    ];
                    item.scaleImageUrl = scaleImage(item.imageUrl, item.imgWidth, halfWidth);
                    item.viewImageUrl = scaleImage(item.imageUrl, item.imgWidth, docWidth);
                    boxHtml.push(baby56.replaceStr(colHtml.join(''), item));
                });

                boxHtml.push('</div>');
                html.push(boxHtml.join(''));
                colItems = images.splice(0, 2);
            }

            //3.超过9张图的隐藏
            var otherContentlist = babyInfo.contentlist.slice(photoCount);
            if(otherContentlist.length) {
                boxHtml = ['<div style="display:none;">']; 
                $.each(otherContentlist, function(index, item) {
                    if(item.contentType == 1) {
                        colHtml = '<img src="{scaleImageUrl}" data-viewsrc="{imageUrl}" alt="" style="display:none;" />'
                        item.scaleImageUrl = scaleImage(item.imageUrl, item.imgWidth, halfWidth);
                        item.viewImageUrl = scaleImage(item.imageUrl, item.imgWidth, docWidth);
                    }
                    boxHtml.push(baby56.replaceStr(colHtml, item));
                });
                boxHtml.push('</div>');
                html.push(boxHtml.join(''));
            }

            return html.join('');
        },
        addPoster: function() {
            var flag = false,
                $boxs = $('[poster]'),
                $videos;

            $boxs.find('div[id]').each(function(index, item){
                var width = $(item).width() + 'px';
                $(item).css({
                    height: width,
                    lineHeight: width
                });
            });
            var timeId = setInterval(function(){
                $videos = $boxs.find('video');
                if($videos.length && $videos.length == $boxs.length) {
                    $.each($videos, function(index, item){
                        $(item).attr('poster', $(item).parents('[poster]').attr('poster'));
                        var width = $(item).width() + 'px';
                        var cssObj = {
                            height: width,
                            lineHeight: width
                        }
                        $(item).css(cssObj);
                        // $(item).parent().css(cssObj);
                    });
                    flag = true;
                }

                if(flag){
                    clearInterval(timeId);
                }
            }, 500);
        },
        renderNobaby: function() {
            var html = [
                '<div class="error tac abs w100b">',
                '    <img src="../css/images/error.png" class="error-ico" />',
                '    <p>阿哦~分享的内容</p>',
                '    <p>已被删除或屏蔽</p>',
                '</div>'
            ].join('');
            $('body').html(html);
        }
    }

    var invite = {
        searchUrl : 'http://baby.56.com/app/n/userinfo/search.do?userId={userId}',    
        render: function(){
            var html = [invite.renderTop(), invite.renderContent(), renderFoot()].join('');
            $('body').html(html);
            invite.getUserInfo();
            // sex:1男2女
            if(babyInfo.baby.sex == 1) {
                $('.yao').addClass('yao-boy');
            }else {
                $('.yao').addClass('yao-girl');
            }
        },
        renderTop : function() {
            var html = [
                '<div class="yao rel cf">',
                '    <div class="yao-img">',
                '        <span class="yao-imgbd disb"><img id="headpic" alt="图片" src="../css/images/temp/150x150_1.jpg" class="yao-imgpic w100b"></span>',
                '    </div>',
                '    <div class="yao-tex">',
                '        <p><span id="nickname"></span> (ID号：<span class="orange">' + babyInfo.userId + '</span>)<br>',
                '        在56宝宝上邀请你成为亲友</p>',
                '    </div>',
                '</div>'
            ].join('');
            return html;
        },
        renderContent: function(){
            return '<img src="../css/images/reg.png" alt="" class="w100b">';
        },
        renderExpire: function() {
            var html = [
                '<div class="error tac abs w100b">',
                '    <img src="../css/images/error.png" class="error-ico" />',
                '    <p>邀请链接已失效，</p>',
                '    <p>请联系邀请人重新发送邀请</p>',
                '</div>'
            ].join('');
            $('body').html(html);
        },
        getUserInfo: function() {
            var url = baby56.replaceStr(invite.searchUrl, {userId: babyInfo.userId});
            $.getJSON(url+'&callback=?', function(data){
                invite.showUserInfo(data);
            });
        },
        showUserInfo: function(userInfo) {
            log(userInfo);
            if(!userInfo.status) {
                $('#headpic').attr('src', userInfo.headpic);
                $('#nickname').html(userInfo.nickname);
            }
        }
    }

    function renderFoot(){
        var html = [
            '<div class="flayer w100b">',
            '    <div class="flayer-bg w100b"></div>',
            '    <div class="flayer-con abs cf">',
            '        <img src="../css/images/56baby.png" class="flayer-img l" />',
            '        <div class="ttxt rel l">',
            '            <h6>56宝宝</h6>',
            '            <p class="txt">记录宝宝美好时光</p>',
            '        </div>',
            babyInfo.from === 1 ? '<a href="javascript:void(0);" class="flayer-btn r">下载</a>' : '<a href="../html/resign.html?userId='+userId+'&role='+role+'" class="flayer-btn r">登录接受邀请</a>',
            '    </div>',
            '</div>'
        ];

        return html.join('');
    }

    // contentlist无正常(status:0)数据时，根据from来源显示对应的错误页面renderNobaby
    function validContents() {
        if(babyInfo.contentlist) {
            babyInfo.contentlist = $.grep(babyInfo.contentlist, function(item, index) {
                return item.status == 0;
            });
            return babyInfo.contentlist.length > 0
        }
        return false;
    }
    
    /**
     * 图片压缩
     * src图片地址 
     * scaleNum压缩比例
     */
    function scaleImage(src, imagewidth, showWidth, scaleNum) {
        scaleNum = scaleNum || 100;
        imagewidth = ~~imagewidth;
        if (imagewidth*0.25 > showWidth) {
            scaleNum = 25;
        } else if (imagewidth*0.5 > showWidth) {
            scaleNum = 50;
        } else if (imagewidth*0.75 > showWidth) {
            scaleNum = 75;
        }
        var reg = /.(jpg|png)/g;
        // return src;
        return src.replace(reg, '/cut@m=scale,r=' + scaleNum + '.$1');
    }

    function init() {
        var feedcode = baby56.getUrlParams('feedcode');
        var url = 'http://baby.56.com/app/n/feed/link.do?feed=' + encodeURIComponent(feedcode);
        $.getJSON(url+'&callback=?', function(data){
            feedData(data);
        });
    }
    init();

});

// 图片居中方形显示，溢出部分裁剪。
(function($){
    $.fn.centerToCutImage = function(options) {
        var that = $(this);
        var defaults={
            "width":null,
            "height":null
        };
        var opts = $.extend({},defaults,options);

        function calcuSize() {
            return that.each(function() {
                var $this = $(this);
                var objHeight = $this.height(); //图片高度
                var objWidth = $this.width(); //图片宽度
                var parentHeight = opts.height||$this.parent().height(); //图片父容器高度
                var parentWidth = opts.width||$this.parent().width(); //图片父容器宽度
                $this.parent().css({'height': parentWidth});

                if(objHeight > objWidth) {
                    $this.css("top", ~(objHeight - objWidth) / 2);
                } else {
                    var ratio = objHeight / objWidth;
                    var newHeight = parentWidth;
                    var newWidth = newHeight / ratio;
                    $this.width(newWidth);
                    $this.height(newHeight);
                    $this.css("left", ~(newWidth - newHeight) / 2);
                }
            });
        }
        $(window).on('resize', function() {
            calcuSize();
        });
        return calcuSize();
    };
})($);
