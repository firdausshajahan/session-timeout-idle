
String.prototype.format = function() {
    var s = this,
        i = arguments.length;
    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

var pocTimeoutDialog = {
	calculateTimer: 0,
    settings: {
        /*timeout: 1800,
        countdown: 300, */
        timeout: 7,
        countdown: 15,
        title: 'Your session is about to expire!',
        message: 'You will be logged out in {0} seconds.',
        question: 'Do you want to stay signed in?',
        keep_alive_url: './request.html',
        logout_redirect_url: './logout.html'
    },
    init: function() {
    	alert('initiated');
        this.setupDialogTimer();
    },
    setupDialogTimer: function() {
        var self = this;
       self.setTimer =  window.setTimeout(function() {
            self.setupDialog();
        }, (this.settings.timeout - this.settings.countdown) * 1000);
    },
    clearDialogTimer: function() {
        var self = this;
        window.clearTimeout(self.setTimer);
        self.init();
    },
    setupDialog: function() {
        var self = this;
        self.destroyDialog();
        $('<div id="sessionTimeoutDialog" class="session-timeout-dialog-bg">' +
        		'<div class="session-timeout-dialog-box">' +
        			'<div class="session-timeout-dialog-header">' +
        				'<span class="session-timeout-dialog-title">' + this.settings.title + '</span>' +
        			'</div>' +
        			'<div class="session-timeout-dialog-body">' +
        				'<p>' + this.settings.message.format('<span id="sessionTimeoutCountdown" class="session-timeout-countdown">' + this.settings.countdown + '</span>') + '</p>' +
        				'<p>' + this.settings.question + '</p>' +
        			'</div>' +
        			'<div class="session-timeout-dialog-footer">' +
        				'<button id="dialogKeepSession" class="dialog-keep-session-btn">Yes, Keep me signed in</button>' +
        				'<button id="dialogSignOut"  class="dialog-sign-out-btn">No, Sign me out</button>' +
        			'</div>' +
        		'</div>' +
        	'</div>')
        .appendTo('body');
        $('#dialogKeepSession').on('click', function() {
            self.keepAlive();
        });
        $('#dialogSignOut').on('click', function() {
            self.signOut();
        });
        self.startCountdown();
    },
    destroyDialog: function() {
        if ($("#sessionTimeoutDialog").length) {
            $('#sessionTimeoutDialog').remove();
        }
    },
    startCountdown: function() {
        var self = this,
            counter = this.settings.countdown;
        self.clearCountdown();
        this.calculateTimer = window.setInterval(function() {
            counter -= 1;
            $("#sessionTimeoutCountdown").html(counter);
            if (counter <= 0) {
            	self.clearCountdown();
                self.signOut();
            }
        }, 1000);
    },
    clearCountdown: function() {
        window.clearInterval(this.calculateTimer);
        this.calculateTimer = undefined;
    },
    keepAlive: function() {
    	sessionTimeoutStatus = true;
        var self = this;
        self.destroyDialog();
        $.ajax({
            url: this.settings.keep_alive_url,
            type: "GET",
            cache: false,
            success: function() {
            	self.clearCountdown();
            	self.init();
            },
            error: function() {
                self.signOut();
            }
        });
    },
    signOut: function() {
        var self = this;
        self.destroyDialog();
        self.redirectLogout();
    },
    redirectLogout: function() {
        window.location = this.settings.logout_redirect_url;
    }
};

$(function () {
    pocTimeoutDialog.init();
});