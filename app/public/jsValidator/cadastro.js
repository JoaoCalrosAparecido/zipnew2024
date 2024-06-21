// const form   = document.getElementById('formulario');
// const campos = document.querySelectorAll('.required');
// const spans  = document.querySelectorAll('.span-required');
// const cpfRegex = /^([0-9]{3}\.?[0-9]{3}\.?[0-9]{3}\-?[0-9]{2}|[0-9]{2}\.?[0-9]{3}\.?[0-9]{3}\/?[0-9]{4}\-?[0-9]{2})$/;
// const diaRegex = /^(0?[1-9]|[12][0-9]|3[01])$/;
// const mesRegex = /^[1-9]$|^[1][0-2]$/;
// const anoRegex = /^([1-2]+[9&0]+[0-9]{2})/
// const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
// const cepRegex = /[0-9]{5}[\d]{3}/;


//     form.addEventListener('submit', (event) => {
//         event.preventDefault();
//         nameValidate();
//         cpfValidate();
//         diaValidate();
//         mesValidate();
//         anoValidate();
//         emailValidate();
//         mainPasswordValidate();
//         comparePassword();
//         cepValidate();
//     })


// function setError(cadastro){
//     campos[cadastro].style.border = '1px solid #e63636'
//     spans[cadastro].style.display = 'block';
// }

// function removeError(cadastro){
//     campos[cadastro].style.border = ''
//     spans[cadastro].style.display = 'none';
// }




// function nameValidate(){
//     if(campos[0].value.length < 3)
//     {
//         setError(0);
//     }
//     else{
//         removeError(0);
//     }
// }
// function cpfValidate(){
//     if(!cpfRegex.test(campos[1].value))
//     {
//         setError(1);
//     }
//     else{
//         removeError(1);
//     }
// }


//  //data

// function diaValidate(){
//     if(!diaRegex.test(campos[2].value))
//     {
//         setError(2);
//     }
//     else{
//         removeError(2);
//     }
// }


// function mesValidate(){
//     if(!mesRegex.test(campos[3].value))
//     {
//         setError(3);
//     }
//     else{
//         removeError(3);
//     }
// }


// function anoValidate(){
//     if(!anoRegex.test(campos[4].value))
//     {
//         setError(4);
//     }
//     else{
//         removeError(4);
//     }
// }

// function emailValidate(){
//     if(!emailRegex.test(campos[5].value))
//     {
//         setError(5);
//     }
//     else{
//         removeError(5);
//     }
// }


// function mainPasswordValidate(){
//     if(campos[6].value.length < 8)
//     {
//         setError(6);
//     }
//     else
//     {
//         removeError(6);
//         comparePassword();
//     }
// }

// function comparePassword(){
//     if(campos[6].value == campos[7].value && campos[7].value.length <=8)
//     {
//         removeError(7);
//     } 
//     else{
//         setError(7);
//     }
// }

// function cepValidate(){
//     if(!cepRegex.test(campos[8].value))
//     {
//         setError(8);
//     }
//     else{
//         removeError(8);
//     }
// }
