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
}]);
//.service('loginService', [ function(){
//        this.authenticate = function(hostname, username, password){
//            var service, serviceOptions = {proxy: true};
//            var returnObj = {
//                errorsFound: true,
//                errorMessage: ""
//            };
//            return vsphere.vimService(hostname, serviceOptions)
//                //this first promise is to get the vimservice from the library
//                .then(
//                //when vim sucesfully fetched
//                function(vimService) {
//                    service = vimService;
//                    console.log(username, password, service, service.serviceContent.sessionManager);
//                    service.vimPort.login(service.serviceContent.sessionManager, username, password)
//                        .then(
//                        //when login is successful
//                        function(data) {
//                            //returnObj.errorsFound = false;
//                            return data;
//                        },
//                        //when login failed
//                        function(err) {
//                            //returnObj.errorsFound = true;
//                            //returnObj.errorMessage = err.message;
//                            return err;
//                        });
//                },
//                //when fetching the vim failed
//                function(err) {
//                    //returnObj.errorsFound = true;
//                    //returnObj.errorMessage = err.message;
//                    return err;
//                });
//        }
//    }]);