function IncludeJs(jsFile) {
    document.write('<script type="text/javascript" src="/js/' + jsFile + '"></script>');
}

function IncludeConditionalJs(jsFile, browser) {
    document.write('<!--[if ' + browser + ']>');
    IncludeJs(jsFile);
    document.write('<![endif]-->');
}

function getActivityIndicator(el) {
    if (el.find('.activity-indicator').length == 0) {
        //el.append('<div class="activity-indicator"><img src="/portalimage/activity_indicator_m.gif" alt="loading...." /></div>');
        el.append('<div class="activity-indicator">loading</div>');
    }
    return el.find('.activity-indicator');
}

function updateHtmlIfEmpty(element, targetUrl, fn, args) {
    // Führende Whitespaces aus dem String entfernen
    if (element.html().replace(/^\s+/, '').length == 0) {
        updateHtml(element, targetUrl, fn, args);
    }
}

function post(url, params, httpMethod) {
    if (!httpMethod)
    {
        httpMethod = 'post';
    }
    var paramsString = '';
    if (typeof (params) == 'string') {
        var paramsArray = params.split('&');
        for (var i = 0; i < paramsArray.length; i++) {
            var paramPair = paramsArray[i].split('=');
            paramsString += '<input type="hidden" name="' + paramPair[0] + '" value="' + paramPair[1] + '"></input>';
        }
    } else {
        for (var param in params) {
            paramsString += '<input type="hidden" name="' + param + '" value="' + params[param] + '"></input>';
        }
    }
    var form = $('<form method="' + httpMethod + '" action="' + url + '">' + paramsString + '</form>');
    form.appendTo(document.body);
    form.submit();
}

function updateHtml(elem, targetUrl, fn, args) {

    getData(elem, targetUrl, function(data) {
    if (data.exception) {
        elem.html(unescape(data.exception));
    } else {
        elem.html(unescape(data.html));
        // Focus first element if there is any
        //                    if (typeof elem.focus_first == 'function') {
        //                        elem.focus_first();
        //                    }

        if (typeof fn == "function") {
            if (args instanceof Array) {
                args.push(data);
            } else {
                args = new Array(data);
            }
            fn.apply(this, args);
        }
    }
    });
}

function getData(parent, targetUrl, fn, args) {
    try {
        getActivityIndicator(parent).show();
        $.ajax({
            // Because of IE caching problems, we add a random field...see http://viralpatel.net/blogs/2008/12/ajax-cache-problem-in-ie.html
            url: addQueryStringParameter(targetUrl, "randIE=" + Math.random()),
            type: 'GET',
            dataType: "json",
            success: function(data, textStatus, XMLHttpRequest) {
                if (data.redirectUrl) {
                    window.location.href = data.redirectUrl;
                } else {
                    if (typeof fn == "function") {
                        if (args instanceof Array) {
                            args.push(data);
                        } else {
                            args = new Array(data);
                        }
                        fn.apply(this, args);
                    }
                }
                getActivityIndicator(parent).hide();
            },
            failure: function(e) { alert("error! " + e); }
        });
    } catch (e) {
        alert(e);
    }
}

function addQueryStringParameter(url, queryStringParameter) {
    return url + (url.indexOf('?') == -1 ? "?" : "&") + queryStringParameter;
}

function removeAnchor(url) {
    var anchor_index = url.indexOf('#');
    if (anchor_index != -1) {
        return url.substring(0, anchor_index);
    }
    return url;
}

//function submitAjax(formEl, contentEl, httpMethod, fn, args) {
//    try {
//        getActivityIndicator(contentEl).show();
//        var url = formEl.attr('action');
//        if (formEl.attr('enctype') == "multipart/form-data") {
//            // You cannot do AJAX file uploads. They're not supported.
//            formEl.attr('onsubmit', '');
//            formEl.submit();
//            return;
//        }

//        $.ajax({
//            url: url,
//            type: httpMethod,
//            data: formEl.serialize(),
//            dataType: "json",
//            failure: function(e) { alert("error! " + e); },
//            success: function(data, textStatus, XMLHttpRequest) {
//                if (data.exception) {
//                    contentEl.html(unescape(data.exception));
//                } else if (data.redirectUrl) {
//                    window.location.href = data.redirectUrl;
//                } else {
//                    if (typeof fn == "function") {
//                        if (args instanceof Array) {
//                            args.push(data);
//                        } else {
//                            args = new Array(data);
//                        }
//                        fn.apply(this, args);
//                    }
//                }
//                getActivityIndicator(contentEl).hide();
//            }
//        });
//    } catch (e) {
//        alert(e);
//        throw e;
//    }
//}

