'use strict';

import 'bootstrap-select';
import 'scrolltofixed';
import 'jquery-pjax';
import twemoji from 'twemoji';
import * as Actions from './actions.js';

import Util from './util.js';
import {default as Dialog} from './dialog.js';

//固定模块
(function($){
    //固定导航
    // $('[data-role="navbar"]').scrollToFixed();
    $('[data-sticky]').scrollToFixed({
        marginTop: 60
    });
})($);

//用户quick plate
(function($){
    let userPlateDialogs = {};
    let timer;
    $('[data-plate]').on('mouseover', function(){
        //关闭所有的dialog
        _.forEach(_userPlateDialogs, function(dialog){
            dialog.close();
        });
        const $this = $(this);
        const userId = $this.data('id');
        clearTimeout(timer);
        //如果已经创建则直接开启
        if (typeof userPlateDialogs[userId] !== 'undefined') {
            if (!userPlateDialogs[userId].open) {
                userPlateDialogs[userId].show($this[0]);
            }
            return false;
        }
        let htmlContent = 'loading...';
        const dialog = new Dialog({
            id: 'dialog_' + userId,
            align: 'top left',
            content: htmlContent,
        });
        $(dialog.node).hover(function(){
            clearTimeout(timer);
        }, function(){
            dialog.close();
        });
        dialog.show($this[0]);
        Util.request('user.plate', userId, function(html){
            dialog.content(html);
        });
        userPlateDialogs[userId] = dialog;
    }).on('mouseout', function(){
        const userId = $(this).data('id');
        if(typeof _userPlateDialogs[userId] !== 'undefined'){
            timer = setTimeout(function(){
                userPlateDialogs[userId].close();
            }, 500);
        }
    });
})($);


/**
 * 未读消息
 */
(function(){
    const $notificationNumber = $('#notification-number');
    if ($notificationNumber.length > 0) {
        const originalDocumentTitle = document.title;
        setInterval(() => {
            Util.request('notification.count').done((response) => {
                if (response.count > 0) {
                    $notificationNumber.text(response.count).attr('data-number', response.count);
                    document.title = `(${response.count}) ` + originalDocumentTitle;
                } else {
                    $notificationNumber.removeAttr('data-number');
                }
            });
        }, 20000);
    }
})($);

//初始化follow
const $document = $(document);
new Actions.FollowUserIntialization($document);
new Actions.FollowCategoryIntialization($document);

//Emoji 渲染
twemoji.parse(document.body);