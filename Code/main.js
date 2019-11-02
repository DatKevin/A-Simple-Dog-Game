let treatsButton = document.querySelector(".gettreats")
let treatsParent = document.querySelector(".resourcename.treats")
let treatsValue = document.querySelector(".resourcevalue.treats")
let buildingList = document.querySelector(".buildingslist")

//Records all building types
let buildingstype = []

//Unlockables start off as false and turn true as they become unlocked
let triggerTreatFarm = false

let treatsBase = 0
let treatsMultiplier = 0
let treatsPerSecond =  (treatsMultiplier + 1) + treatsBase 

//Checks all building types and updates the production value of that resource
let updateProductionValues = function() {
	for(let i = 0; i<buildingstype.length; i++) {
		if (buildingstype[i].resource == "treats") {
			treatsBase = (buildingstype[i].rate * buildingstype[i].number)
			treatsMultiplier = (buildingstype[i].multiplier * buildingstype[i].number)
			treatsPerSecond =  (treatsMultiplier + 1) + treatsBase 
		}
	}	
}

//Makes buildings. Rate is Addictive while multiplier is multiplicative.
class Buildings {
	constructor(name, resource, rate, multiplier) {
		this.name = name;
		this.number = 0;
		this.resource = resource;
		this.rate = rate;	
		this.multiplier = multiplier
	}
}

//Dynamically adds new buildings and gives them functionality
let unlock = function(name, resource, rate, multiplier) {
	let addnew = function() {	
		arrayelement.number += 1
		updateProductionValues()
		console.log(arrayelement.number)
	}
	let arrayelement = new Buildings(name, resource, rate, multiplier)
	buildingstype.push(arrayelement)	
	let newbuilding = document.createElement("span")
	newbuilding.innerText = arrayelement.name
	newbuilding.addEventListener("click", addnew)
	buildingList.append(newbuilding)
}

//Increments the Resources based on thier caclulated amount
let increaseTreat = function() {
	treatsValue.innerText = Number(treatsValue.innerText) + treatsPerSecond
	console.log(buildingstype)
}

//Add Treat Button
let addTreat = function() {	
	treatsValue.innerText = Number(treatsValue.innerText) + 1
}

//List of unlockables that dynamically adds them
let unlocklist = function() {
	//Treat Farm unlocks once x Treats have been obtained
	if (Number(treatsValue.innerText) >= 5 && triggerTreatFarm == false) {
		triggerTreatFarm = true
		unlock("Treats Farm","treats", 1, 0)
	}

	//More Dogs are obtained when enough treat farms are created
	for (let i = 0; i < buildingstype; i++)
		if (buildingstype[i].name == "Treats Farm" && buildingstype[i].number == 5) {
			
		}

}

treatsButton.addEventListener("click",addTreat)

//Constantly increments and checks to see if unlock conditions have been met
let incrementalchecker = function() {
	setInterval(unlocklist, 1000)
	setInterval(increaseTreat, 1000)
}

incrementalchecker()

