
'use strict';

angular.module('inventory', [])
    .config(['$stateProvider', function ($stateProvider) {
        $stateProvider
            .state('inventory', {
                url: '/inventory',
                templateUrl: 'modules/inventory.html',
                controller: 'inventoryController',
                controllerAs: 'inventoryCtrl'
            });
    }])

    .controller('inventoryController', ['$state', '$scope', 'cookieService', 'customStorage',
        function ($state, $scope, cookieService, customStorage) {
            var inventoryCtrl = this;

            var inventory = customStorage.getInventory();
            var service = customStorage.getService();
            inventoryCtrl.hostName = cookieService.getCookie('hostName')
            inventoryCtrl.virtualMachines = []; inventoryCtrl.dataStores = [];

            var resource;
            for(var index in inventory){
                resource = inventory[index];
                if(resource.obj.type === "VirtualMachine")
                    inventoryCtrl.virtualMachines.push(resource);
                if(resource.obj.type === "Datastore")
                    inventoryCtrl.dataStores.push(resource);
            }

            inventoryCtrl.showVms = true;
            inventoryCtrl.showVirtualMachines = function(){
                inventoryCtrl.showVms = true;
            };
            inventoryCtrl.showDataStores = function(){
                inventoryCtrl.showVms = false;
            };

            inventoryCtrl.logout = function(){
                //logout here
                service.vimPort.logout(service.serviceContent.sessionManager)
                    .then(function() {
                        cookieService.setCookie('hostName', undefined);
                        customStorage.setService(undefined);
                        $state.go('login');
                    });
            };
        }]);