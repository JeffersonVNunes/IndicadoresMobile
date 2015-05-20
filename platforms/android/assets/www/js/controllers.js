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
        //$scope.id_projeto = '';
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
  }

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
});
