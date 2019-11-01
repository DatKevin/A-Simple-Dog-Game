let treatsButton = document.querySelector(".gettreats")
let treatsParent = document.querySelector(".resourcename.treats")
let treatsValue = document.querySelector(".resourcevalue.treats")
let buildingList = document.querySelector(".buildingslist")

let buildingstype = []

let triggerTreatFarm = false

let treatsBase = 0
let treatsMultiplier = 0
let treatsPerSecond =  (treatsMultiplier + 1) + treatsBase 

let updateProductionValues = function() {
	for(let i = 0; i<buildingstype.length; i++) {
		if (buildingstype[i].resource == "treats") {
			let increase = (buildingstype[i].rate * buildingstype[i].number)
			treatsBase += increase
			console.log(increase + "increase")
			console.log(treatsBase + "base")
			treatsPerSecond =  (treatsMultiplier + 1) + treatsBase 
		}
	}	
}

class Buildings {
	constructor(name, resource, rate) {
		this.name = name;
		this.number = 0;
		this.resource = resource;
		this.rate = rate;	
	}
}

//Dynamically adds new buildings 
let unlock = function(name, resource, rate) {
	let addnew = function() {	
		arrayelement.number += 1
		updateProductionValues()
		console.log(arrayelement.number)
	}
	let arrayelement = new Buildings(name, resource, rate)
	buildingstype.push(arrayelement)	
	let newbuilding = document.createElement("span")
	newbuilding.innerText = arrayelement.name
	newbuilding.addEventListener("click", addnew)
	buildingList.append(newbuilding)
}

let increaseTreat = function() {
	treatsValue.innerText = Number(treatsValue.innerText) + treatsPerSecond
	console.log(buildingstype)
}

//Add Treat Button
let addTreat = function() {	
	treatsValue.innerText = Number(treatsValue.innerText) + 1
}

let unlocklist = function() {
	if (Number(treatsValue.innerText) >= 5 && triggerTreatFarm == false) {
		triggerTreatFarm = true
		unlock("Treats Farm","treats", 1)
	}
	updateProductionValues()

}


treatsButton.addEventListener("click",addTreat)

let incrementalchecker = function() {
	setInterval(unlocklist, 1000)
	setInterval(increaseTreat, 1000)
}

incrementalchecker()

