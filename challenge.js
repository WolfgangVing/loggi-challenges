/**
1. Identificar a região de destino de cada pacote, com totalização de
pacotes (soma região);

2. Saber quais pacotes possuem códigos de barras válidos e/ou
inválidos;

3. Identificar os pacotes que têm como origem a região Sul e
Brinquedos em seu conteúdo;

4. Listar os pacotes agrupados por região de destino (Considere apenas
pacotes válidos);

5. Listar o número de pacotes enviados por cada vendedor (Considere
apenas pacotes válidos);

6. Gerar o relatório/lista de pacotes por destino e por tipo (Considere
apenas pacotes válidos);

7. Se o transporte dos pacotes para o Norte passa pela Região
Centro-Oeste, quais são os pacotes que devem ser despachados no
mesmo caminhão?

8. Se todos os pacotes fossem uma fila qual seria a ordem de carga
para o Norte no caminhão para descarregar os pacotes da Região
Centro Oeste primeiro;

9. No item acima considerar que as jóias fossem sempre as primeiras a
serem descarregadas;

10. Listar os pacotes inválidos.
*/

/**
Considere as seguintes restrições:
1) A Loggi não envia produtos que não sejam dos tipos acima informados.
2) Não é possível despachar pacotes contendo jóias tendo como região de
origem o Centro-oeste;
3) O vendedor 367 está com seu CNPJ inativo e, portanto, não pode mais
enviar pacotes pela Loggi, os códigos de barra que estiverem relacionados
a este vendedor devem ser considerados inválidos.
*/

/**
 *  Lembrar,
 *  1. os códigos da loggi possuem apenas 15 dígitos, significa que qualquer codigoBarra com menos ou mais é inválidado.
 *  Codigos de barra relacionado com 
 */
const obj = {
	pacote: 1,
	codigoBarra: 288355555123888,
	regiaoOrigem: 288,
	regiaoDestino: 355,
	codigoLoggi: 555,
	codigoVendedor: 123,
	tipoPacote: 888
}

//Retrienving the data
let data = require('./pacotes.json');

function main(data, filtrarRegioesCB, filtrarTiposCB, task) {

	let dataPolished = []
	
	data.forEach((element, index) => {
		const codigoBarra = element.barcode
		//console.log(element.codigoBarra)

		if(codigoBarra.length > 15 || codigoBarra.length < 15) {
			return dataPolished.push({
				id: index+1,
				codigoBarra: codigoBarra,
				pacoteValido: false,
				message: "Codigo de barras inválido"
			})
		}
		if(codigoBarra.includes("367")) {
			return dataPolished.push({
				id: index+1,
				codigoBarra: codigoBarra,
				codigoVendedor: "367",
				pacoteValido: false,
				message: "Este CNPJ está desativado."
			})
		}
		
		dataPolished.push({
			id: index+1,
			codigoBarra: codigoBarra,
			regiaoOrigem: codigoBarra.slice(0, 3),
			regiaoDestino: codigoBarra.slice(3, 6),
			codigoLoggi: codigoBarra.slice(6, 9),
			codigoVendedor: codigoBarra.slice(9, 12),
			tipoPacote: codigoBarra.slice(12, 15),
			pacoteValido: true
		})
	});

	//Essas constantes estão chamando a callback e armazenando o retorno da função
	const regionsOrigem = filtrarRegioesCB(dataPolished, "regiaoOrigem")
	const regionsDestino = filtrarRegioesCB(dataPolished, "regiaoDestino")
	
	if(task === 1 || task === 2) console.log(regionsOrigem);
	if(task === 3) console.log(searchSulBrin(regionsOrigem))
	if(task === 4) console.log(regionsDestino);

	console.log(listarVendedores(dataPolished))
}

