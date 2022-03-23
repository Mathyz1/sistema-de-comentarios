//la informacion que vallamos generando lo vamos a guardar como un arreglo de objetos
// y a su vez un objeto va a tener otro arreglo de objetos para las replicas
//recursividad y arreglo de objetos

const comments = [];

const inputContainer = document.createElement("DIV");//contenedor para el input
const input = document.createElement("INPUT"); //el input de tipo texto
const commentsContainer = document.querySelector("#comments-container");//el contenedor principal del sistema

input.classList.add("input");
input.placeholder = "Escribe un comentario"

input.addEventListener("keydown", e =>{
    handlerEnter(e, null);
});

commentsContainer.appendChild(inputContainer);
inputContainer.appendChild(input);

function handlerEnter(event, current){
    if (event.key == "Enter" && event.target.value !== "") {
        const newComment = {
            text : event.target.value,
            likes : 0,
            responses : []
        };

        if (current == null) {
            comments.unshift(newComment);
        }else{//estoy respondiendo a un comentario
            current.responses.unshift(newComment);
        };

        event.target.value = "";
        commentsContainer.innerHTML="";
        commentsContainer.appendChild(inputContainer);

        renderComments(comments, commentsContainer);
    }
}

//recorsiva 
function renderComments(arr, parent){
    arr.forEach(element => {
        //voy a crear cada uno de los elementos del comentario de forma manual, uno por uno
        //osea en vez de hacerlo con innerHTML se usan los createElement() y appendChild()
        const commentContainer = document.createElement("DIV");
        commentContainer.classList.add("comment-container");

        const responsesContainer = document.createElement("DIV");
        responsesContainer.classList.add("responses-container");

        const textContainer = document.createElement("DIV");
        textContainer.textContent = element.text;

        const actionsContainer = document.createElement("DIV");

        const replyButton = document.createElement("BUTTON");
        const likeButton = document.createElement("BUTTON");

        replyButton.textContent = "Reply";
        likeButton.textContent = `${element.likes > 0 ? `${element.likes} likes` : "like"}`;

        replyButton.addEventListener("click", e =>{
            //necesito clonar el input ya creado porque ya tiene los eventos
            const newInput = inputContainer.cloneNode(true);//parametro es si es de forma profunda o no, osea incluyendo hijos o no
            newInput.value = "";
            newInput.placeholder = "Escribe una replica";
            newInput.focus();
            //Nota: no funciona el focus ni el placeholder que quise agregar, opino no hacer la copia profunda y 
            // copiar el div y el input aparte para poder agregarle los atributos bien al input
            newInput.addEventListener("keydown", e => {
                handlerEnter(e, element);
            });
            //lo inserto antes, los parametros es que inserto y despues antes de que lo inserto
            commentContainer.insertBefore(newInput, responsesContainer); //aparece entre la capa de actions y entre la de responsesContainer
            
        });

        likeButton.addEventListener("click", e =>{
            element.likes++;
            likeButton.textContent = `${element.likes > 0 ? `${element.likes} likes` : "like"}`;
        });

        //append
        commentContainer.appendChild(textContainer);//texto del comentario
        commentContainer.appendChild(actionsContainer);//capa de las acciones
        actionsContainer.appendChild(replyButton);//boton de reply
        actionsContainer.appendChild(likeButton);//boton de like

        commentContainer.appendChild(responsesContainer);//capa de respuestas al comentario

        if (element.responses.length > 0) {
            //recursion
            //pero te hace todos los comentarios de una
            renderComments(element.responses, responsesContainer);
        }
        parent.appendChild(commentContainer);
    });
}