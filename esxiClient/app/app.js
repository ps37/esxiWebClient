'use strict';
var esxiWebClientApp =
    angular.module('esxiWebClientApp', [
    'ui.router',
    'ngCookies',
    'esxiWebClientApp.services',
    'esxiWebClientApp.directives',
    'login',
    'inventory'
])
.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/login');

}])
.controller('mainController', ['$state', function($state){
            //$state.go('login');
            var vm = this;
            vm.goToMain = function(){
              $state.go('login');
            };
}]);