# Meteor Drag Event

## What's that?

This package extend Meteor Blaze Events to support drag event.

Now you can use `drag` event just like you would use `click` event on the events template helpers.

Demo: http://meteor-drag-event.meteor.com

## Installation

`$ meteor add grmmph:meteor-drag-event`

## Usage

When using the drag event, the first event argument for the event handler callback will include a `drag` object with
 - `type <string>`: `dragstart`, `dragend` and `dragging`
 - `dx<Number>`: Difference between last x and current x
 - `dy<Number>`: Difference between last y and current y

### Example
```
Template.hello.events({
  'drag .my-draggable-element': function (evt) {

    if (evt.drag.type === 'dragstart') {
      console.log('You start dragging!')
    } else if (evt.drag.type === 'dragend') {
      console.log('You stopped dragging!')
    } else if (evt.drag.type === 'dragend') {
      console.log('You are dragging!')
    }

    // Move elements in space (element must have position: absolute)
    $(evt.target).animate({
      left: '+=' + evt.drag.dx,
      top: '+=' + evt.drag.dy,
    }, 1);
  }
});
```
