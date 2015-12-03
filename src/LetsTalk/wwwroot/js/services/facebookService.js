/***
 *
 *  Facebook Service
 * 
 ***/
(function () {
    'use strict';

    angular.module('app').factory('facebookService', function ($q) {
        return {
            getMyLastName: function () {
                var deferred = $q.defer();
                FB.api('/me', {
                    fields: 'last_name'
                }, function (response) {
                    if (!response || response.error) {
                        deferred.reject('Error occured');
                    } else {
                        deferred.resolve(response);
                    }
                });
                return deferred.promise;
            }
        }
    });
})();