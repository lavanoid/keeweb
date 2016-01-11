'use strict';

var Tip = function(el, config) {
    this.el = el;
    this.title = config && config.title || el.attr('title');
    this.placement = config && config.placement || el.attr('tip-placement');
    this.tipEl = null;
    this.showTimeout = null;
    this.hideTimeout = null;
};

Tip.prototype.init = function() {
    this.el.removeAttr('title');
    this.el.mouseenter(this.mouseenter.bind(this)).mouseleave(this.mouseleave.bind(this));
};

Tip.prototype.show = function() {
    if (this.tipEl) {
        this.tipEl.remove();
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }
    var tipEl = this.tipEl = $('<div></div>').addClass('tip').appendTo('body').html(this.title);
    var rect = this.el[0].getBoundingClientRect(),
        tipRect = this.tipEl[0].getBoundingClientRect();
    var placement = this.placement || this.getAutoPlacement(rect, tipRect);
    tipEl.addClass('tip--' + placement);
    var top, left;
    var offset = 10;
    switch (placement) {
        case 'top':
            top = rect.top - tipRect.height - offset;
            left = rect.left + rect.width / 2 - tipRect.width / 2;
            break;
        case 'bottom':
            top = rect.bottom + offset;
            left = rect.left + rect.width / 2 - tipRect.width / 2;
            break;
        case 'left':
            top = rect.top + rect.height / 2 - tipRect.height / 2;
            left = rect.left - tipRect.width - offset;
            break;
        case 'right':
            top = rect.top + rect.height / 2 - tipRect.height / 2;
            left = rect.right + offset;
            break;
    }
    tipEl.css({ top: top, left: left });
};

Tip.prototype.hide = function() {
    if (this.tipEl) {
        this.tipEl.remove();
        this.tipEl = null;
    }
};

Tip.prototype.mouseenter = function() {
    var that = this;
    if (this.showTimeout) {
        return;
    }
    this.showTimeout = setTimeout(function() {
        that.showTimeout = null;
        that.show();
    }, 200);
};

Tip.prototype.mouseleave = function() {
    var that = this;
    if (this.tipEl) {
        that.tipEl.addClass('tip--hide');
        this.hideTimeout = setTimeout(function () {
            that.hideTimeout = null;
            that.hide();
        }, 500);
    }
    if (this.showTimeout) {
        clearTimeout(this.showTimeout);
        this.showTimeout = null;
    }
};

Tip.prototype.getAutoPlacement = function(rect, tipRect) {
    var padding = 20;
    var bodyRect = document.body.getBoundingClientRect();
    var canShowToBottom = bodyRect.bottom - rect.bottom > padding + tipRect.height,
        canShowToHalfRight = bodyRect.right - rect.right > padding + tipRect.width / 2,
        canShowToRight = bodyRect.right - rect.right > padding + tipRect.width,
        canShowToHalfLeft = rect.left > padding + tipRect.width / 2,
        canShowToLeft = rect.left > padding + tipRect.width;
    if (canShowToBottom) {
        if (canShowToLeft && !canShowToHalfRight) {
            return 'left';
        } else if (canShowToRight && !canShowToHalfLeft) {
            return 'right';
        } else {
            return 'bottom';
        }
    }
    if (canShowToLeft && !canShowToHalfRight) {
        return 'left';
    } else if (canShowToRight && !canShowToHalfLeft) {
        return 'right';
    } else {
        return 'top';
    }
};

Tip.createTips = function(container) {
    container.find('[title]').each(function(ix, el) {
        if (!el._tip) {
            var tip = new Tip($(el));
            tip.init();
            el._tip = tip;
        }
    });
};

module.exports = Tip;
