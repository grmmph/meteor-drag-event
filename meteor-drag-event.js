/**
 * Meteo Drag Event
 * @author Yonatan Wolowelsky http://grmmph.com
 * @licence MIT
 * @docs https://github.com/grmmph/meteor-drag-event
 *
 * @description Addding drag event to Meteor by Extending Blaze event handlers
 */

(function () {
  var MeteorDragEvent = class MeteorDragEvent {
    constructor(selector, oldHandler) {
      this.oldHandler = oldHandler; // old event handler from Blaze
      this.selector = selector; // selector defined by the user (e.g. `#my-elem`)
      this.dragEvent = new CustomEvent('drag');

      this.selected; // selected element that is been dragged
      this.elements = $(this.selector); // (J)Queried elements
      this.element; // (J)Queried current selected element

      this.posX = 0; // current absolute position X
      this.posY = 0; // current absolute position Y
      this.dx = 0; // Difference between old posX and new posX. (relative position from last known position)
      this.dy = 0; // Difference between old posY and new posY. (relative position from last known position)
      this.type; // "dragstart" || "dragging" || "dragend"
      this.isFirstDragging = true;

      // Init
      this.setEvents();
    };

    /**
     * @desc Handle draging on mouse move
     * @param element {DOM Object} Selected drag element
     * @param evt {Object} Mousedown Event
     */
    dragstart(elem, evt) {
      this.dragType = 'dragstart';
      this.handler(evt);
      this.selected = elem;
    }

    /**
     * @desc Handle draging on mouse move
     * @param evt {Object} Mousemove Event
     */
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
      this.element.trigger('drag', evt);
    }

    /**
     * @desc Handle drag end on mouse up
     * @param evt {Object} Mouseup Event
     */
    dragend(evt) {
      if (!this.selected) {
        return;
      }
      this.dragType = 'dragend';
      this.selected = null;
      this.dx = 0;
      this.dy = 0;
      this.isFirstDragging = true;
      this.element.trigger('drag', evt);
    }

    /**
     * @desc new event handler to bass into Blaze events
     * @param evt {Object} event to pass
     * @param element {DOM Object} draggable dom element
     * @returns extened event handler function
     */
    handler(evt, element) {
      evt.drag = {};
      evt.drag.dx = this.dx;
      evt.drag.dy = this.dy;
      evt.drag.type = this.dragType;
      return this.oldHandler.apply(this, [evt]);
    }

    /**
     * @desc Sort of an init function to setup all the mouse events
     */
    setEvents() {
      var self = this;
      this.elements.on("drag", function (initialEvent, currentEvent) {
        if (currentEvent) {
          initialEvent.currentEvent = currentEvent;
          initialEvent.targetMouseOn = currentEvent.target;
        }
        self.handler(initialEvent, this);
      });

      this.elements.on('mousedown', function (evt) {
        self.element = $(this);
        evt.targetMouseOn = evt.target;

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
    // Extend Blaze to support the drag event
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
    // NOTE: For the first time meteor will try to initilize this, it will catch the error.
    // This is something related to Meteor magic that handles it again when Blaze is ready for extentions.
  }
})();
