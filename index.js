function sendMesagge() {

    //enviamos mensaje al hijo
    windowPro.postMessage('este es mi evento desde el padre', '*');
    console.log('evento enviado');
}


class Pagos {

    constructor(API_KEY, API_SECRET) {

        this.API_KEY = API_KEY;
        this.API_SECRET = API_SECRET;
        this.paySucces = null;
        this.payFailed = null;
        this.window = null

        Pagos.baseURL = 'https://elated-heyrovsky-b5b692.netlify.app'

    }


    configure({ paySucces, payFailed }) {

        this.paySucces = paySucces;
        this.payFailed = payFailed;

    }


    pay(currency, amount) {



        this.window = window.open(Pagos.baseURL, '_blank', 'width=700,height=500,left=200,top=100');

        window.addEventListener('message', (event) => {
            this.payElevenHandler(event.data);
        }, false)



    }


    payElevenHandler(event) {

        switch (event) {
            case 'pay-success':
                this.paymentSuccessfully()
                break;

            case 'pay-failed':
                this.paymentFailed()
                break

            default:
                break;
        }


    }



    paymentSuccessfully() {

        if (!this.paySucces)
            throw new Error('pay success function miss for configuration')

        try {

            this.paySucces();

        } catch (error) {
            throw error;
        }

    }


    paymentFailed() {

        if (!this.payFailed)
            throw new Error('pay failed function miss for configuration')


        try {

            this.paySucces();

        } catch (error) {

            throw error;
            
        }

    }









}