"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classPrivateFieldGet(receiver, privateMap) { var descriptor = privateMap.get(receiver); if (!descriptor) { throw new TypeError("attempted to get private field on non-instance"); } if (descriptor.get) { return descriptor.get.call(receiver); } return descriptor.value; }

function _classPrivateMethodGet(receiver, privateSet, fn) { if (!privateSet.has(receiver)) { throw new TypeError("attempted to get private field on non-instance"); } return fn; }

var _validateCurrency = new WeakSet();

var _validateAmount = new WeakSet();

var _eventListener = new WeakMap();

var _payDispatchHandler = new WeakSet();

var _paymentSuccessfully = new WeakSet();

var _paymentFailed = new WeakSet();

var _sendKeys = new WeakSet();

var Pagos = /*#__PURE__*/function () {
  function Pagos(API_KEY, API_SECRET) {
    var _this = this;

    _classCallCheck(this, Pagos);

    _sendKeys.add(this);

    _paymentFailed.add(this);

    _paymentSuccessfully.add(this);

    _payDispatchHandler.add(this);

    _validateAmount.add(this);

    _validateCurrency.add(this);

    _eventListener.set(this, {
      writable: true,
      value: function value(event) {
        console.log(event);

        _classPrivateMethodGet(_this, _payDispatchHandler, _payDispatchHandler2).call(_this, event.data);
      }
    });

    this.API_KEY = API_KEY;
    this.API_SECRET = API_SECRET;
    this.paySucces = null;
    this.payFailed = null;
    this.window = null;
    Pagos.baseURL = 'http://178.128.11.44:3000/';
  }

  _createClass(Pagos, [{
    key: "configure",
    value: function configure(_ref) {
      var paySucces = _ref.paySucces,
          payFailed = _ref.payFailed;
      this.paySucces = paySucces;
      this.payFailed = payFailed;
    }
  }, {
    key: "pay",
    value: function pay(currency, amount) {
      _classPrivateMethodGet(this, _validateCurrency, _validateCurrency2).call(this, currency);

      _classPrivateMethodGet(this, _validateAmount, _validateAmount2).call(this, amount);

      var url = "".concat(Pagos.baseURL, "payment?amount=").concat(amount, "&currency=").concat(currency);
      this.window = window.open(url, '_blank', 'width=769,height=800,left=200,top=100'); //escuchamos a los mensajes de la ventana hija

      window.addEventListener('message', _classPrivateFieldGet(this, _eventListener), false);
    }
  }]);

  return Pagos;
}();

var _validateCurrency2 = function _validateCurrency2(currency) {
  if (currency !== 'USD' && currency !== 'VEF' && currency !== 'BTC' && currency !== 'PTR' && currency !== 'CNY' && currency !== 'JPY') {
    console.error('los tipos aceptados por la plataforma son: USD VEF BTC PTR CNY JPY');
    throw new Error("el tipo de moneda:".concat(currency, " no se encuentra entre los aceptados por la plataforma"));
  }
};

var _validateAmount2 = function _validateAmount2(amount) {
  var amountNumber = Number(amount);

  if (isNaN(amountNumber)) {
    throw new Error("el valor ".concat(amount, " no se pudo convertir a number."));
  }
};

var _payDispatchHandler2 = function _payDispatchHandler2(event) {
  switch (event.type) {
    case 'child-tab-ready':
      _classPrivateMethodGet(this, _sendKeys, _sendKeys2).call(this);

      break;

    case 'pay-success':
      _classPrivateMethodGet(this, _paymentSuccessfully, _paymentSuccessfully2).call(this, event.payload);

      break;

    case 'pay-failed':
      _classPrivateMethodGet(this, _paymentFailed, _paymentFailed2).call(this, event.reason);

      break;

    default:
      break;
  }
};

var _paymentSuccessfully2 = function _paymentSuccessfully2(payload) {
  window.removeEventListener('message', _classPrivateFieldGet(this, _eventListener), false);
  if (!this.paySucces) throw new Error('pay success function miss for configuration');

  try {
    this.paySucces(payload);
  } catch (error) {
    throw error;
  }
};

var _paymentFailed2 = function _paymentFailed2(reason) {
  window.removeEventListener('message', _classPrivateFieldGet(this, _eventListener));
  if (!this.payFailed) throw new Error('pay failed function miss for configuration');

  try {
    this.payFailed(reason);
  } catch (error) {
    throw error;
  }
};

var _sendKeys2 = function _sendKeys2() {
  //send auth to the child
  this.window.postMessage({
    APIKey: this.API_KEY,
    APISecrect: this.API_SECRET,
    type: 'keys'
  }, '*');
};
