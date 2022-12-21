// Cadastro de pratos para um restaurante em um formulário com opções Create/Edit
// Recebe nome do prato, descrição, peso, calorias, preço
// Apresenta registro dos pratos em uma tabela com opções Update/Delete
// Visualização de cards contendo os registros da base de dados "bdPratos"

 // Imports Firebase
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
 import { getFirestore, collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc} from  "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js";

 //Dados necessários para configuração e inicialização da conexão Firebase com o app
 const app = initializeApp({
   apiKey: "AIzaSyD6Bv31ijI0Y6YZLeeK0LLqmvHeHeQ_FfU",
   authDomain: "bdpratos.firebaseapp.com",
   projectId: "bdpratos",
   storageBucket: "bdpratos.appspot.com",
   messagingSenderId: "1090772204215",
   appId: "1:1090772204215:web:da053e57521c2b61612b32",
   measurementId: "G-2352Y1JNJS"
 });

//Armazena a base de dados em db
const db = getFirestore(app);

//Carrega a coleção pratosProntos em pratosRef
const pratosRef = collection(db, 'pratosProntos')

//Dispara evento exibeCardapio quando a página cardapio.html for carregada e realiza operação read 
//em todos os registros, injetando os registros em cards na página htlm 
window.onload = async function exibeCardapio(){
    let estrutura = '';
    
    const queryRegistros = await getDocs(pratosRef)
    queryRegistros.forEach((doc) => {
        const {nome, descricao, calorias, peso, preco, link} = doc.data()
        estrutura += `
        <div class="col-xs-12 col-sm-3 col-md-3 col-lg-4 mb-4">
            <div class="card border border-dark">
                <img class="rounded m-2" height="150" width="150" src="${doc.data().link}">
                <div class="card-body">
                    <h3 class="card-title">${doc.data().nome}</h3>
                    <p class="card-text">Descrição : ${doc.data().descricao}</p>
                    <p class="card-text">Peso : ${doc.data().peso} gr</p>
                    <p class="card-text">Calorias : ${doc.data().calorias} cal</p>
                    <p 
                        class="card-text">Preço : R$ ${doc.data().preco}
                        <button class="btn btn-success" style="margin-left: 130px;">Incluir</button>
                    </p>
                </div>
            </div>
        </div>
        `;
    })
    document.getElementById("bg").innerHTML = estrutura;
}