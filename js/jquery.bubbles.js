jQuery.noConflict();
(function($) {
    $.fn.bubbles = function(options) {
        var defaults = {
            data: [
                { id: 1, pid: 0, title: "title1", subtitle: "subtitle1", content: "content1", subpostion: [], active: true },
                { id: 2, pid: 1, title: "title2", subtitle: "subtitle1", content: "", subpostion: [], active: false },
                { id: 3, pid: 1, title: "title3", subtitle: "subtitle1", content: "", subpostion: [], active: false },
                { id: 4, pid: 2, title: "title4", subtitle: "subtitle1", content: "", subpostion: [], active: false,callbackclick:showInfo}
            ],
            basesize: 150,
            foreground: '#000',
            backgrounds: ['color-1', 'color-2', 'color-3', 'color-4']
        };
        var opts = $.extend(defaults, options);

        const theme = "<div class='bubbles'></div>";
        const itemTheme = "<div class='item-wrap animated bounceIn'><div class='item-content'><h2>[title]</h2><h3>[subtitle]</h3><p>[content]</p></div></div>";
        var target = this;
        var html = $(theme);
        const itemPerfix = "b_i_";


        /*for (var i = 0; i < opts.data.length; i++) {
            create(opts.data[i], this);
        }*/

        from(opts.data)
            .where(function(value) {
                return value.pid == 0;
            })
            .each(function(value) {
                add(value, null);


            });


        $(target).html(html);

        $(".bubbles").on('click', '.item-wrap', function(e) {
            var itemId = $(this).attr('id').replace(itemPerfix, '');

            var Obj = {};
            from(opts.data)
                .where(function(value) {
                    return value.id == itemId;
                })
                .each(function(value) {
                    Obj = value;
                });

            //remove all active
            $(".item-wrap").each(function(index, el) {
                $(el).removeClass('active');
            });

            //set this node to active
            $(this).addClass('active');
            //set parent node to active
            from(opts.data)
                .where(function(value) {

                    return value.id == Obj.pid;
                })
                .each(function(value) {
                    $("#" + itemPerfix + value.id).each(function(index, el) {
                        $(el).addClass('active');
                    });


                });
            //set all son node to active
            from(opts.data)
                .where(function(value) {
                    return value.pid == itemId;
                })
                .each(function(value) {
                    $("#" + itemPerfix + value.id).each(function(index, el) {
                        $(el).addClass('active');
                    });


                });


                //callback click
                if(Obj.callbackclick)
                {
                	Obj.callbackclick('test');
                }

        });

        //递归创建泡泡
        function add(obj, parent) {
            create(obj, parent);
            from(opts.data)
                .where(function(value) {
                    return value.pid == obj.id;
                })
                .each(function(value) {
                    add(value, obj);
                });
        }

      

        function create(obj, parent) {

            var itemHtml = itemTheme;

            //读取参数
            itemHtml = itemHtml.replace('[title]', obj.title).replace('[subtitle]', obj.subtitle).replace('[content]', obj.content);

            var item = $(itemHtml);





            //color
            item = item.addClass(opts.backgrounds[Math.floor(Math.random() * opts.backgrounds.length)]);

            if (obj.active) {
                item = item.addClass("active");
            }


            var r, x, y;
            if (parent == null) {
                //item size
                r = opts.basesize;


                r = r * 1.3;

                //position 
                x = $(target).width() / 2 - r / 2;
                y = $(target).height() / 2 - r / 2;
                obj.x = x;
                obj.y = y;
                obj.r = r;
            } else {


                r = opts.basesize;


                //position
                var pr;
                pr = parent.r;

                //set 8 position for sub-bubbles
                var avPosition = [{
                    x: parent.x + (pr - r) / 2,
                    y: parent.y + pr
                }, {
                    x: parent.x - r,
                    y: parent.y + (pr - r) / 2
                }, {
                    x: parent.x + (pr - r) / 2,
                    y: parent.y - r
                }, {
                    x: parent.x + pr,
                    y: parent.y + (pr - r) / 2
                }, {
                    x: parent.x + pr - (pr / 2 - pr / 2 * Math.sin(2 * Math.PI / 360 * 45)) - (r / 2 - r / 2 * Math.sin(2 * Math.PI / 360 * 45)),
                    y: parent.y + pr - (pr / 2 - pr / 2 * Math.sin(2 * Math.PI / 360 * 45)) - (r / 2 - r / 2 * Math.sin(2 * Math.PI / 360 * 45))
                }, {
                    x: parent.x - r + (pr / 2 - pr / 2 * Math.sin(2 * Math.PI / 360 * 45)) + (r / 2 - r / 2 * Math.sin(2 * Math.PI / 360 * 45)),
                    y: parent.y - r + (pr / 2 - pr / 2 * Math.sin(2 * Math.PI / 360 * 45)) + (r / 2 - r / 2 * Math.sin(2 * Math.PI / 360 * 45))
                }, {
                    x: parent.x - r + (pr / 2 - pr / 2 * Math.sin(2 * Math.PI / 360 * 45)) + (r / 2 - r / 2 * Math.sin(2 * Math.PI / 360 * 45)),
                    y: parent.y + pr - (pr / 2 - pr / 2 * Math.sin(2 * Math.PI / 360 * 45)) - (r / 2 - r / 2 * Math.sin(2 * Math.PI / 360 * 45))
                }, {
                    x: parent.x + pr - (pr / 2 - pr / 2 * Math.sin(2 * Math.PI / 360 * 45)) - (r / 2 - r / 2 * Math.sin(2 * Math.PI / 360 * 45)),
                    y: parent.y - r + (pr / 2 - pr / 2 * Math.sin(2 * Math.PI / 360 * 45)) + (r / 2 - r / 2 * Math.sin(2 * Math.PI / 360 * 45))
                }, ];

                //set a random number to choice witch postion should be used
                var postionNo = Math.floor(Math.random() * 8);


                if (parent != undefined) {
                    while (parent.subpostion.indexOf(postionNo) > -1) {
                        postionNo = Math.floor(Math.random() * 8);
                    }
                    //save postion index to parent array
                    parent.subpostion.push(postionNo);

                }

                x = avPosition[postionNo].x;
                y = avPosition[postionNo].y;
                /*    x = parent.x + pr - (pr / 2 - pr / 2 * Math.sin(2 * Math.PI / 360 * 45)) - (r / 2 - r / 2 * Math.sin(2 * Math.PI / 360 * 45));
                y = parent.y - r + (pr / 2 - pr / 2 * Math.sin(2 * Math.PI / 360 * 45)) + (r / 2 - r / 2 * Math.sin(2 * Math.PI / 360 * 45));
*/
                obj.x = x;
                obj.y = y;
                obj.r = r;

            }

            item = item.css({ "top": y, "left": x, "width": r, "height": r, "font-size": "1em" });
            item = item.attr("id", itemPerfix + obj.id);

            html.append(item);

        }


       




    };

})(jQuery);



 function showInfo(data){
        	alert(data);
        }
