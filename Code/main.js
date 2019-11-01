let treatsButton = document.querySelector(".gettreats")
let treatsParent = document.querySelector(".resourcename.treats")
let treatsValue = document.querySelector(".resourcevalue.treats")
let buildingList = document.querySelector(".buildingslist")

let buildingstype = []

let triggerTreatFarm = false

let treatsPerSecond = 1

class Buildings {
	constructor(name, resource, rate) {
		this.name = name;
		this.number = 0;
		this.produces = resource
		this.rate = rate
	}
}

let addnew = function() {	
	newbuilding.number += 1
}

//Dynamically adds new buildings 
let unlock = function(name) {
	let arrayelement = new Buildings(name)
	buildingstype.push(arrayelement)	
	let newbuilding = document.createElement("span")
	newbuilding.innerText = arrayelement.name
	newbuilding.addEventListener("click", addnew)
	buildingList.append(newbuilding)
	console.log("It works!")
}

let increaseTreat = function() {
	treatsValue.innerText = Number(treatsValue.innerText) + 2
}

//Add Treat Button
let addTreat = function() {	
	treatsValue.innerText = Number(treatsValue.innerText) + 1
}

let unlocklist = function() {
	if (Number(treatsValue.innerText) >= 5 && triggerTreatFarm == false) {
		triggerTreatFarm = true
		unlock("Treats Farm","treats", "1")
	}
}


treatsButton.addEventListener("click",addTreat)

let incrementalchecker = function() {
	setInterval(unlocklist, 1000)
	setInterval(increaseTreat, 1000)
}

incrementalchecker()
