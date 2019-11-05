//Grabs game opening assets
let treatsButton = document.querySelector(".gettreats")
let buildingList = document.querySelector(".buildingslist")
let resourceList = document.querySelector(".resourcelist")

//Records all building and resource stats
let buildingStats = []
let resourceStats = []
let dogjobStats = []

//Used for capping total number of dogs with thier jobs
let holdvalue = 0

//Unlockables start off as false and turn true as they become unlocked
let triggerTreatFarm = false
let triggerDogRate = false
let triggerBorrows = false
let triggerSticks = false
let triggerDogFarmer = false
let triggerDogFetcher = false


//Iterates through all buildings and updates the production value of that resource
let updateProductionValues = function() {
	for(let i = 0; i<buildingStats.length; i++) {
		let resource = findResource(buildingStats[i].resource)
		resource.base = (buildingStats[i].rate * buildingStats[i].number)
		resource.multiplier = (buildingStats[i].multiplier * buildingStats[i].number)
		resource.updateResource()
		console.log(buildingStats)
	}	
}
//Instntly pulls resource/building/dog job stats from array
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
let findDogJob = function(name) {
	for (let i = 0; i < dogjobStats.length; i++) {
		if (dogjobStats[i].name == name) {
			return dogjobStats[i]
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
//Makes new Dog Jobs
class DogJobs {
	constructor(name, resource, rate) {
		this.name = name
		this.number = 0
		this.resource = resource
		this.rate = rate
	}
}

//Scalable resource creation function
let unlockResource = function(name, value) {
	let arrayelement = new Resource(name, value)
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
	let addnew = function() {
		let resource = findResource(arrayelement.costresource)
		//Checks if the cost for the building is available and reduces resources accordingly
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
	//creates the new building and dynamically adds it to the list
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
	buildingcost.classList.add("buildingcost")
	buildingcost.setAttribute("type", "number")

	newbuilding.append(buildingnumber)
	newbuilding.append(buildingcost)
	buildingList.append(newbuilding)
}

//Added Dogs with jobs for customization of resource priority
let unlockDogJob = function(name,resource,rate) {
	let dogs = findResource("Dogs")

	//Function to add dog to new job
	let addDog = function () {
		if (dogs.value > 0) {
			dogs.value -= 1
			arrayelement.number += 1
			let valueText = document.querySelector(".resourcevalue.Dogs")
			valueText.innerText = Math.round(dogs.value)
			newdogjobvalue.innerText = arrayelement.number
		}
	}

	//function to remove dog from job
	let removeDog = function() {
		if (arrayelement.number > 0) {
			dogs.value += 1
			arrayelement.number -= 1
			let valueText = document.querySelector(".resourcevalue.Dogs")
			valueText.innerText = Math.round(dogs.value)
			newdogjobvalue.innerText = arrayelement.number
		}
	}

	//Dynamically adds new dog jobs to the list
	let arrayelement = new DogJobs(name, resource, rate)
	dogjobStats.push(arrayelement)
	let newdogjob = document.createElement("span")
	let newdogjobvalue = document.createElement("span")
	let addbutton = document.createElement("button")
	let removebutton = document.createElement("button")
	let joblist = document.querySelector(".dogjoblist")

	newdogjob.innerText = name + "Number: "
	newdogjob.classList.add("dogjobname")
	newdogjob.classList.add(name)

	newdogjobvalue.setAttribute("type", "number")
	newdogjobvalue.innerText = arrayelement.number


	addbutton.addEventListener("click", addDog)
	addbutton.classList.add("addbutton")
	addbutton.setAttribute("type", "button")
	addbutton.innerText = "Add Dog"

	removebutton.addEventListener("click", removeDog)
	removebutton.classList.add("removebutton")
	removebutton.setAttribute("type", "button")	
	removebutton.innerText = "Remove Dog"

	newdogjob.append(newdogjobvalue)
	joblist.append(newdogjob)
	joblist.append(addbutton)
	joblist.append(removebutton)
}


//Increments the Resources based on thier caclulated amount
let increment = function() {
	let dogs = findResource("Dogs")

	//Grabs resources for Dog Jobs
	for (let i = 0; i < resourceStats.length; i++) {
		for (let j = 0; j < dogjobStats.length; j++) {
			if (dogjobStats[j].resource == resourceStats[i].name) {
				resourceStats[i].value += dogjobStats[j].rate * dogjobStats[j].number
			}
		}
	}

	//Increments through 
	for (let i = 0; i < resourceStats.length; i++) {
		let element = resourceStats[i]
		let elementValue = document.querySelector(".resourcevalue" + "." + element.name)
		element.value += element.persecond
		elementValue.innerText = Math.round(element.value)
	}
	//Caps the number of dogs = to the value of the burrows
	let burrows = findBuilding("Burrows")
	let calculatetotaldogs = function() {
		let total = 0
		for (let k = 0; k < dogjobStats.length; k++) {
			total += dogjobStats[k].number
		}
		total += dogs.value
		return total
	}
	if (calculatetotaldogs() >= (burrows.number * 5) && holdvalue == 0) {
		holdvalue = dogs.persecond
		dogs.persecond = 0
	}
	if (calculatetotaldogs() < burrows.number * 5 && holdvalue != 0) {
		dogs.persecond = holdvalue
		holdvalue = 0
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
let unlocklist = function(name, resource, rate) {


	//Treat Farm unlocks once x Treats have been obtained
	let treats = findResource("Treats")
	let dogs = findResource("Dogs")
	let sticks = findResource("Sticks")
	let treatsFarm = findBuilding("TreatsFarm")
	let burrows = findBuilding("Burrows")
		
	if (treats.value >= 5 && triggerTreatFarm == false) {
		triggerTreatFarm = true
		unlockBuilding("TreatsFarm", 0, "Treats", 1, 0, 3, 1.1, "Treats")
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

	//Dogs like jobs!
	if (treatsFarm.number >= 5 && triggerDogFarmer == false) {
		triggerDogFarmer = true
		unlockDogJob("DogFarmer","Treats", 2)
	}	
	if (burrows.number >= 1 && triggerDogFetcher == false) {
		triggerDogFetcher = true
		unlockDogJob("DogFetcher","Sticks", 2)
	}
}


//Unlocks default resources and button
unlockResource("Treats", 0)
treatsButton.addEventListener("click",addTreat)

//Constantly increments and checks to see if unlock conditions have been met
let incrementalchecker = function() {
	setInterval(unlocklist, 1000)
	setInterval(increment, 1000)
}

//Starts the game
incrementalchecker()

