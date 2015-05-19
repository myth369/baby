(function (window, document, Math) {

    function IPreviewImage(el, options) {
        var me = this;
        me.range = typeof el == 'string' ? document.querySelector(el) : el;
        var regex = /.+\.(gif|jpe?g|png|webp)/i;

        this.options = {};

        for ( var i in options ) {
            this.options[i] = options[i];
        }
        var tags = me.range.querySelectorAll('img');
        tags = [].filter.call(tags, function(element) {
            return regex.test(element.src);
        });

        var imagesMap = tags;
        // imagesMap.push(tags);


        this._init();

        [].forEach.call(imagesMap, function(imageElement, imageIndex) {
            bind(imageElement, 'click', function() {
                me.wrapper.style.display = 'block';
                
            });
        }); 

        var photoScroll = new IScroll('.previewImage-wrap', {
            scrollX: true,
            scrollY: false,
            momentum: false,
            snap: 'li',
            snapSpeed: 600,
            snapThreshold: 0.08,
            click: true
        });

        window.onresize = function() {
            photoScroll.refresh();
        };
    }

    IPreviewImage.prototype = {
        version: '5.1.3',
        _init: function() {
            var me = this;
            var innerWidth = window.innerWidth;
            var innerHeight = window.innerHeight;
            var previewHTML = [
                '<div class="previewImage-wrap" style="height: 100%;margin: 0;padding: 0 !important;box-sizing: border-box;position: relative;max-height: 100%;">',
                '<ul class="previewImage" style="width:'+(innerWidth*3)+'px;">',
                '    <li>',
                '        <div class="img-wrap" style="width:'+innerWidth+'px;height:'+innerHeight+'px;">',
                '            <img src="../css/images/jump-1.jpg"  width="100%" alt="中间页" id="jumpImg" data-src="123"/>',
                '        </div>',
                '    </li>',
                '    <li>',
                '        <div class="img-wrap" style="width:'+innerWidth+'px;height:'+innerHeight+'px;">',
                '            <img src="../css/images/jump-1.jpg"  width="100%" alt="中间页" id="jumpImg" data-src="123"/>',
                '        </div>',
                '    </li>',
                '    <li>',
                '        <div class="img-wrap" style="width:'+innerWidth+'px;height:'+innerHeight+'px;">',
                '            <img src="../css/images/jump-1.jpg"  width="100%" alt="中间页" id="jumpImg"/>',
                '        </div>',
                '    </li>',
                '</ul>',
                '</div>'
            ];
            me.wrapper = create('div');
            me.wrapper.className = 'currentPhoto';

            me.wrapper.innerHTML = previewHTML.join('');
            document.getElementsByTagName('body')[0].appendChild(me.wrapper);
            
            me.wrapper.addEventListener('click', function() {
                me.wrapper.style.display = 'none';
            });
        }
    }

    function bind(element, event, callback) {
        if(element.addEventListener)
            element.addEventListener(event, callback, false);
        else // IE8 fallback
            element.attachEvent('on' + event, callback);
    }

    function getByID(id) {
        return document.getElementById(id);
    }

    function create(element) {
        return document.createElement(element);
    }
    
    if ( typeof module != 'undefined' && module.exports ) {
        module.exports = IPreviewImage;
    } else {
        window.IPreviewImage = IPreviewImage;
    }
})(window, document, Math)
