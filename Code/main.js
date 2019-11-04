let treatsButton = document.querySelector(".gettreats")
let buildingList = document.querySelector(".buildingslist")
let resourceList = document.querySelector(".resourcelist")

//Records all building and resource stats
let buildingStats = []
let resourceStats = []

//Unlockables start off as false and turn true as they become unlocked
let triggerTreatFarm = false
let triggerDogRate = false
let triggerBorrows = false
let triggerSticks = false

//Checks all building types and updates the production value of that resource
let updateProductionValues = function() {
	for(let i = 0; i<buildingStats.length; i++) {
		let resource = findResource(buildingStats[i].resource)
		resource.base = (buildingStats[i].rate * buildingStats[i].number)
		resource.multiplier = (buildingStats[i].multiplier * buildingStats[i].number)
		resource.updateResource()
		console.log(buildingStats)
	}	
}
//Instntly pulls resource/building stats from array
let findResource = function(name) {
	for (let i = 0; i < resourceStats.length; i++) {
		if (resourceStats[i].name == name) {
			return resourceStats[i]
		}
	}
}

let findBuilding = function(name) {
	for (let i = 0; i < buildingStats.length; i++) {
		if (buildingStats[i].name == name) {
			return buildingStats[i]
		}
	}
}

//Makes buildings. Rate is Addictive while multiplier is multiplicative.
class Building {
	constructor(name, number, resource, rate, multiplier, cost, costgrowth, costresource) {
		this.name = name;
		this.number = number;
		this.resource = resource;
		this.rate = rate;	
		this.multiplier = multiplier
		this.cost = cost
		this.costgrowth = costgrowth
		this.costresource = costresource
	}
}


//Makes resources and allows for adding new resources and updates
class Resource {
	constructor(name, value) {
		this.name = name;
		this.value = 0;
		this.base = 0;
		this.multiplier = 0;
		this.persecond = 0;
	}
	//updates the rate per second
	updateResource () {
		this.persecond = (this.multiplier + 1) * this.base
	}
}

//Scalable resource creation function
let unlockResource = function(name, value) {
	let arrayelement = new Resource(name)
	resourceStats.push(arrayelement)
	let newresource = document.createElement("span")
	let newresourcevalue = document.createElement("span")
	
	newresource.innerText = name + ": "
	newresource.classList.add("resourcename")
	newresource.classList.add(name)
	
	newresourcevalue.innerText = value
	newresourcevalue.classList.add("resourcevalue")
	newresourcevalue.classList.add(name)
	newresourcevalue.setAttribute("type", "number")
	
	newresource.append(newresourcevalue)
	resourceList.append(newresource)
}

//Dynamically adds new buildings and gives them functionality
let unlockBuilding = function(name, number, resource, rate, multiplier, cost, costgrowth, costresource) {
	//Increases the number of the respective building and reduces resource as a cost
	let addnew = function() {
		let resource = findResource(arrayelement.costresource)
		if (resource.value >= arrayelement.cost) {	
			arrayelement.number += 1
			resource.value -= arrayelement.cost
			arrayelement.cost *= arrayelement.costgrowth

			buildingnumber.innerText = " Number: " + Math.round(arrayelement.number)
			buildingcost.innerText = " Cost: " + Math.round(arrayelement.cost) + " " + arrayelement.costresource

			updateProductionValues()
			console.log(arrayelement.number)
		}
		console.log("Button works")
	}
	let arrayelement = new Building(name, number, resource, rate, multiplier, cost, costgrowth, costresource)
	buildingStats.push(arrayelement)
	
	let newbuilding = document.createElement("span")
	newbuilding.innerText = name
	newbuilding.addEventListener("click", addnew)
	newbuilding.classList.add("buildingname")
	newbuilding.classList.add(name)

	let buildingnumber = document.createElement("span")
	buildingnumber.innerText = " Number: " + number
	buildingnumber.classList.add("buildingnumber")
	buildingnumber.setAttribute("type", "number")

	let buildingcost = document.createElement("span")
	buildingcost.innerText = " Cost: " + cost + " " + costresource 
	buildingnumber.classList.add("buildingcost")
	buildingnumber.setAttribute("type", "number")

	newbuilding.append(buildingnumber)
	newbuilding.append(buildingcost)
	buildingList.append(newbuilding)
}

//Increments the Resources based on thier caclulated amount
let increment = function() {
	let dogs = findResource("Dogs")

	//Dogs like to fetch sticks constantly
	let sticks = findResource("Sticks")
	if (sticks != undefined) {
		sticks.value += dogs.value * 0.2
	}

	//Increments through 
	for (let i = 0; i < resourceStats.length; i++) {
		let element = resourceStats[i]
		let elementValue = document.querySelector(".resourcevalue" + "." + element.name)
		element.value += element.persecond
		elementValue.innerText = Math.round(element.value)
		console.log(resourceStats)
	}
	//Caps the number of dogs = to the value of the burrows
	let burrows = findBuilding("Burrows")
	if (dogs.value >= (burrows.number * 5)) {
		dogs.value = burrows.number * 5
	}
	let dogvalue = document.querySelector(".resourcevalue.Dogs")
	dogvalue.innerText = dogs.value
	console.log(resourceStats)
}

//Add Treat Button
let addTreat = function() {	
	let treats = findResource("Treats")
	treats.value += 1
	let valueText = document.querySelector(".resourcevalue.Treats")
	valueText.innerText = Math.round(treats.value)	
}

//List of unlockables that dynamically adds them
let unlocklist = function() {
	//Treat Farm unlocks once x Treats have been obtained
	let treats = findResource("Treats")
	let dogs = findResource("Dogs")
	let sticks = findResource("Sticks")
	let treatsFarm = findBuilding("TreatsFarm")
	let burrows = findBuilding("Burrows")
		
	if (treats.value >= 5 && triggerTreatFarm == false) {
		triggerTreatFarm = true
		unlockBuilding("TreatsFarm", 0, "Treats", 1, 0, 10, 1.1, "Treats")
	}

	//Dogs start to come in and borrows are created to house the dog
	if (treatsFarm.number >= 3 && triggerDogRate == false) {
		triggerDogRate = true
		
		unlockResource("Dogs", 1)
		let dogs = findResource("Dogs")
		dogs.persecond += 1
		
		unlockBuilding("Burrows", 1, undefined, 0, 0, 5, 1.2, "Sticks")
		let burrows = findBuilding("Burrows")
	}

	//Dogs like to fetch sticks
	if (dogs.value >= 1 && triggerSticks == false) {
		triggerSticks = true
		unlockResource("Sticks",0)
	}
}

treatsButton.addEventListener("click",addTreat)

//Unlocks default resources
unlockResource("Treats", 0)

//Constantly increments and checks to see if unlock conditions have been met
let incrementalchecker = function() {
	setInterval(unlocklist, 1000)
	setInterval(increment, 1000)
}

incrementalchecker()