function hide(elementId) {
    var element = $('#' + elementId).hide();
}

function show(elementId) {
    var element = $('#' + elementId).show();
}

function checkCapsLock( e, warning, dispTime ) {
   var myKeyCode = 0;
   var myShiftKey = e.shiftKey;

   if ( document.all ) {
      // Internet Explorer 4+
      myKeyCode = e.keyCode;
   } else if ( document.getElementById ) {
      // Mozilla / Opera / etc.
      myKeyCode = e.which;
   }

   if ((myKeyCode >= 65 && myKeyCode <= 90 ) || (myKeyCode >= 97 && myKeyCode <= 122)) {
      if (
         // Upper case letters are seen without depressing the Shift key, therefore Caps Lock is on
         ( (myKeyCode >= 65 && myKeyCode <= 90 ) && !myShiftKey )

         ||

         // Lower case letters are seen while depressing the Shift key, therefore Caps Lock is on
         ( (myKeyCode >= 97 && myKeyCode <= 122 ) && myShiftKey )
       )
      {
         warning.show(300);
      }
      else {
         warning.hide();
      }
   }
}

function clearonfocus(element, text) {
    if (element.value == text)
        element.value = "";
}

var pop = null;

function popup(obj, name, width, height) {
    var url = (obj.getAttribute) ? obj.getAttribute('href') : obj.href;
    if (!url) {
        alert('No href element.');
        return true;
    }
    width = (width) ? width += 20 : 150;  // 150px*150px is the default size
    height = (height) ? height += 20 : 150;
    var args = 'width=' + width + ',height=' + height + ',resizable=yes,scrollbars=yes';
    pop = window.open(url, name, args);
    return (pop) ? false : true;
}

function getScreenWidth() {
    var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
    return pixelRatio * screen.width;
}
function getScreenHeight() {
    var pixelRatio = !!window.devicePixelRatio ? window.devicePixelRatio : 1;
    return pixelRatio * screen.height;
}

function shortenText(moreStr, lessStr) {
    $('.shorten').each(function (index) {
        var classes = $(this).attr('class').split(' ');
        for (var i = 0; i < classes.length; i++) {
            var matches = /^l\-(.+)/.exec(classes[i]);
            if (matches != null) {
                var shortLength = parseInt(matches[1]);
                var fullText = $(this).text();
                if (fullText.length > shortLength + 20) {
                    $(this).truncate({
                        max_length: shortLength,
                        more: moreStr,
                        less: lessStr
                    });
                }
            }
        }
    });
}

(function ($) {

    var numericOnlyHandler = function (event) {
        //if (isNaN(this.value)) {
        //    event.preventDefault();
        //    $(this).css("background-color", "red").animate({ backgroundColor: "white" }, { duration: 1500, queue: false });
        //}
        //return;

        // Allow: backspace, delete, tab and escape, CTRL, shift, enter, alt
        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 17 || event.keyCode == 16 || event.keyCode == 13 || event.keyCode == 18)
            return;

        // .
        if (event.keyCode == 190 || event.keyCode == 110)
            return;

        // Allow: Ctrl+A
        if ((event.keyCode == 65 && event.ctrlKey === true) ||
            // Ctrl + V
            (event.keyCode == 86 && event.ctrlKey === true) ||
            // Ctrl + C
            (event.keyCode == 67 && event.ctrlKey === true) ||
            // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }

        // Ensure that it is a number and stop the keypress
        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105)) {
            event.preventDefault();
            $(this).css("background-color", "red").animate({ backgroundColor: "white" }, 1000, null, function () { this.style.backgroundColor = "white"; });
        }
    };

    $.fn.extend({

        numericOnly: function () {
            return this.each(function () {
                $(this).bind('keydown', numericOnlyHandler);
            });
        },

        unbindNumericOnly: function () {
            return this.each(function () {
                $(this).unbind('keydown', numericOnlyHandler);
            });
        }
    });
})(jQuery);

function getParameterByName(name, url) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(url);
    return results == null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function updateQueryStringParameter(key, value, url) {
    var regex = new RegExp("([?|&])" + key + "=.*?(&|$)", "i");
    separator = url.indexOf('?') !== -1 ? "&" : "?";
    if (url.match(regex)) {
        return url.replace(regex, '$1' + key + "=" + value + '$2');
    }
    else {
        return url + separator + key + "=" + encodeURIComponent(value);
    }
}

