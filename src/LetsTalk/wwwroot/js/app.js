/***
 * App module: app 
 *
 * Bootstrap the app.
 *
 ***/
(function () {
    'use strict';

    angular.module('app', []).run(['$window', '$rootScope',
        function ($window, $rootScope) {
            $window.fbAsyncInit = function () {
                FB.init({
                    appId: '1532006140451673',
                    xfbml: true,
                    version: 'v2.7'
                });

                $rootScope.$broadcast('FB', 'FB Initialized');
            };

            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) { return; }
                js = d.createElement(s); js.id = id;
                js.src = "//connect.facebook.net/en_US/sdk.js";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    ])
})();