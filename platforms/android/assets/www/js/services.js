angular.module('indimobile.services',['ionic.utils'])

.factory('TaskServer', function($http, $localstorage, SERVER) {

  var projeto = {
    id: -1,
    descricao: '',
    data_inicio: '',
    data_termino: '',
    url: '',
    porta: ''
  };

  var url = $localstorage.get('url');
  var porta = $localstorage.get('porta');

  if(url == undefined){
    url = SERVER.url;
  };

  if(porta == undefined){
    porta = SERVER.porta;
  };

  projeto.url = url;
  projeto.porta = porta;

  projeto.autenticar = function(id_projeto) {
    return $http.get(projeto.url +':'+ projeto.porta + '/taskserver/rest/TControllerDM/Projeto/'+id_projeto);
  };

  projeto.getIndicadores = function(id_projeto) {
    if (id_projeto == undefined )
      id_projeto = projeto.id;

    return $http.get(projeto.url +':'+ projeto.porta + '/taskserver/rest/TControllerDM/Indicadores/'+id_projeto);
  };

  projeto.getNaoConformidades = function(id_projeto) {
    if (id_projeto == undefined )
      id_projeto = projeto.id;

    return $http.get(projeto.url +':'+ projeto.porta + '/taskserver/rest/TControllerDM/NaoConformidades/'+id_projeto);
  };

  return projeto;
});


