angular.module('indimobile.controllers',['ionic.utils'])

.controller('EntradaCtrl', function($scope, $ionicPopup, $ionicModal, $state, $localstorage, TaskServer) {
  $scope.url = TaskServer.url;
  $scope.porta = TaskServer.porta;

  $scope.GravarLocal = function(){
    $localstorage.set('url', $scope.url);
    TaskServer.url = $scope.url;

    $localstorage.set('porta', $scope.porta);
    TaskServer.porta = $scope.porta;
  };

  $scope.showAlert = function(mensagem) {
    var alertPopup = $ionicPopup.alert({
      title: 'Aviso',
      template: mensagem
    });
  };

  $ionicModal.fromTemplateUrl('templates/servidor.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(Modal) {
    $scope.modal = Modal
  });

  $scope.openModal = function() {
    $scope.modal.show();
  };

  $scope.closeModal = function(){
    $scope.modal.hide();
  };

  $scope.Salvar = function() {
    $scope.url = this.url;
    $scope.porta = this.porta;
    $scope.GravarLocal();
    $scope.modal.hide();
  };

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  $scope.submitForm = function(id_projeto) {

    if ( !isNaN(id_projeto)) {
      TaskServer.autenticar(id_projeto).then(function (res) {

        TaskServer.id = res.data.id;
        TaskServer.descricao = res.data.descricao;
        TaskServer.data_inicio = res.data.datainicio;
        TaskServer.data_termino = res.data.datatermino;

        $state.go('menu.indicadores');

      }, function () {
        // error handling here
        $scope.showAlert('Projeto não encontrado');
      });
    }
    else{
      $scope.showAlert('Informe o id do projeto.');
    }
  }
})
.controller('IndicadoresCtrl', function($scope, $ionicPopup, $ionicModal, $state, projeto) {
  $scope.projeto = projeto;
  $scope.dados = 'Não Carregado';

  $scope.showAlert = function(mensagem) {
    var alertPopup = $ionicPopup.alert({
      title: 'Aviso',
      template: mensagem
    });
  };

  $scope.getIndicadores = function(){
    projeto.getIndicadores().then(function(res){

      $scope.dados = res.data;

    }, function() {
      // error handling here
      $scope.showAlert('Não foi possível carregar os indicadores');
    });
  };

  $scope.getCor = function(status){
    if(status.substr(0,2).toUpperCase() == 'NO'){
      return 'bc-verde';
    }else if(status.substr(0,2).toUpperCase() == 'AL'){
      return 'bc-amarelo';
    }else if(status.substr(0,2).toUpperCase() == 'CR'){
      return 'bc-vermelho';
    }else{
      return '';
    }
  };

  $scope.openChart = function(sel_ind){
    projeto.sel_ind = sel_ind;
    $state.go('menu.indicadores-chart');
  };

  $scope.getIndicadores();
})
.controller('NaoConformidadesCtrl', function($scope, $ionicPopup, $ionicModal, $state, projeto) {
  $scope.projeto = projeto;
  $scope.dados = 'Não Carregado';

  $scope.showAlert = function(mensagem) {
    var alertPopup = $ionicPopup.alert({
      title: 'Aviso',
      template: mensagem
    });
  };

  $scope.getNaoConformidades = function(){
    projeto.getNaoConformidades().then(function(res){
      $scope.dados = res.data;

      $ionicModal.fromTemplateUrl('templates/des-naoconformidade.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(Modal) {
        $scope.modal = Modal
      });

      $scope.openModal = function(sel_nc) {
        $scope.sel_nc = sel_nc;
        $scope.modal.show();
      };

      $scope.closeModal = function() {
        $scope.modal.hide();
      };

      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });

    }, function() {
      // error handling here
      $scope.showAlert('Não foi possível carregar as não conformidades');
    });
  };

  $scope.getCor = function(status){
    if(status == 'OK'){
      return 'bc-verde';
    }else{
      return 'bc-vermelho';
    }
  };

  $scope.getResultado = function(resultado){
    if(resultado != 'OK'){
      return 'NOK';
    }else{
      return resultado;
    }
  };

  $scope.getNaoConformidades();
})
.controller('IndicadoresChartCtrl', function($scope, $state, projeto) {
  $scope.sel_ind = projeto.sel_ind;
})
.directive('chartGaugue', function ($timeout) {
  return {
    restrict: 'C',
    replace: true,
    scope: {
      indicador: '='
    },
    controller: function ($scope, $element, $attrs, $injector) {
      //$scope.projeto = $injector.get($attrs.projeto);
    },
    template: '<div id="container" style="margin: 0 auto">não funfa</div>',
    link: function (scope, element, attrs) {

      var chart = new Highcharts.Chart({
        chart: {
          type: 'gauge',
          plotBackgroundColor: null,
          plotBackgroundImage: null,
          plotBorderWidth: 0,
          plotShadow: false,
          renderTo: 'container'
        },
        credits:{
          enabled: false
        },
        title: {
          text: ''
        },
        pane: {
          startAngle: -130,
          endAngle: 130,
          background: [{
            backgroundColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              },
              stops: [
                [0, '#FFF'],
                [1, '#333']
              ]
            },
            borderWidth: 0,
            outerRadius: '109%'
          }, {
            backgroundColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 1
              },
              stops: [
                [0, '#333'],
                [1, '#FFF']
              ]
            },
            borderWidth: 1,
            outerRadius: '107%'
          }, { // default background
          }, {
            backgroundColor: '#DDD',
            borderWidth: 0,
            outerRadius: '105%',
            innerRadius: '103%'
          }]
        }, // the value axis
        yAxis: {
          min: 0,
          max: 15,
          minorTickInterval: 'auto',
          minorTickWidth: 1,
          minorTickLength: 10,
          minorTickPosition: 'inside',
          minorTickColor: '#666',
          tickPixelInterval: 30,
          tickWidth: 2,
          tickPosition: 'inside',
          tickLength: 10,
          tickColor: '#666',
          labels: {
            step: 1,
            rotation: 'auto'
          },
          title: {
            text: ''
          },
          plotBands: [{
            from: 0,
            to: 7,
            color: '#55BF3B' // green
          }, {
            from: 7,
            to: 10,
            color: '#DDDF0D' // yellow
          }, {
            from: 10,
            to: 15,
            color: '#DF5353' // red
          }]
        },
        series: [{
          data: [0],
          tooltip: {
            valuePrefix: '',
            valueSuffix: ' %'
          }
        }]
      });

      scope.$watch("indicador", function (newValue) {
        //var valor = newValue.valor.replace(/,/g,'.');
        $timeout(function () {
          var point = chart.series[0].points[0];
          point.update(newValue.valor);
        }, 600);
      }, true);

    }
  }
});
