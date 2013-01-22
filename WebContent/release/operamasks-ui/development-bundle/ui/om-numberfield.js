/*
 * operamasks-ui omNumberField 0.1
 *
 * Copyright 2011, AUTHORS.txt (http://ui.operamasks.org/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://ui.operamasks.org/license
 *
 * http://ui.operamasks.org/docs/
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 */
(function($) {
    
    // 设置小数精度
    var fixPrecision = function(value, c, p) {
        var v = value.indexOf("."),n;       
        if (isNaN(value) && value != ".") {
            for (; isNaN(value);) {
                value = value.substring(0, value.length - 1);
            }
        }
        if(!p.allowNegative && (n=value.indexOf("-"))!= -1){
        	var array=value.split("-");
        	value=array.join("");
        }
        if(!p.allowDecimals&&v!=-1){
            return value.substring(0, v);
         }
        
        if(v!=-1){
            value=value.substring(0,v+p.decimalPrecision+1);
        }
        return value;
        
    };

    /** 
     * @name omNumberField
     * @author 王璠
     * @class 数字输入框组件，只能输入数字，字符自动过滤掉。<br/>
     * @constructor
     * @description 构造函数. 
     * @param p 标准config对象：{}
     * @example
     * $('numberFielddiv').omNumberField({decimalPrecision:3});
     */
    $.widget("om.omNumberField", {
        options: /** @lends omNumberField.prototype */ 
        {
            /**
             * 是否允许输入小数。
             * @default true
             * @type Boolean
             * @example
             * $('#input').omNumberField({allowDecimals:true});
             */
            allowDecimals: true,  //是否允许输入小数
            /**
             * 是否允许输入负数。
             * @default true
             * @type Boolean
             * @example
             * $('#input').omNumberField({allowNegative:true});
             */
            allowNegative: true,  //是否允许输入负数
            /**
             * 精确到小数点后几位。
             * @default 2
             * @type Number
             * @example
             * $('#input').omNumberField({decimalPrecision:2});
             */
            decimalPrecision: 2, //精确到小数点后几位
            /**
             * 是否禁用组件。
             * @default false
             * @type Boolean
             * @example
             * $('#input').omNumberField({disabled:true});
             */
            disabled: false,
            /**
             * 是否只读。
             * @default false
             * @type Boolean
             * @example
             * $('#input').omNumberField({readOnly:true});
             */
            readOnly: false            
        },

        _create : function() {
            // 允许输入的字符
            var options = this.options;
            this.element.addClass('om-numberfield om-widget om-state-default om-state-nobg');

            if (typeof options.disabled !== "boolean") {
                this.options.disabled = this.element.prop("disabled");
            }

            if (typeof options.readOnly !== "boolean") {
                this.options.readOnly = this.element.attr("readOnly");
            }

            if (this.element.is(":disabled")) {
                this.options.disabled = true;
            }
            this.element.bind('keypress',function(e) {
                if (e.which == null && (e.charCode != null || e.keyCode != null)) {
                    e.which = e.charCode != null ? e.charCode : e.keyCode;
                }
                var k = e.which;
                if (k === 8 || (k == 46 && e.button == -1) || k === 0) {
                    return;
                }
                var character = String.fromCharCode(k);
                $.data(this,"character",character);
                var value = $(this).val()+character;
                var allowed = $.data(this, "allowed");
                if (allowed.indexOf(character) === -1||($(this).val().indexOf("-") !== -1 && character == "-")
                        || ($(this).val().indexOf(".") !== -1 && character == ".")) {
                    e.preventDefault();
                }
            }).bind('focus',function(){
               $(this).addClass('om-state-focus');
            }).bind('blur',function(){
                $(this).removeClass('om-state-focus');
               var character = $.data(this,"character");
               this.value=fixPrecision(this.value, character, options)
            }).bind('mouseenter mouseout',function(){      
                $(this).toggleClass("om-state-hover");
            });
            this._setOption("disabled", options.disabled);
        },

        _setOption : function(key, value) {
          //  $.Widget.prototype._setOption.apply(this, arguments);
            this._buildAllowChars();
            if (key === "disabled") {
                if (value) {
                    this.element.attr("disabled", true);
                   // this.element.removeClass("om-state-nobg");
                    this.element.addClass("om-numberfield-disabled");
                } else {
                    this.element.attr("disabled", false);
                    this.element.removeClass("om-numberfield-disabled");
                }
                return;
            }
        },

        _buildAllowChars : function() {
            var allowed = "0123456789";

            // 允许输入的字符
            if (this.options.allowDecimals) {
                allowed = allowed + ".";
            }
            if (this.options.allowNegative) {
                allowed = allowed + "-";
            }
            if (this.options.readOnly) {
                allowed = "";
            }
            $.data(this.element[0], "allowed", allowed);
        }
        /**
         * 禁用组件。
         * @name omNumberField#disable
         * @function
         * @example
         * $('#input').omNumberField("disable")
         */

        /**
         * 启用组件。
         * @name omNumberField#enable
         * @function
         * @example
         * $('#input').omNumberField("enable")
         */
    });
})(jQuery);