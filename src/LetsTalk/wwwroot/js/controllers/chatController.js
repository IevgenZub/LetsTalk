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
                vm.infoWindow.setContent($('#currentUser').html() + '<div>' + message + '</div>')
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

                    vm.infoWindow = new google.maps.InfoWindow({ map: window.map });

                    // Try HTML5 geolocation.
                    if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(function (position) {
                            var pos = {
                                lat: position.coords.latitude,
                                lng: position.coords.longitude
                            };

                            vm.infoWindow.setPosition(pos);
                            vm.infoWindow.setContent($('#currentUser').html());
                            window.map.setCenter(pos);
                        }, function () {
                            //handleLocationError(true, infoWindow, map.getCenter());
                        });
                    } else {
                        // Browser doesn't support Geolocation
                        //handleLocationError(false, infoWindow, map.getCenter());
                    }
                });
            }, 1000);
        }


    }
})();