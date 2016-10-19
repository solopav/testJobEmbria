var Action = (function () {

  var Action = function(elem) {
    this.node = elem;
    this.nodeTimer = this.node.querySelector('.js-actions-timer');
    this.clock = this.node.querySelector('.js-actions-clock');

    var attributes = elem.dataset;

    this.id = getId(elem.id);
    this.time = attributes.recoveryTime < 1 ? 1 : attributes.recoveryTime;
    this.points = attributes.points;
    this.restTime = attributes.restTime;
    this.disabled = false;
    this.timer = false;
    this.event = new CustomEvent("addPoints", {
      detail: { points: this.points },
      bubbles: true,
      cancelable: true
    });
  }

  var fn = Action.prototype;

  fn.addPoints = function() {
    document.body.dispatchEvent(this.event);
  }

  fn.sendAction = function() {
    var obj = {
      id : this.id
    };

    /**
    * Отправка запроса закоменчена
    * потому что она волшебным образом ломает таймер,
    * на локальном файле
    * тем что отправляется в никуда
    * с рабочей ссылкой должно быть ок 👍
    */
    //sendData(obj);
  }

  fn.toggleDisabled = function(restTime) {
    this.nodeTimer.innerHTML = '';
    
    if (!this.disabled) {
      this.startTimer(restTime);

      if (!restTime) {
        this.addPoints();
        this.sendAction();
      }
    }

    this.disabled = !this.disabled;
    this.node.classList.toggle('-disabled');
  }

  fn.checkRestTime = function() {
    if (this.restTime && this.restTime != 0) {
      this.toggleDisabled(this.restTime);
    }
  }

  fn.startTimer = function(restTime) {
    var time = restTime || this.time;
    var start = new Date();
    var end = new Date();

    end.setSeconds(end.getSeconds() + +time);

    this.clock.style.display = 'block';

    this.timer = setInterval(function() {
      updateNodeTimer.apply(this,[this.time,end]);
    }.bind(this),1000);
  }

  fn.stopTimer = function() {
    clearInterval(this.timer);

    eventEndTimer.apply(this);
  }

  function updateNodeTimer(time, end) {
    var now = new Date();
    var sec = parseInt(+end - +now)/1000;

    var hours = parseInt(sec/3600);
    if (hours) {
      hours = addZero(hours) + ':';
    } else {
      hours = '';
    }

    var minutes = parseInt((sec%3600)/60);
    minutes = addZero(minutes);

    var seconds = parseInt((sec%3600)%60);
    seconds = addZero(seconds);

    if ( sec > 0) {
      this.nodeTimer.innerHTML = hours + minutes + ':'+ seconds;
    } else {
      this.stopTimer();
    }

    this.clock.style.display = 'none';
  }

  function eventEndTimer() {
    this.node.classList.add('-active');

    setTimeout(function() {
      this.node.classList.remove('-active');
    }.bind(this),900);

    this.toggleDisabled();
  }

  function getId(id) {
    var reg = /(actions_id-)/;

    return id.replace(reg,'');
  }

  function addZero(num) {
    return String(num).length === 1 ? '0' + num : num;
  }

  function sendData(obj) {
    var xhr = new XMLHttpRequest();
    var data = JSON.stringify(obj);

    xhr.open("POST", "/saveActions", true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 ) {
           if (xhr.status == 200) {
             console.log('Все ок')
           } else {
             /**
             * Если данные не сохранились
             * то отменяем таймеры, очки и тд
             */
           }
        }
    };
    
    xhr.send(data);
  }

  return Action;
}());


/**
* Полифил для ie9 - CustomEvent
*/
(function () {
  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();