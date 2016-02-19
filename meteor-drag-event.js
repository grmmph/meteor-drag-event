(function () {
  var MeteorDragEvent = class MeteorDragEvent {
    constructor(selector, oldHandler) {
      this.oldHandler = oldHandler;
      this.selector = selector;
      this.dragEvent = new CustomEvent('drag');

      this.selected;
      this.posX = 0;
      this.posY = 0;
      this.dx = 0;
      this.dy = 0;
      this.type;
      this.elements = $(this.selector);
      this.element;

      this.isFirstDragging = true;
      this.setEvents();
    };

    dragstart(elem, evt) {
      this.dragType = 'dragstart';
      this.handler(evt);
      this.selected = elem;
    }

    dragging(evt) {
      if (!this.selected) {
        return;
      }

      newXPos = document.all ? window.event.clientX : evt.pageX;
      newYPos = document.all ? window.event.clientY : evt.pageY;

      if (this.isFirstDragging) {
        this.dx = 0;
        this.dy = 0;
        this.isFirstDragging = false;
      } else {
        this.dx = newXPos - this.posX;
        this.dy = newYPos - this.posY;
      }

      this.posX = newXPos;
      this.posY = newYPos;

      this.dragType = 'dragging';
      this.element.trigger('drag');
    }

    dragend() {
      this.dragType = 'dragend';
      this.selected = null;
      this.dx = 0;
      this.dy = 0;
      this.isFirstDragging = true;
      this.element.trigger('drag');
    }

    handler() {
      var evt = arguments[0];
      evt.drag = {};
      evt.drag.dx = this.dx;
      evt.drag.dy = this.dy;
      evt.drag.type = this.dragType;
      return this.oldHandler.apply(this, arguments);
    }

    setEvents() {
      var self = this;
      this.elements.on("drag", function (evt) {
          self.handler(evt);
      });

      this.elements.on('mousedown', function (evt) {
        self.element = $(this);
        self.dragstart(this, evt);
        return false;
      });

      document.onmousemove = function (evt) {
        self.dragging(evt);
      };

      document.onmouseup = function (evt) {
        self.dragend(evt);
      }
    }
  };

  try {
    Blaze._EventSupport.eventsToDelegate.drag = 1;
    var oldDelegateEvents = Blaze._DOMBackend.Events.delegateEvents;
    Blaze._DOMBackend.Events.delegateEvents = function (elem, type, selector, handler) {
      if (type === 'drag') {
        $(document).ready(function () {
          new MeteorDragEvent(selector, handler);
        });
      } else {
        oldDelegateEvents.apply(this, arguments);
      }
    }
  }
  catch (err) {
  }
})();
