'use strict';

angular.module('login', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'modules/login.html',
                controller: 'loginController',
                controllerAs: 'loginCtrl'
            });
    }])

    .controller('loginController', ['$state', '$scope', 'cookieService', 'customStorage', 'fetchInventory',
        function ($state, $scope, cookieService, customStorage, fetchInventory) {
            var loginCtrl = this;

            loginCtrl.hostName = "";
            loginCtrl.userName = "";
            loginCtrl.password = "";

            var loginButton = angular.element('#loginButton');
            var alert = angular.element('#alert');
            alert[0].hidden = true;
            var serviceOptions = {proxy: true};
            var cookieKey = 'hostName';
            var service;

            loginCtrl.onError = function (error) {
                loginButton[0].disabled = false;
                alert[0].hidden = false;
                alert[0].innerText = error.message;
            };
            loginCtrl.submitForm = submitForm;

            function submitForm() {
                loginButton[0].disabled = true;
                return vsphere.vimService(loginCtrl.hostName, serviceOptions)
                    //this first promise is to get the vimservice from the library
                    .then(
                    //when vim sucesfully fetched
                    function (vimService) {
                        service = vimService;
                        service.vimPort.login(service.serviceContent.sessionManager, loginCtrl.userName, loginCtrl.password)
                            .then(
                            //when login is successful
                            function () {
                                cookieService.setCookie(cookieKey, loginCtrl.hostName);
                                return fetchInventory.display(service);
                            },
                            //when login failed
                            function (err) {
                                loginCtrl.onError(err);
                            });
                    },
                    //when fetching the vim failed
                    function (err) {
                        loginCtrl.onError(err);
                    });

            };

            service = customStorage.getService();
            var cookie = cookieService.getCookie(cookieKey);
            if (cookie !== undefined && service !== undefined) {
                service.vimPort.logout(service.serviceContent.sessionManager)
                    .then(function () {
                        cookieService.setCookie('hostName', undefined);
                        customStorage.setService(undefined);
                    });
            }

        }]);