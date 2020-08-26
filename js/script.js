// GOAL: replicare quanto visto a lezione sulla todo-list permettendo all'utente di leggere tutti i task inseriti, inserirne di nuovi, eliminare quelli vecchi


// API:
// 	READ: GET - http://157.230.17.132:porta/todos
// 	INSERT: POST - http://157.230.17.132:porta/todos - DATA: text
// 	DELETE: DELETE - http://157.230.17.132:porta/todos/ID

// porta curtaz michele - :3005

$(document).ready(init);

function init(){
  getList();
}

function getList() {
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

  target.text("");

  if(data.length == 0){

    target.append(`Nothing to do.`);
  } else {

    for (var i = 0; i < data.length; i++) {
      var listItem = data[i]["text"];
      var itemID = data[i]["id"];
      target.append(`<li data-id="${itemID}"><span>${listItem}</span><i class="fas fa-times"></i></li>`);
    }
  }

}
