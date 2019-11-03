let treatsButton = document.querySelector(".gettreats")
let buildingList = document.querySelector(".buildingslist")
let resourceList = document.querySelector(".resourcelist")

//Records all building and resource stats
let buildingStats = []
let resourceStats = []

//Unlockables start off as false and turn true as they become unlocked
let triggerTreatFarm = false

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
//Instntly pulls resource stats from array
let findResource = function(name) {
	for (let i = 0; i < resourceStats.length; i++) {
		if (resourceStats[i].name == name) {
			return resourceStats[i]
		}
	}
}

//Makes buildings. Rate is Addictive while multiplier is multiplicative.
class Building {
	constructor(name, resource, rate, multiplier) {
		this.name = name;
		this.number = 0;
		this.resource = resource;
		this.rate = rate;	
		this.multiplier = multiplier
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
let unlock = function(name, resource, rate, multiplier) {
	let addnew = function() {	
		arrayelement.number += 1
		updateProductionValues()
		console.log(arrayelement.number)
	}
	let arrayelement = new Building(name, resource, rate, multiplier)
	buildingStats.push(arrayelement)
	let newbuilding = document.createElement("span")
	newbuilding.innerText = name
	newbuilding.addEventListener("click", addnew)
	buildingList.append(newbuilding)
}

//Increments the Resources based on thier caclulated amount
let increaseTreat = function() {
	let treats = findResource("Treats")
	let valueText = document.querySelector(".resourcevalue.Treats")
	treats.value = treats.value + treats.persecond
	valueText.innerText = treats.value 
	console.log(resourceStats)
}

//Add Treat Button
let addTreat = function() {	
	let treats = findResource("Treats")
	treats.value += 1
	let valueText = document.querySelector(".resourcevalue.Treats")
	treats.updateResource
	valueText.innerText = treats.value	
}

//List of unlockables that dynamically adds them
let unlocklist = function() {
	//Treat Farm unlocks once x Treats have been obtained
	let treats = findResource("Treats")
	if (treats.value >= 5 && triggerTreatFarm == false) {
		triggerTreatFarm = true
		unlock("Treats Farm","Treats", 1, 0)
	}

	//More Dogs are obtained when enough treat farms are created
	for (let i = 0; i < buildingStats; i++)
		if (buildingStats[i].name == "Treats Farm" && buildingStats[i].number == 5) {
		}

}

treatsButton.addEventListener("click",addTreat)

//Unlocks default resources
unlockResource("Dogs", 1)
unlockResource("Treats", 0)

//Constantly increments and checks to see if unlock conditions have been met
let incrementalchecker = function() {
	setInterval(unlocklist, 1000)
	setInterval(increaseTreat, 1000)
}

incrementalchecker()

