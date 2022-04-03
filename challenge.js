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

function main(data, callback, task) {

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
	const regionsOrigem = callback(dataPolished, "regiaoOrigem")
	const regionsDestino = callback(dataPolished, "regiaoDestino")
	if(task === 1) console.log(dataPolished);
}

//validação do codigo de barras.

/**
 *  Destiny Region Track
 *  
 *  função regiaoDestinoOrigem resolve desafio 1 e 4
 *  a cada iteração no array de data >
 *  está sendo filtrado os elementos por região >
 *  atribui esse elemento a sua região, este sendo um array definido no escopo da função com um objeto representado o total de pacotes >
 *  e muda seu valor total.
 */

//Sudeste 001 ~ 099 (1 ~ 99)
//Sul 100 ~ 199 (100 ~199)
//Centro Oeste 201 ~ 299
//Nordeste 300 ~ 399
//Norte 400 ~ 499


function regiaoDestinoOrigem(data, destinoOrOrigem){
	let regioes = {}

	const sudeste = [{total: 0}]
	const sul = [{total: 0}]
	const centroOeste = [{total: 0}]
	const nordeste = [{total: 0}]
	const norte = [{total: 0}]


	data.forEach((element, index) => {
		const regionNum = parseInt(element[destinoOrOrigem])
		
		
		// se o pacote for de origem centro oeste e o tipo do produto é joias atualizara para status invalido com mensagem.
		if((destinoOrOrigem === "regiaoOrigem") && (regionNum >= 201 && regionNum <= 299) && (element["tipoPacote"] === "001")) {
			data[index].pacoteValido = false
			data[index].message = "Não transportamos joias de origem Centro-Oeste"
			return 
		}


		//se pacote for inválido irá pular.
		if(!element.pacoteValido) {
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

// Essa função irá listar os pacotes por região de Origem.
function regiaoOrigem(data) {
	
}
main(data, regiaoDestinoOrigem, 1)