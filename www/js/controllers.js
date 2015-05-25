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

  $scope.goNao = function(){
    $state.go('menu.naoconformidades');
  };

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

  $scope.goInd = function(){
    $state.go('menu.indicadores');
  };

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

  $scope.goNao = function(){
    $state.go('menu.naoconformidades');
  };

  $scope.sel_ind = projeto.sel_ind;
})
.directive('chartGaugue', function ($timeout) {
  return {
    restrict: 'C',
    replace: true,
    scope: {
      indicador: '='
    },
    controller: function ($scope, $element, $attrs) {

    },
    template: '<div></div>',
    link: function (scope, element, attrs) {
      $timeout(function () {
        var lista = [],
        minv = 99999999,
        maxv = 0;

        var getCor = function (obj) {
          if (obj.tp_classificacao == '1') {
            return '#55BF3B'; // green
          } else if (obj.tp_classificacao == '2') {
            return '#DDDF0D'; // yellow
          } else if (obj.tp_classificacao == '3') {
            return '#DF5353'; // red
          } else {
            return '#55BF3B'; // green
          }
        };

        var getFrom = function (obj) {
          if (obj.tp_condicao == '0') { //entre
            return obj.primeiro_valor;
          } else if (obj.tp_condicao == '1') { //igual
            return obj.primeiro_valor;
          } else if (obj.tp_condicao == '2') { //maior
            return obj.primeiro_valor;
          } else if (obj.tp_condicao == '3') { // maior ou igual
            return obj.primeiro_valor;
          } else if (obj.tp_condicao == '4') { //menor
            if (Number(obj.primeiro_valor) / 2 > 5) {
              return Number(obj.primeiro_valor) / 2;
            } else {
              return 0;
            }
          } else if (obj.tp_condicao == '5') { // menor ou igual
            if (Number(obj.primeiro_valor) / 2 > 5) {
              return Number(obj.primeiro_valor) / 2;
            } else {
              return 0;
            }
          } else if (obj.tp_condicao == '6') { // diferente
            return 0;
          } else {
            return 0;
          }
        };

        var getTo = function (obj) {
          if (obj.tp_condicao == '0') { //entre
            return obj.segundo_valor;
          } else if (obj.tp_condicao == '1') { //igual
            return obj.primeiro_valor;
          } else if (obj.tp_condicao == '2') { //maior
            return Number(obj.primeiro_valor) + Number(obj.primeiro_valor) / 2;
          } else if (obj.tp_condicao == '3') { // maior ou igual
            return Number(obj.primeiro_valor) + Number(obj.primeiro_valor) / 2;
          } else if (obj.tp_condicao == '4') { //menor
            return obj.primeiro_valor;
          } else if (obj.tp_condicao == '5') { // menor ou igual
            return obj.primeiro_valor;
          } else if (obj.tp_condicao == '6') { // diferente
            return 0;
          } else {
            return 0;
          }
        };

        scope.indicador.regras.forEach(function (value, index, ar) {

          lista.push(
          {
            color: getCor(value),
            from: Number(getFrom(value)),
            to: Number(getTo(value))
          }
          );

          if (minv > lista[index].from) {
            minv = lista[index].from;
          };

          if (maxv < lista[index].to) {
            maxv = lista[index].to;
          };

        });

        var chart = new Highcharts.Chart({
          chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            renderTo: element[0]
          },navigator: {
            enabled: false
          },
          credits: {
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
            min: minv,
            max: maxv,
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
            plotBands: lista
          },
          series: [{
            data: [minv],
            tooltip: {
              valuePrefix: '',
              valueSuffix: ' %'
            }
          }]
        });

        scope.$watch("indicador", function (newValue) {
           //$timeout(function () {
           //var point = chart.series[0].points[0];
           //point.update(maxv+1);
           //}, 600);
           //
           //$timeout(function () {
           //var point = chart.series[0].points[0];
           //point.update(minv);
           //}, 1000);

          $timeout(function () {
            var point = chart.series[0].points[0];
            point.update(Number(newValue.valor));

          }, 600);
        }, true);
      },0);
    }
  }
});
