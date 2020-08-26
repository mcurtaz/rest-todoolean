// GOAL: replicare quanto visto a lezione sulla todo-list permettendo all'utente di leggere tutti i task inseriti, inserirne di nuovi, eliminare quelli vecchi


// API:
// 	READ: GET - http://157.230.17.132:porta/todos
// 	INSERT: POST - http://157.230.17.132:porta/todos - DATA: text
// 	DELETE: DELETE - http://157.230.17.132:porta/todos/ID

// porta curtaz michele - :3005 (ogni studente ha una porta dedicata in modo che ognuno abbia la sua lista su cui lavorare.)

$(document).ready(init);

function init(){
  getList();
  addInputListener();
  addDeleteIconListener();
}

function getList() {
  // Faccio un ajax con metodo GET per farmi restituire dal server la lista. L'unica cosa che devo inserire è l'url corretto con la mia porta. altri controlli non ci sono. mi viene restituito un array di oggetti. ogni oggetto è composto da id e text.
  $.ajax({
    url: "http://157.230.17.132:3005/todos",
    method:"GET",
    success: function(data){
      printList(data);
    },
    error: function(err){
      console.log("err", err);
    }
  });
}

function printList(data) {

  var target = $("#list");

  target.text(""); // svuoto la lista in modo da ristampare tutto da capo.

  if(data.length == 0){ // se la lista è vuota stampo "nothing to do"

    target.append(`Nothing to do.`);
  } else {

    for (var i = 0; i < data.length; i++) { // altrimenti per ogni elemento della lista stapo un li. questo li avrà un data-id con l'id dell'oggetto sul server. il text in uno span. e un'icona fontawesome che poi mi servirà per cancellare elementi dalla lista. non è molto complesso quindi posso riportare direttamente la stringa invece di usare handlebars. per l'esercizio è sufficiente.
      var listItem = data[i]["text"];
      var itemID = data[i]["id"];
      target.append(`<li data-id="${itemID}"><span>${listItem}</span><i class="fas fa-times delete-icon"></i></li>`);
    }
  }

}

function addInputListener() {
  //funzione che semplicemente al click sul bottone add item lancia la funzione addItem che aggiunge un elemento alla lista sul server.
  var target = $("#add-btn");

  target.click(addItem);

  // con il focus sull'input (cioè quando si sta scrivendo) se si preme invio (tasto che ha come keycode 13) lancio la funzione addItem
  $("#add-input").keyup(function(e){
    if(e.which == 13){
      addItem();
    }
  });
}

function addItem() {

  var text = $("#add-input").val(); // prendo il val() dell'input che è quello che ha scritto l'utente

  $("#add-input").val(""); // svuoto l'input

  // l'ajax con metodo POST aggiunge sul server un oggetto alla lista. l'id verrà assegnato dal server. il text glielo passo io e sarà una stringa uguale a quella immessa dall'utente nell'input.
  $.ajax({
    url: "http://157.230.17.132:3005/todos", // url è lo stesso. se uso GET leggo. se uso POST il server sa cosa deve fare creando il nuovo oggetto.
    method: "POST",
    data: {
      text: text // gli passo nei data alla chiave text la variabile text che contiene il val() dell'input che ho salvato prima
    },
    success: function(data){
      // il serve in data mi restituisce copia del nuovo oggetto cioè un oggetto con l'id assegnato dal server e la chiave text con il testo che gli ho mandato. si potrebbe utilizzare per dei controlli ma per ora non mi serve.

      getList(); // lancio getList in modo da chiedere al server la lista aggiornata e ristamparla in pagina
    },
    error: function(err){
      console.log("err", err);
    }
  });
}

function addDeleteIconListener() {
  // essendo elementi creati dinamicamente non posso utilizzare .click() utilizzo su tutto il document il .on() al click su elementi che hanno classe delete-icon lancio la funzione deleteItem. Penso che si potrebbe scrivere anche con al click function( se $(this) ha classe delete-icon allora lancia la funzione deleteItem)
  $(document).on("click", ".delete-icon", deleteItem);
}

function deleteItem(){
  var itemId = $(this).parents("li").data("id"); // per sapere l'id dell'elemento da cancellare (che è stampato in pagina nel data-id del li e corrisponde all'id dell'oggetto sul server) parto dall'elemento cliccato. cerco nei genitori (cioè gli elementi html che lo contengono) arrivo al li. e da quello leggo il data-id con l'id.

  $.ajax({
    url: "http://157.230.17.132:3005/todos/" + itemId, // il server per il metodo delete mi richiede di utilizzare l'url con alla fine l'id dell'oggetto da cancellare. è una cosa arbitraria, il backend imposta come comunica il server con l'esterno e il frontend rispetta le impostazioni in modo che tutte le comunicazioni vada a buon fine. la stringa dell'url si poteva anche scrivere `http://157.230.17.132:3005/todos/${itemId}`
    method: "DELETE",
    success: function(data){
      // come data il server risponde con un oggetto vuoto. si potrebbe anche in questo caso utilizzarlo per dei controlli ma per ora è sufficiente così.

      getList(); // lancio la funzione getList per ristampare la lista aggiornata
    },
    error: function(err) {
      console.log("err", err);
    }
  });

}
