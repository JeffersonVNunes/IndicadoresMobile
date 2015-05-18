angular.module('indimobile.controllers',[])

.controller('EntradaCtrl', function($scope, $ionicPopup, $state, TaskServer) {
  $scope.servidor = TaskServer.servidor;

  $scope.showAlert = function(mensagem) {
    var alertPopup = $ionicPopup.alert({
      title: 'Aviso',
      template: mensagem
    });
  }

  $scope.submitForm = function(id_projeto) {

    if ( !isNaN(id_projeto)) {
      TaskServer.autenticar(id_projeto).then(function (res) {

        TaskServer.id = res.data.id;
        TaskServer.descricao = res.data.descricao;
        TaskServer.data_inicio = res.data.datainicio;
        TaskServer.data_termino = res.data.datatermino;

        $state.go('indi-menu');

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
.controller('MenuCtrl', function($scope, $ionicPopup, $ionicModal, $state, projeto) {
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
      $scope.showAlert('Projeto não encontrado');
    });

    $ionicModal.fromTemplateUrl('templates/velochart.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function($ionicModal) {
      $scope.modal = $ionicModal
    });

    $scope.openModal = function(sel_indi) {
      $scope.sel_indi = sel_indi;

      $scope.modal.show();
    };

    $scope.closeModal = function() {
      $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
      $scope.modal.remove();
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
});
