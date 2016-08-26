/***
 * Controller/ViewModel: countries 
 *
 * Support a view of all CountriesList
 *
 * Handles fetch and save of these lists
 *
 ***/
(function () {
    'use strict';

    var controllerId = 'chatController';
    angular.module('app').controller(controllerId,
    ['facebookService', 'logger', '$scope', chatController]);

    function chatController(facebookService, logger, $scope) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.messages = [];
        
        initialize();

        function initialize() {
           
            // Declare a proxy to reference the hub. 
            var chat = $.connection.chatHub;
            // Create a function that the hub can call to broadcast messages.
            chat.client.broadcastMessage = function (id, date, name, pictureUrl, hometown, message) {
                var createDate = new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
                vm.messages.push({ messageId: id, createDate: createDate, user: name, pictureUrl: pictureUrl, hometown: hometown, text: message });
                $scope.$apply();
            };

            chat.client.broadcastActiveUserLocation = function (name, date, location) {
                // TODO
            }

            $('#message').focus();
            
            // Start the connection.
            $.connection.hub.start().done(function () {
                $scope.sendMessage = function () {
                    var text = $('#message').val();
                    if (text != '') {
                        // Call the Send method on the hub. 
                        chat.server.send(this.userInfo.name, this.userInfo.picture.data.url, this.userInfo.hometown.name, text);
                        // Clear text box and reset focus for next comment. 
                        $('#message').val('').focus();
                    }
                } 
            });

            setTimeout(function () {
                fbAsyncInit();
            }, 1000);

            setTimeout(function () {
                FB.getLoginStatus(function (response) {
                    if (response.status === 'connected') {
                        // the user is logged in and has authenticated your
                        // app, and response.authResponse supplies
                        // the user's ID, a valid access token, a signed
                        // request, and the time the access token 
                        // and signed request each expire
                        var uid = response.authResponse.userID;
                        var accessToken = response.authResponse.accessToken;

                        facebookService.getUserInfo().then(function (response) {
                            $scope.userInfo = response;

                        });
                    } else if (response.status === 'not_authorized') {
                        // the user is logged in to Facebook, 
                        // but has not authenticated your app
                    } else {
                        // the user isn't logged in to Facebook.
                    }
                });
            }, 2000);
        }
    }
})();