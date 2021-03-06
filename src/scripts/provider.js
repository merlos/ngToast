(function(window, angular, undefined) {
  'use strict';

  angular.module('ngToast.provider', [])
    .provider('ngToast', [
      function() {
        var messages = [],
            messageStack = [];

        var defaults = {
          animation: false,
          className: 'success',
          additionalClasses: null,
          dismissOnTimeout: true,
          timeout: 4000,
          dismissButton: false,
          dismissButtonHtml: '&times;',
          dismissOnClick: true,
          compileContent: false,
          horizontalPosition: 'right', // right, center, left
          verticalPosition: 'top', // top, bottom,
          maxNumber: 0
        };

        function Message(msg) {
          var id = Math.floor(Math.random()*1000);
          while (messages.indexOf(id) > -1) {
            id = Math.floor(Math.random()*1000);
          }

          this.id = id;
          this.animation = defaults.animation;
          this.className = defaults.className;
          this.additionalClasses = defaults.additionalClasses;
          this.dismissOnTimeout = defaults.dismissOnTimeout;
          this.timeout = defaults.timeout;
          this.dismissButton = defaults.dismissButton;
          this.dismissButtonHtml = defaults.dismissButtonHtml;
          this.dismissOnClick = defaults.dismissOnClick;
          this.compileContent = defaults.compileContent;

          angular.extend(this, msg);
        }

        this.configure = function(config) {
          angular.extend(defaults, config);
        };

        this.$get = [function() {
          return {
            settings: defaults,
            messages: messages,
            dismiss: function(id) {
              if (id) {
                for (var i = messages.length - 1; i >= 0; i--) {
                  if (messages[i].id === id) {
                    messages.splice(i, 1);
                    messageStack.splice(messageStack.indexOf(id), 1);
                    return;
                  }
                }

              } else {
                while(messages.length > 0) {
                  messages.pop();
                }
                messageStack = [];
              }
            },
            create: function(msg) {
              if (defaults.maxNumber > 0 &&
                  messageStack.length >= defaults.maxNumber) {
                this.dismiss(messageStack[0]);
              }

              msg = (typeof msg === 'string') ? {content: msg} : msg;

              var newMsg = new Message(msg);
              if (defaults.verticalPosition === 'bottom') {
                messages.unshift(newMsg);
              } else {
                messages.push(newMsg);
              }
              messageStack.push(newMsg.id);
              return newMsg.id;
            },
            createWithClassName: function(className, msg) {
              msg = (typeof msg === 'string') ? {content: msg} : msg;
              msg.className= className;
              return this.create(msg);
            },
            success: function(msg) {
              return this.createWithClassName('success',msg);
            },
            info: function(msg) {
              return this.createWithClassName('info',msg);
            },
            warning: function(msg) {
              return this.createWithClassName('warning',msg);
            },
            danger: function(msg) {
              return this.createWithClassName('danger',msg);
            }
          };
        }];
      }
    ]);

})(window, window.angular);
