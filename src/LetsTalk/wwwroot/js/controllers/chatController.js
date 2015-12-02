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
            chat.client.broadcastMessage = function (name, message) {
                vm.messages.push({ user: name, text: message });
                $scope.$apply()
            };
            // Get the user name and store it to prepend to messages.
            //$('#displayname').val(prompt('Enter your name:', ''));
            // Set initial focus to message input box.  
            $('#message').focus();
            // Start the connection.
            $.connection.hub.start().done(function () {

                $('#sendmessage').click(function () {
                    // Call the Send method on the hub. 
                    chat.server.send($('#displayname').val(), $('#message').val());
                    // Clear text box and reset focus for next comment. 
                    $('#message').val('').focus();
                });
            });
        }
    }
})();