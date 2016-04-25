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

    .controller('loginController', ['$state', '$scope', 'cookieService', 'customStorage',
        function ($state, $scope, cookieService, customStorage) {
            var loginCtrl = this;

            console.log('I entered login!');

            loginCtrl.hostName = "";
            loginCtrl.userName = "";
            loginCtrl.password = "";
            //loginCtrl.errorMessage = "";
            //loginCtrl.disableLogin = false;

            var loginButton = angular.element('#loginButton');
            var alert = angular.element('#alert');
            alert[0].hidden = true;
            var serviceOptions = {proxy: true};
            var cookieKey = 'hostName';
            var service;

            loginCtrl.onError = function (error) {
                console.log('On errror: ', error.message);
                loginButton[0].disabled = false;
                alert[0].hidden = false;
                alert[0].innerText = error.message;
            };

            loginCtrl.submitForm = submitForm;
            loginCtrl.getInventory = getInventory;

            function submitForm() {
                loginButton[0].disabled = true;
                return vsphere.vimService(loginCtrl.hostName, serviceOptions)
                    //this first promise is to get the vimservice from the library
                    .then(
                    //when vim sucesfully fetched
                    function (vimService) {
                        service = vimService;
                        //console.log(service, loginCtrl.userName, loginCtrl.password, typeof loginCtrl.userName, typeof loginCtrl.password);
                        service.vimPort.login(service.serviceContent.sessionManager, loginCtrl.userName, loginCtrl.password)
                            .then(
                            //when login is successful
                            function () {
                                cookieService.setCookie(cookieKey, loginCtrl.hostName);
                                return loginCtrl.getInventory();
                            },
                            //when login failed
                            function (err) {
                                loginCtrl.onError(err);
                                console.log(err.message);
                                //$state.reload();
                            });
                    },
                    //when fetching the vim failed
                    function (err) {
                        loginCtrl.onError(err);
                        console.log(err.message);
                        //$state.reload();
                    });

            };

            function getInventory() {
                var propertyCollector = service.serviceContent.propertyCollector;
                var rootFolder = service.serviceContent.rootFolder;
                var viewManager = service.serviceContent.viewManager;
                var type = "ManagedEntity";

                return service.vimPort.createContainerView(viewManager, rootFolder, [type], true)
                    .then(function (containerView) {
                        return service.vimPort.retrievePropertiesEx(propertyCollector, [
                            service.vim.PropertyFilterSpec({
                                objectSet: service.vim.ObjectSpec({
                                    obj: containerView,
                                    skip: true,
                                    selectSet: service.vim.TraversalSpec({
                                        path: "view",
                                        type: "ContainerView"
                                    })
                                }),
                                propSet: service.vim.PropertySpec({
                                    type: type,
                                    pathSet: ["name"]
                                })
                            })
                        ], service.vim.RetrieveOptions());
                    })
                    .then(function (result) {
                        customStorage.setService(service);
                        customStorage.setInventory(result.objects);

                        $state.go('inventory');

                    });
            };

            service = customStorage.getService();
            var cookie = cookieService.getCookie(cookieKey);
            console.log(cookie, service);
            if (cookie !== undefined && service !== undefined) {
                service.vimPort.logout(service.serviceContent.sessionManager)
                    .then(function () {
                        cookieService.setCookie('hostName', undefined);
                        customStorage.setService(undefined);
                    });
            }

        }]);