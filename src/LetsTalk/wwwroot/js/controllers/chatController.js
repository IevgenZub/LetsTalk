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
    ['logger', chatController]);

    function chatController(logger) {
        logger = logger.forSource(controllerId);

        var vm = this;
        // vm.countriesList = [];

        initialize();

        function initialize() {
            // getCountriesList();

            // Declare a proxy to reference the hub. 
            var chat = $.connection.chatHub;
            // Create a function that the hub can call to broadcast messages.
            chat.client.broadcastMessage = function (name, message) {
                // Html encode display name and message. 
                var encodedName = $('<div />').text(name).html();
                var encodedMsg = $('<div />').text(message).html();
                // Add the message to the page. 
                $('#discussion').append('<li><strong>' + encodedName
                    + '</strong>:&nbsp;&nbsp;' + encodedMsg + '</li>');
            };
            // Get the user name and store it to prepend to messages.
            $('#displayname').val(prompt('Enter your name:', ''));
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

        /*
        function getCountriesList() {
            return datacontext.getCountries().then(function (data) {
                return vm.countriesList = data;
            });
        }
        */
    }
})();