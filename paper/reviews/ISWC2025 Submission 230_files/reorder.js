var Reorder = {
  // initialise all movable rows
  init: function() {
    try {
      var rows = document.getElementsByTagName('tr');
      for (var i = rows.length - 1; i >= 0; i--) {
        var row = rows[i];
        if (row.getAttribute('data-move')) {
          row.style.cursor = 'pointer';
          addEventHandler(row, 'mousedown', Reorder.rowMouseDown);
          addEventHandler(row, 'mouseover', Reorder.rowMouseOver);
        }
      }
      addEventHandler(document, 'mouseup', Reorder.mouseUp);
    }
    catch (err) {
      logError(err, 'reorder.init');
    }
  },

  index: 0,       // row index of the moving object
  serverScript: null, // server-side script to call
  moveClass: '',    // class of the moving object
  oldCLass: null,   // old class of the moving object
  moving: null,     // the moving object
  pars: {},       // parameters to the server-side script

  set: function(scr, cls, params) {
    Reorder.serverScript = scr;
    Reorder.moveClass = cls;
    Reorder.pars = params;
  },

  // called when mouse is pressed on a draggable object
  rowMouseDown: function(event) {
    try {
      // find id of the draggable object and remember this id
      var elem = eventSource(event, 'data-move');
      Reorder.oldClass = elem.className;
      Reorder.moving = elem;
      Reorder.index = elem.rowIndex;
      elem.className = 'red'; // ToDo: make it depend on Reorder.moveClass;
      cancelDefault(event); // to cancel text marking
    }
    catch (err) {
      logError(err, 'reorder.rowMouseDown');
    }
  },

  // called when mouse is passed over a moving object
  rowMouseOver: function(event) {
    try {
      if (!Reorder.moving) return;

      var over = eventSource(event, 'data-move');
      if (Reorder.moving.rowIndex < over.rowIndex) {
        insertAfter(over, Reorder.moving);
      }
      else {
        var tableSection = over.parentNode;
        tableSection.insertBefore(Reorder.moving, over);
      }
    }
    catch (err) {
      logError(err, 'reorder.rowMouseDown');
    }
  },

  mouseUp: function(event) {
    try {
      if (!Reorder.moving) return;

      var moved = Reorder.moving;
      Reorder.moving = null;
      moved.className = Reorder.oldClass;

      var over = eventSource(event, 'data-move');

      // find the table containing the row and its rows
      for (var tbl = moved.parentNode; tbl.tagName.toLowerCase() != 'table'; tbl = tbl.parentNode);

      var rows = tbl.rows;
      var newIndex = moved.rowIndex;
      if (Reorder.index == newIndex) { // not moved
        clearReport();
        return;
      }

      var pars = Reorder.pars;
      pars.moved = moved.getAttribute('data-move');
      // compute the new position of the row, starting from 1,
      // among all movable rows of the same table
      var pos = 1;
      // find the movable rows with a lower index
      for (var i = rows.length - 2; i >= 0; i--) {
        var row = rows[i];
        if (row.getAttribute('data-move') && row.rowIndex < newIndex) {
          pos++;
        }
      }
      pars.pos = pos;

      loadObject(Reorder.serverScript, doNothing, pars);
    }
    catch (err) {
      logError(err,'reorder.mouseUp');
    }
  }
};

addOnLoad(Reorder.init);
