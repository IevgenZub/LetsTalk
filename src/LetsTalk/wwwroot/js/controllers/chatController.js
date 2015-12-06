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
            chat.client.broadcastMessage = function (id, date, name, message) {
                var createDate = new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
                vm.messages.push({ messageId: id, createDate: createDate, user: name, text: message });
                $scope.$apply();
            };

            $('#message').focus();
            
            // Start the connection.
            $.connection.hub.start().done(function () {
                $scope.sendMessage = function () {
                    var text = $('#message').val();
                    if (text != '') {
                        // Call the Send method on the hub. 
                        chat.server.send(vm.userInfo.name, text);
                        // Clear text box and reset focus for next comment. 
                        $('#message').val('').focus();
                    }
                }
                
            });

            setTimeout(function () {
                fbAsyncInit();
            }, 1000);

            setTimeout(function () {
                facebookService.getUserInfo().then(function (response) {
                    vm.userInfo = response;
                });
            }, 1000);
        }
    }
})();