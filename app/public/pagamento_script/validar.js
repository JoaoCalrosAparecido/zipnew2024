const form   = document.getElementById('pixForm');
const campos = document.querySelectorAll('.required');
const spans  = document.querySelectorAll('.span-required');
const mesRegex = /^[1-9]$|^[1][0-2]$/;
const anoRegex = /^([1-2]+[9&0]+[0-9]{2})/



    form.addEventListener('submit', (event) => {
        event.preventDefault();
        cepValidate();
        numValidate();
        nameValidate();
        mesValidate();
        anoValidate();

    })


function setError(cadastro){
    campos[cadastro].style.border = '1px solid #e63636'

}

function removeError(cadastro){
    campos[cadastro].style.border = ''

}


function cepValidate(){
    if(campos[0].value.length < 8)
    {
        setError(0);
    }
    else{
        removeError(0);
    }
}

function numValidate(){
    if(campos[1].value.length < 1)
    {
        setError(1);
    }
    else{
        removeError(1);
    }
}


function nameValidate(){
    if(campos[2].value.length < 3)
    {
        setError(2);
    }
    else{
        removeError(2);
    }
}


function mesValidate(){
    if(!mesRegex.test(campos[3].value))
    {
        setError(3);
    }
    else{
        removeError(3);
    }
}


function anoValidate(){
    if(!anoRegex.test(campos[4].value))
    {
        setError(4);
    }
    else{
        removeError(4);
    }
}
