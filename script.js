//localstorage
const getLocalStorage = () => JSON.parse(localStorage.getItem('db_produto'))
const setLocalStorage = () => localStorage.setItem('db_produto', JSON.stringify(dadosProduto))

//create
const criarProduto = function (produto) {
    const dadosProduto = getLocalStorage()
    dadosProduto.push(produto)
    setLocalStorage(dadosProduto)
}

//read
const lerProduto = () => getLocalStorage()

//update
const updateProduto = (index, produto) => {
    const dadosProduto = lerProduto()
    dadosProduto[index] = produto
    setLocalStorage(dadosProduto)
}

//delete
const deleteProduto = (index) => {
    const dadosProduto = lerProduto()
    dadosProduto.splice(index, 1)
    setLocalStorage(dadosProduto)
}

//interações:
const campoValido = () => {
    return document.getElementById('form').reportValidity()
}

//abrir pop up
const openModal = () => document.getElementById('modal').classList.add('active')

//fechar pop up
const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')
}

//limpar campos
const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = '')
}

//salvar produtos
const saveProduto = () => {
    if (campoValido()) {
        const produto = {
            codigo: document.getElementById('codigo'),
            nome: document.getElementById('nome'),
            quantidade: document.getElementById('quant'),
            valor: document.getElementById('valor'),
            data: document.getElementById('data')
        }
        const index = document.getElementById('nome').dataset.index
        if (index == 'new') {
            criarProduto(produto)
            updateTable()
            closeModal()
        } else {
            updateProduto(index, produto)
            updateTable()
            closeModal()
        }
    }
}

//criar linha
const criarLinha = (produto, index) => {
    const novaLinha = document.createElement('tr')
    novaLinha.innerHTML = `
    <td>${produto.codigo}</td>
    <td>${produto.nome}</td>
    <td>${produto.quant}</td>
    <td>${produto.valor}</td>
    <td>${produto.data}</td>
    <td>
        <button type="button" class="button green" id="edit-${index}">Editar</button>
        <button type="button" class="button red" id="delete-${index}" >Excluir</button>
    </td>
    `
    document.querySelector('#tableProduto>tbody').appendChild(novaLinha)
}

//limpar tabela
// const clearTable = () => {
//     const linhas = document.querySelectorAll('#tableProduto>tbody tr')
//     linhas.forEach(linha => linha.parentNode.removeChild(linha))
// }

//atualizar tabela
const updateTable = () => {
    const dadosProduto = lerProduto
    clearTable()
    dadosProduto.forEach(criarLinha)
}

//preencher
const fillFields = (produto) => {
    document.getElementById('código').value = produto.codigo
    document.getElementById('nome').value = produto.nome
    document.getElementById('quantidade').value = produto.quant
    document.getElementById('valor').value = produto.valor
    document.getElementById('data').value = produto.data
    document.getElementById('nome').dataset.index = produto.index
}

//editar produto
const editProduto = (index) => {
    const produto = lerProduto()[index]
    produto.index = index
    fillFields(produto)
    openModal()
}

//editar (deletar)
const editDelete = (event) => {
    if (event.target.type == 'button') {

        const [action, index] = event.target.id.split('-')

        if (action == 'edit') {
            editProduto(index)
        } else {
            const produto = lerProduto()[index]
            const response = confirm(`Deseja realmente excluir o produto ${produto.nome}?`)
            if (response) {
                deleteProduto(index)
                updateTable()
            }
        }
    }
}

//eventos
document.getElementById('cadastrarProduto')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveProduto)

document.querySelector('#tableProduto>tbody')
    .addEventListener('click', editDelete)

document.getElementById('cancelar')
    .addEventListener('click', closeModal)