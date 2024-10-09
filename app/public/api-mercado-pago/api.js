document.addEventListener("DOMContentLoaded", function (e) {
    //chave pública do vendedor
    const mercadopago = new MercadoPago('APP_USR-5593607796954557-092821-c64b7b86bb2f21f48268017986839bb2-2009674095', {
        locale: 'pt-BR' // Os mais comuns são: 'pt-BR', 'es-AR' e 'en-US'
    });

    console.log("primeira etapa")
    


    // Handle call to backend and generate preference.
    document.getElementById("checkout-btn").addEventListener("click", function () {
        console.log("clicou no botão")
        //$('#checkout-btn').attr("disabled", true);
        const items = document.querySelectorAll(".products .item");
        console.log(items)
        // Array para armazenar os dados extraídos
        const extractedData = [];
        // Itera sobre cada item para extrair os dados
        items.forEach(item => {
            console.log(item)
            const id = parseFloat(document.getElementById('id_prod').value)
            const unit_price = Number(parseFloat( item.querySelector(".preco-prod-value").innerText).toFixed(2));
            const  title = item.querySelector(".name-prod").innerText;
            const quantity = 1;
            const currency_id = "BRL";        
            extractedData.push({ id, unit_price, title,quantity, currency_id });
        });
        const orderData = { items: extractedData };
 
        console.log(orderData)
        console.log('teste')
        
        fetch("/create-preference", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orderData),
        })
        .then(function (response) {
            return response.json();
        })
        .then(function (preference) {
            createCheckoutButton(preference.id);
            //$(".shopping-cart").fadeOut(500);
            setTimeout(() => {
               // $(".container_payment").show(500).fadeIn();
            }, 500);
        })
        .catch(function () {
            alert("Unexpected error");
           // $('#checkout-btn').attr("disabled", false);
        });
    });

    function createCheckoutButton(preferenceId) {
        // Initialize the checkout
        const bricksBuilder = mercadopago.bricks();
        const renderComponent = async (bricksBuilder) => {
            if (window.checkoutButton) window.checkoutButton.unmount();
            await bricksBuilder.create(
                'wallet',
                'button-checkout', // class/id onde o botão de pagamento será exibido
                {
                    initialization: {
                        preferenceId: preferenceId
                    },
                    callbacks: {
                        onError: (error) => console.error(error),
                        onReady: () => {}
                    }
                }
            );
            window.checkoutButton = renderComponent(bricksBuilder);
        };
    }

    // Go back
    /*document.getElementById("go-back").addEventListener("click", function () {
        $(".container_payment").fadeOut(500);
        setTimeout(() => {
            $(".shopping-cart").show(500).fadeIn();
        }, 500);
        $('#checkout-btn').attr("disabled", false);
    });*/
});