/**
 *  Destiny Region Track
 *  
 *  função regiaoDestinoOrigem resolve desafio 1 e 4
 *  a cada iteração no array de data >
 *  está sendo filtrado os elementos por região >
 *  atribui esse elemento a sua região, este sendo um array definido no escopo da função com um objeto representado o total de pacotes >
 *  e muda seu valor total.
 */


function regiaoDestinoOrigem(data, destinoOrOrigem){
	let regioes = {}

	const sudeste = [{total: 0}]
	const sul = [{total: 0}]
	const centroOeste = [{total: 0}]
	const nordeste = [{total: 0}]
	const norte = [{total: 0}]


	data.forEach((element, index) => {
		const regionNum = parseInt(element[destinoOrOrigem])
		const typeNum = parseInt(element["tipoPacote"])
		
		//se o elemento já estiver invalidado fechará e encerará essa iteração para não sobreescrever o aviso.
		if(!element.pacoteValido) {
			return	
		}

		// se o pacote for de origem centro oeste e o tipo do produto é joias atualizara para status invalido com mensagem.
		if((destinoOrOrigem === "regiaoOrigem") && (regionNum >= 201 && regionNum <= 299) && (element["tipoPacote"] === "001")) {
			data[index].pacoteValido = false
			data[index].message = "Não transportamos joias com origem Centro-Oeste"
			return 
		}

		//validação de conteudo dos pacotes, se não for um tipo processado pela Loggi invalidará o código de barras.
		if(((typeNum !== 001) && (typeNum !== 111) && (typeNum !== 333) && (typeNum !== 555) && (typeNum !== 888))){
			data[index].pacoteValido = false
			data[index].message = "Esse tipo de conteudo não é transportado."
			return
		}

		
		if(regionNum >= 1 && regionNum <= 99) {
			const total = sudeste.push(element) - 1
			return sudeste[0].total = total
		}

		if(regionNum >= 100 && regionNum <= 199) {
			const total = sul.push(element) - 1
			return sul[0].total = total
		}

		if(regionNum >= 201 && regionNum <= 299) {
			const total = centroOeste.push(element) - 1
			return centroOeste[0].total = total
		}

		if(regionNum >= 300 && regionNum <= 399) {
			const total = nordeste.push(element) - 1
			return nordeste[0].total = total
		}

		if(regionNum >= 400 && regionNum <= 499) {
			const total = norte.push(element) - 1
			return norte[0].total = total
		}
	})
	regioes.sudeste = sudeste
	regioes.sul = sul
	regioes.centroOeste = centroOeste
	regioes.nordeste = nordeste
	regioes.norte = norte

	return regioes
}
//task 2 Indentificar pkgs de origem Sul e brinquedos como conteúdo.

function searchSulBrin (data) {
	const pkgsSulBrinquedos = []
	
	//o primeiro elemento sempre será o total de brinquedos
	for (let i = 1; i < data.sul.length; i++) {
		const element = data.sul[i];
		const contentPacote = element["tipoPacote"]

		if(contentPacote === "888") return pkgsSulBrinquedos.push(element)
	}
	if(pkgsSulBrinquedos.length === 0) return `Não foram encontrados pacotes de origem Sul com conteudo de brinquedos.`
	return `Pacotes de origem Sul com conteúdos sendo brinquedos: \n${pkgsSulBrinquedos}`
}

function listarVendedores (data) {
	const tempData = data
	const vendedores = {}
	
	tempData.forEach((element, index, array)=> {
		//Não lista pacotes invalidos
		if(!element.pacoteValido) return;
		
		if(!vendedores[element["codigoVendedor"]]) {
			return vendedores[element["codigoVendedor"]] = [element]
		}
		
		vendedores[element["codigoVendedor"]].push(element)
	})
	
	return vendedores
}

main(data, regiaoDestinoOrigem)


// const obj1 = {codeVendedor: 321}

// const newObj = {}

// if(!newObj[obj1["codeVendedor"]]) {
// 	newObj[obj1["codeVendedor"]] = obj1
// }

// console.log(newObj)