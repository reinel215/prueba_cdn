"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function sendMesagge() {
  //enviamos mensaje al hijo
  windowPro.postMessage('este es mi evento desde el padre', '*');
  console.log('evento enviado');
}

var Pagos = /*#__PURE__*/function () {
  function Pagos(API_KEY, API_SECRET) {
    _classCallCheck(this, Pagos);

    this.API_KEY = API_KEY;
    this.API_SECRET = API_SECRET;
    this.paySucces = null;
    this.payFailed = null;
    this.window = null;
    Pagos.baseURL = 'https://elated-heyrovsky-b5b692.netlify.app';
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
      var _this = this;

      this.window = window.open(Pagos.baseURL, '_blank', 'width=700,height=500,left=200,top=100');
      window.addEventListener('message', function (event) {
        _this.payElevenHandler(event.data);
      }, false);
    }
  }, {
    key: "payElevenHandler",
    value: function payElevenHandler(event) {
      switch (event) {
        case 'pay-success':
          this.paymentSuccessfully();
          break;

        case 'pay-failed':
          this.paymentFailed();
          break;

        default:
          break;
      }
    }
  }, {
    key: "paymentSuccessfully",
    value: function paymentSuccessfully() {
      if (!this.paySucces) throw new Error('pay success function miss for configuration');

      try {
        this.paySucces();
      } catch (error) {
        throw error;
      }
    }
  }, {
    key: "paymentFailed",
    value: function paymentFailed() {
      if (!this.payFailed) throw new Error('pay failed function miss for configuration');

      try {
        this.paySucces();
      } catch (error) {
        throw error;
      }
    }
  }]);

  return Pagos;
}();
