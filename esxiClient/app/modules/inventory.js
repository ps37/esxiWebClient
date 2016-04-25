
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
            inventoryCtrl.virtualMachines = []; inventoryCtrl.dataStores = [];

            var resource;
            for(var index in inventory){
                resource = inventory[index];
                if(resource.obj.type === "VirtualMachine")
                    inventoryCtrl.virtualMachines.push(resource);
                if(resource.obj.type === "Datastore")
                    inventoryCtrl.dataStores.push(resource);
            }

            console.log(inventoryCtrl.virtualMachines, inventoryCtrl.dataStores)

            inventoryCtrl.showVms = false; inventoryCtrl.showDs = false;
            inventoryCtrl.showVirtualMachines = function(){
                inventoryCtrl.showVms = true; inventoryCtrl.showDs = false;
            };
            inventoryCtrl.showDataStores = function(){
                inventoryCtrl.showVms = false; inventoryCtrl.showDs = true;
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