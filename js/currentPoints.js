var CurrentPoints = (function () {
  var CurrentPoints = function(elem) {
    var that = this;
    this.node = elem;
    this.star = this.node.previousElementSibling;

    this.points = +this.node.innerHTML;

    document.body.addEventListener("addPoints", function(event) {
      that.add(event.detail.points);
      toggleClass.apply(that);
    }, false);
  }

  function toggleClass() {
    this.star.classList.add('-active');

    setTimeout(function() {
      this.star.classList.remove('-active');
    }.bind(this),900);
  }

  var fn = CurrentPoints.prototype;

  fn.add = function(num) {
    this.points += +num;
    this.node.innerHTML = this.points;
  }

  return CurrentPoints;
}());