if (typeof KeyEvent == "undefined") {
    var KeyEvent = {
        DOM_VK_CANCEL: 3,
        DOM_VK_HELP: 6,
        DOM_VK_BACK_SPACE: 8,
        DOM_VK_TAB: 9,
        DOM_VK_CLEAR: 12,
        DOM_VK_RETURN: 13,
        DOM_VK_ENTER: 14,
        DOM_VK_SHIFT: 16,
        DOM_VK_CONTROL: 17,
        DOM_VK_ALT: 18,
        DOM_VK_PAUSE: 19,
        DOM_VK_CAPS_LOCK: 20,
        DOM_VK_ESCAPE: 27,
        DOM_VK_SPACE: 32,
        DOM_VK_PAGE_UP: 33,
        DOM_VK_PAGE_DOWN: 34,
        DOM_VK_END: 35,
        DOM_VK_HOME: 36,
        DOM_VK_LEFT: 37,
        DOM_VK_UP: 38,
        DOM_VK_RIGHT: 39,
        DOM_VK_DOWN: 40,
        DOM_VK_PRINTSCREEN: 44,
        DOM_VK_INSERT: 45,
        DOM_VK_DELETE: 46,
        DOM_VK_0: 48,
        DOM_VK_1: 49,
        DOM_VK_2: 50,
        DOM_VK_3: 51,
        DOM_VK_4: 52,
        DOM_VK_5: 53,
        DOM_VK_6: 54,
        DOM_VK_7: 55,
        DOM_VK_8: 56,
        DOM_VK_9: 57,
        DOM_VK_SEMICOLON: 59,
        DOM_VK_EQUALS: 61,
        DOM_VK_A: 65,
        DOM_VK_B: 66,
        DOM_VK_C: 67,
        DOM_VK_D: 68,
        DOM_VK_E: 69,
        DOM_VK_F: 70,
        DOM_VK_G: 71,
        DOM_VK_H: 72,
        DOM_VK_I: 73,
        DOM_VK_J: 74,
        DOM_VK_K: 75,
        DOM_VK_L: 76,
        DOM_VK_M: 77,
        DOM_VK_N: 78,
        DOM_VK_O: 79,
        DOM_VK_P: 80,
        DOM_VK_Q: 81,
        DOM_VK_R: 82,
        DOM_VK_S: 83,
        DOM_VK_T: 84,
        DOM_VK_U: 85,
        DOM_VK_V: 86,
        DOM_VK_W: 87,
        DOM_VK_X: 88,
        DOM_VK_Y: 89,
        DOM_VK_Z: 90,
        DOM_VK_CONTEXT_MENU: 93,
        DOM_VK_NUMPAD0: 96,
        DOM_VK_NUMPAD1: 97,
        DOM_VK_NUMPAD2: 98,
        DOM_VK_NUMPAD3: 99,
        DOM_VK_NUMPAD4: 100,
        DOM_VK_NUMPAD5: 101,
        DOM_VK_NUMPAD6: 102,
        DOM_VK_NUMPAD7: 103,
        DOM_VK_NUMPAD8: 104,
        DOM_VK_NUMPAD9: 105,
        DOM_VK_MULTIPLY: 106,
        DOM_VK_ADD: 107,
        DOM_VK_SEPARATOR: 108,
        DOM_VK_SUBTRACT: 109,
        DOM_VK_DECIMAL: 110,
        DOM_VK_DIVIDE: 111,
        DOM_VK_F1: 112,
        DOM_VK_F2: 113,
        DOM_VK_F3: 114,
        DOM_VK_F4: 115,
        DOM_VK_F5: 116,
        DOM_VK_F6: 117,
        DOM_VK_F7: 118,
        DOM_VK_F8: 119,
        DOM_VK_F9: 120,
        DOM_VK_F10: 121,
        DOM_VK_F11: 122,
        DOM_VK_F12: 123,
        DOM_VK_F13: 124,
        DOM_VK_F14: 125,
        DOM_VK_F15: 126,
        DOM_VK_F16: 127,
        DOM_VK_F17: 128,
        DOM_VK_F18: 129,
        DOM_VK_F19: 130,
        DOM_VK_F20: 131,
        DOM_VK_F21: 132,
        DOM_VK_F22: 133,
        DOM_VK_F23: 134,
        DOM_VK_F24: 135,
        DOM_VK_NUM_LOCK: 144,
        DOM_VK_SCROLL_LOCK: 145,
        DOM_VK_COMMA: 188,
        DOM_VK_PERIOD: 190,
        DOM_VK_SLASH: 191,
        DOM_VK_BACK_QUOTE: 192,
        DOM_VK_OPEN_BRACKET: 219,
        DOM_VK_BACK_SLASH: 220,
        DOM_VK_CLOSE_BRACKET: 221,
        DOM_VK_QUOTE: 222,
        DOM_VK_META: 224
    };
}