/**
 * Created by Prudhvi on 4/24/16.
 */

angular.module('esxiWebClientApp.directives', [])

    .directive('toggleLogin', function(){
        var ddo;
        ddo = {
            restrict: 'AE',

            //scope: {
            //    toggle: '=toggle'
            //},

            templateUrl : 'directives/loginButton.html',

            link: function(scope, element, attrs){
                console.log(scope, attrs);
                scope.$watch("loginCtrl.disableLogin", function(newValue, oldValue){
                    if (newValue === true){
                        console.log('Inside link: ', scope.loginCtrl.errorMessage);
                    }
                    else if(newValue === false){
                        console.log('Inside else of link: ', scope.loginCtrl.errorMessage);
                    }
                }, true)
            }
        };

        return ddo;
    });

//submitForm: '&submitForm'
