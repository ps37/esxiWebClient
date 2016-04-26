/**
 * Created by Prudhvi on 4/23/16.
 */

angular.module('esxiWebClientApp.services', [])

.service('cookieService', ['$cookieStore', function($cookieStore){

        this.getCookie = function(key){
            return $cookieStore.get(key);
        };

        this.setCookie = function(key, value){
            if(value === undefined){
                $cookieStore.put(key, value, {'expires': new Date(0)});
            }
            else{
                $cookieStore.put(key, value);
            }
        };

    }])

.service('customStorage', [function(){
    var inventory, theVimService;
    this.setInventory = function(inventoryObjects){
        inventory = inventoryObjects;
    };
    this.getInventory = function(){
      return inventory;
    };
    this.setService = function(vimService){
        theVimService = vimService;
    };
    this.getService = function(){
        return theVimService;
    };
}])

.service('fetchInventory', ['$state','customStorage', function($state, customStorage){

        this.display = function(service){
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

    }]);