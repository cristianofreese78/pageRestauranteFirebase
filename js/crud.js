// Cadastro de pratos para um restaurante em um formulário com opções Create/Edit
// Recebe nome do prato, descrição, peso, calorias, preço
// Apresenta registro dos pratos em uma tabela com opções Update/Delete
// Base de dados "bdPratos" com banco de dados noSql Firebase

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
const pratosRef = collection(db, 'pratosProntos');

// Recebe conteúdo do form cadastroPratos
let form = document.getElementById('cadastroPratos');

// Disparo de evento submit através da tag button para inclusão ou edição de registros
form.addEventListener('submit', function(){
            
    // Dados do form
    let nmPrato = document.querySelector('#nomePrato').value;
    let dsPrato = document.querySelector('#descricaoPrato').value;
    let psPrato = document.querySelector('#pesoPrato').value;
    let clrPrato = document.querySelector('#caloriasPrato').value;
    let prcPrato = document.querySelector('#precoPrato').value;
    let lnkImgPrato = document.querySelector('#linkImgPrato').value;
    
    // Recebe valor da tag button para identificar inclusão ou edição do elemento
    // Contém vazio se a operação é create ou indice do registro se for update
    let submitButton = document.querySelector('button').value;
       
    if(!submitButton){
        //CREATE - Inserção do registro no banco bdPratos
        addDoc (pratosRef, {
            nome: nmPrato, descricao: dsPrato, peso: psPrato,
            preco: prcPrato, calorias: clrPrato, link: lnkImgPrato});
    }else{
        //UPDATE - Atualização de um registro pelo id 
        updateDoc(doc(pratosRef, submitButton),{  
            nome: nmPrato, descricao: dsPrato, peso: psPrato,
            preco: prcPrato, calorias: clrPrato, link: lnkImgPrato});
    }
       
    // Limpa form e atualiza dados dos pratos cadastrados na tabela
    form.reset();
    listarDados();
    document.querySelector('button').value = '';
})

// Carrega registros de bdPratos atualizando a tabela
async function listarDados(){
    let estrutura = '';
    let nrRegistros = 0;
    
    //READ - Leitura de todos registros - id, registro completo e por campo
    const queryRegistros = await getDocs(pratosRef)
    queryRegistros.forEach((doc) => {
        const {nome, descricao, calorias, peso, preco, link} = doc.data()
        estrutura += `
            <tr>
                <td>${doc.data().nome}</td>
                <td>${doc.data().peso} gr</td>
                <td>${doc.data().descricao}</td>
                <td>${doc.data().calorias} cal</td>
                <td>R$ ${doc.data().preco}</td>
                <td>
                    <button data-edit="${doc.id}" class="btn btn-warning" value="1">Editar</button> 
                    <button data-remove="${doc.id}" class="btn btn-danger" value="2">Deletar</button>
                </td> 
            </tr>
            `;
        nrRegistros++;
    })
    // Injeta conteúdo na página de cadastro se houver registros ou mensagem de Nenhum prato cadastrado se vazio
    if (nrRegistros > 0) document.querySelector('table tbody').innerHTML = estrutura;
    else{
        let estrutura = `
        <tr>
            <td colspan="6" align="center">Nenhum aluno cadastrado</td>
        </tr>
        `;
        document.querySelector('table tbody').innerHTML = estrutura;
    }

    // Atribui funcionalidade de Edit ou Delete aos botões criados dinamicamente na tabela para cada registro
    // Se o valor do botão for 1 - Edit, se for 2 - Delete
    const buttons = document.querySelectorAll(".btn")
    buttons.forEach((button)=>{
        button.addEventListener("click",()=>{
            switch(button.value){
                case "1":{
                    editaItem(button.dataset.edit);
                    break;
                }
                case "2":{
                    deletaItem(button.dataset.remove);
                    break;
                }
            }
        })
    })
}

// Função utilizada para delete de um registro referenciado por id
async function deletaItem(id){
    const queryRegistroDelete = await doc(pratosRef, id);
    //DELETE - Remoção de registro pelo id
    deleteDoc(queryRegistroDelete)
    listarDados();
    form.reset();
    document.querySelector('button').value = '';
}

// Função utilizada para edit em um registro referenciado por id
async function editaItem(id){
    // READ - Leitura de um registro unico pelo id
    const queryRegistro = await getDoc(doc(pratosRef, id))
    if (queryRegistro.exists()) {
        console.log(queryRegistro.id)
        console.log(queryRegistro.data())
    
        document.querySelector('#nomePrato').value = queryRegistro.data().nome;
        document.querySelector('#descricaoPrato').value = queryRegistro.data().descricao;
        document.querySelector('#pesoPrato').value = queryRegistro.data().peso;
        document.querySelector('#caloriasPrato').value = queryRegistro.data().calorias;
        document.querySelector('#precoPrato').value = queryRegistro.data().preco;
        document.querySelector('#linkImgPrato').value = queryRegistro.data().link;
       
        // Atribui id diretamente a propriedade value da tag button para identificação 
        // de operação de edição em função do indice a ser tratado
        document.querySelector('button').value = id;
    }
}

// Listagem de elementos para manter tabela sempre atualizada 
listarDados();