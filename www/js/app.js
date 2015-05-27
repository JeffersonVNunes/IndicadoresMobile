// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('indimobile', ['ionic','indimobile.controllers', 'indimobile.services', 'ionic.ion.showWhen'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('entrada', {
        url: '/entrada',
        templateUrl: 'templates/entrada.html',
        controller: 'EntradaCtrl'
    })
    .state('menu', {
      url: '/menu',
      templateUrl: 'templates/menu.html',
      abstract: true
      //resolve: {
      //  projeto: function(TaskServer) {
      //    return TaskServer
      //  }
      //}
    })
    .state('menu.indicadores', {
      url: '/indicadores',
      views: {
        'menu-indicadores': {
          templateUrl: 'templates/indicadores.html',
          controller: 'IndicadoresCtrl',
          resolve: {
            projeto: function(TaskServer) {
              return TaskServer
            }
          }
        }
      }
    })
    .state('menu.indicadores-chart', {
      url: '/indicadores-chart',
      views: {
        'menu-indicadores': {
          template: '<ion-view cache-view="false" view-title="{{sel_ind.sigla}}"><ion-content scroll="false"><div class="chartGaugueAM" indicador="sel_ind" on-swipe-left="goNao()"></div></ion-content></ion-view>',
          controller: 'IndicadoresChartCtrl',
          resolve:{
            projeto: function(TaskServer) {
              return TaskServer
            }
          }
        }
      }
    })
    .state('menu.naoconformidades', {
      url: '/naoconformidades',
      views: {
        'menu-naoconformidades': {
          templateUrl: 'templates/naoconformidades.html',
          controller: 'NaoConformidadesCtrl',
          resolve: {
            projeto: function(TaskServer) {
              return TaskServer
            }
          }
        }
      }
    });
  // If none of the above states are matched, use this as the fallback:
  $urlRouterProvider.otherwise('/entrada');
})
.constant('SERVER', {
  url: 'http://192.168.170.44',
  porta: '8080'
});


