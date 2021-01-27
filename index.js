class Pagos {


    constructor(API_KEY, API_SECRET) {

        this.API_KEY = API_KEY;
        this.API_SECRET = API_SECRET;
        this.paySucces = null;
        this.payFailed = null;
        this.window = null

        Pagos.baseURL = 'http://localhost:3000/'

    }


    configure({ paySucces, payFailed }) {

        this.paySucces = paySucces;
        this.payFailed = payFailed;

    }


    #validateCurrency(currency){

        if ( currency!=='USD' && currency!=='VEF' && currency!=='BTC' && currency!=='PTR' && currency!=='CNY' && currency!=='JPY' ) {
            console.error('los tipos aceptados por la plataforma son: USD VEF BTC PTR CNY JPY');
            throw new Error(`el tipo de moneda:${currency} no se encuentra entre los aceptados por la plataforma`);
        }

    }


    #validateAmount(amount){
        let amountNumber = Number(amount);

        if ( isNaN(amountNumber) ) {
            throw new Error(`el valor ${amount} no se pudo convertir a number.`);
        }

    }


    #eventListener = (event) => {

        console.log(event);
        this.#payDispatchHandler(event.data);

    }


    pay(currency, amount) {

        this.#validateCurrency(currency);
        this.#validateAmount(amount);


        let url =`${Pagos.baseURL}payment?amount=${amount}&currency=${currency}`;


        this.window = window.open(url, '_blank', 'width=769,height=800,left=200,top=100');


        //escuchamos a los mensajes de la ventana hija
        window.addEventListener('message', this.#eventListener, false)



    }


    #payDispatchHandler(event) {

        switch (event.type) {
            case 'child-tab-ready':
                this.#sendKeys();
                break;
            case 'pay-success':
                this.#paymentSuccessfully(event.payload)
                break;

            case 'pay-failed':
                this.#paymentFailed(event.reason)
                break
            default:
                break;
        }


    }



    #paymentSuccessfully(payload) {
        
        window.removeEventListener('message', this.#eventListener, false );

        if (!this.paySucces)
            throw new Error('pay success function miss for configuration')

        try {

            this.paySucces(payload);

        } catch (error) {
            throw error;
        }

    }


    #paymentFailed(reason) {
        
        window.removeEventListener('message', this.#eventListener );

        if (!this.payFailed)
            throw new Error('pay failed function miss for configuration')


        try {

            this.payFailed(reason);

        } catch (error) {

            throw error;
            
        }

    }



    #sendKeys(){

        //send auth to the child
        this.window.postMessage({ APIKey: this.API_KEY, APISecrect: this.API_SECRET, type: 'keys' },'*');

    }









}