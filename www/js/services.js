angular.module('indimobile.services',[])

.factory('TaskServer', function($http, SERVER) {

  var projeto = {
    id: -1,
    descricao: '',
    data_inicio: '',
    data_termino: '',
    servidor: ''
  }

  projeto.servidor = SERVER;

  projeto.autenticar = function(id_projeto) {
      return $http.get(SERVER.url + '/taskserver/rest/TControllerDM/Projeto/'+id_projeto);
  }

  projeto.getIndicadores = function(id_projeto) {
    if (id_projeto == undefined )
      id_projeto = projeto.id;

    return $http.get(SERVER.url + '/taskserver/rest/TControllerDM/Indicadores/'+id_projeto);
  };

  projeto.getNaoConformidades = function(id_projeto) {
    if (id_projeto == undefined )
      id_projeto = projeto.id;

    return $http.get(SERVER.url + '/taskserver/rest/TControllerDM/NaoConformidades/'+id_projeto);
  };

  return projeto;
});


