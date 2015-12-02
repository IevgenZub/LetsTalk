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
    ['logger', '$scope', chatController]);

    function chatController(logger, $scope) {
        logger = logger.forSource(controllerId);

        var vm = this;
        vm.messages = [];

        initialize();

        function initialize() {
            
            // Declare a proxy to reference the hub. 
            var chat = $.connection.chatHub;
            // Create a function that the hub can call to broadcast messages.
            chat.client.broadcastMessage = function (id, date, name, message) {
                var createDate = new Date(date).toLocaleDateString() + " " + new Date(date).toLocaleTimeString();
                vm.messages.push({ messageId: id, createDate: createDate, user: name, text: message});
                $scope.$apply()
            };

            $('#message').focus();

            // Start the connection.
            $.connection.hub.start().done(function () {

                $('#sendmessage').click(function () {
                    // Call the Send method on the hub. 
                    chat.server.send(window.userName, $('#message').val());
                    // Clear text box and reset focus for next comment. 
                    $('#message').val('').focus();
                });
            });
        }

        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
              s4() + '-' + s4() + s4() + s4();
        }
    }
})();