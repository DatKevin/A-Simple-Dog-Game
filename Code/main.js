//Grabs game opening assets
let treatsButton = document.querySelector(".gettreats")
let buildingList = document.querySelector(".buildingslist")
let resourceList = document.querySelector(".resourcelist")

//textbox for player
let textbox = document.querySelector(".dialogue")

//Records all building and resource stats
let buildingStats = []
let resourceStats = []
let dogjobStats = []

//Used for capping total number of dogs with thier jobs
let holdvalue = 0

//Unlockables start off as false and turn true as they become unlocked
let trigger = {
	treatfarm: false,
	dograte: false,
	borrows: false,
	sticks: false,
	dogfarmer: false,
	dogfetcher: false,
	gaurddog: false,
	catattack: false,
	gold: false,
	golddevice: false,
	gamend: false
}

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
			let resourceValueText = document.querySelector(".resourcevalue." + resource.name)
			resourceValueText.innerText = Math.floor(resource.value)
			arrayelement.cost *= arrayelement.costgrowth

			buildingnumber.innerText = " Number: " + Math.floor(arrayelement.number)
			buildingcost.innerText = " Cost: " + Math.floor(arrayelement.cost) + " " + arrayelement.costresource

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
		if (dogs.value >= 1) {
			dogs.value -= 1
			arrayelement.number += 1
			let valueText = document.querySelector(".resourcevalue.Dogs")
			valueText.innerText = Math.floor(dogs.value)
			newdogjobvalue.innerText = arrayelement.number
		}
	}

	//function to remove dog from job
	let removeDog = function() {
		if (arrayelement.number >= 1) {
			dogs.value += 1
			arrayelement.number -= 1
			let valueText = document.querySelector(".resourcevalue.Dogs")
			valueText.innerText = Math.floor(dogs.value)
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
	newdogjobvalue.classList.add("dogjobvalue")
	newdogjobvalue.classList.add(name)

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
	joblist.append("\n")
	joblist.append(addbutton)
	joblist.append(removebutton)
}

//Calculates running total of dogs with all thier jobs
let totaldogs = function() {
	let dogs = findResource("Dogs")
	let total = 0
	for (let k = 0; k < dogjobStats.length; k++) {
		total += dogjobStats[k].number
	}
	total += dogs.value
	return total
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

		//Dogs eat treats! They will reduce the value of treats
		if (element.name == "Treats" && dogs != undefined) {
			element.value -= totaldogs() * 1
			//if there aren't enough treats, dogs will start to die
			if (element.value < 0) {
				element.value = 0
				if (dogs.value > 0) {
					dogs.value -= 1
					let dogtextvalue = document.querySelector(".resourcevalue.Dogs")
					dogtextvalue.innerText = dogs.value
					textbox.append("A dog has died of starvation :c \n \n")	
				}
				else {
					for (let j = 0; j < dogjobStats.length; j++) {
						if (dogjobStats[j].number > 0) {
							dogjobStats[j].number -= 1								
							let specialdogtextvalue = document.querySelector(".dogjobvalue." + dogjobStats[j].name)
							specialdogtextvalue.innerText = dogjobStats[j].number
							textbox.append("A dog has died of starvation :c \n \n")
						}
					}	
				}
			}
		}
		elementValue.innerText = Math.floor(element.value)
	}

	//Caps the number of dogs = to the value of the burrows
	let burrows = findBuilding("Burrows")
	if (totaldogs() >= (burrows.number * 5) && holdvalue == 0) {
		holdvalue = dogs.persecond
		dogs.persecond = 0
	}
	if (totaldogs() < burrows.number * 5 && holdvalue != 0) {
		dogs.persecond = holdvalue
		holdvalue = 0
	}
	let dogvalue = document.querySelector(".resourcevalue.Dogs")
	dogvalue.innerText = Math.floor(dogs.value)
	console.log(resourceStats)

	//Triggers Cat attack on random values
	if (trigger.catattack == true) {
		let randomNumber = Math.floor(Math.random() * 10) + 1
		console.log(randomNumber)
		//They attack at x % rate
		if (randomNumber <= 1) {
			textbox.append("The cats have attacked! \n")
			let catAttack = 2
			let guard = findDogJob("GuardDog")
			let difference = guard.number - catAttack

			//battle results are calculated
			if (difference >= 0) {
				textbox.append("The dogs have defended the attack! \n \n")
			}

			//lives are lost in Gaurd Dogs > regular Dogs > other Dogs
			else {
				difference = Math.abs(difference)
				let totaldeaths = 0
				for (let i = 1; i <= difference; i++){
					let once = false
					if (guard.number > 0) {
						guard.number -= 1
						totaldeaths += 1
						let gaurdvalue = document.querySelector(".dogjobvalue" + gaurd.name)
						gaurdvalue.innerText = gaurd.number
					}
					else if (dogs.value > 0) {
						dogs.value -= 1
						totaldeaths += 1
						let dogtextvalue = document.querySelector(".resourcevalue.Dogs")
						dogtextvalue.innerText = dogs.value
					}
					else {
						for (let j = 0; j < dogjobStats.length; j++) {
							if (once == false) {
								if (dogjobStats[j].number > 0) {
									once = true
									dogjobStats[j].number -= 1
									totaldeaths += 1
									let specialdogtextvalue = document.querySelector(".dogjobvalue." + dogjobStats[j].name)
									specialdogtextvalue.innerText = dogjobStats[j].number
								}
							}
						}	
					}
				}
				if (totaldeaths == 1) {
					textbox.append("A dog has lost its life in battle... \n \n")
				}
				else {
					textbox.append(totaldeaths + " dogs have lost thier lives in the attack... \n \n")
				}
			}
		}
	}

	//Updates total number of dogs
	let totaldogcount = document.querySelector(".resourcevalue.TotalDogs")
	totaldogcount.innerText = totaldogs()


	//scrolls textbox to bottom
	textbox.scrollTop = textbox.scrollHeight 
}

//Add Treat Button
let addTreat = function() {	
	let treats = findResource("Treats")
	treats.value += 1
	let valueText = document.querySelector(".resourcevalue.Treats")
	valueText.innerText = Math.floor(treats.value)	
}

//List of unlockables that dynamically adds them
let unlocklist = function(name, resource, rate) {


	//Treat Farm unlocks once x Treats have been obtained
	if (findResource("Treats").value >= 5 && trigger.treatfarm == false) {
		trigger.treatfarm = true
		unlockBuilding("TreatsFarm", 0, "Treats", 1.25, 0, 3, 1.1, "Treats")
	}

	//Dogs start to come in and borrows are created to house the dog
	if (findBuilding("TreatsFarm").number >= 3 && trigger.dograte == false) {
		trigger.dograte = true
		
		unlockResource("Dogs", 1)
		let dogs = findResource("Dogs")
		dogs.persecond += 1
		textbox.append("The dogs are attracted to your treat farms! \n \n")
		textbox.scrollTop = textbox.scrollHeight 
		
		unlockBuilding("Burrows", 1, undefined, 0, 0, 5, 1.2, "Sticks")
		textbox.append("The dog has built a nearby burrow as a home. \n \n")	
		textbox.scrollTop = textbox.scrollHeight 

		//creates Total Dog count
		let totaldogcount = document.createElement("span")
		let totaldogcountvalue = document.createElement("span")
		
		totaldogcount.innerText = "Total Dogs: "
		totaldogcount.classList.add("resourcename")
		totaldogcount.classList.add("TotalDogs")

		totaldogcountvalue.innerText = totaldogs()
		totaldogcountvalue.classList.add("resourcevalue")
		totaldogcountvalue.classList.add("TotalDogs")
		totaldogcountvalue.setAttribute("type", "number")
	
		totaldogcount.append(totaldogcountvalue)
		resourceList.prepend(totaldogcount)
	}

	//Dogs like to fetch sticks
	if (findResource("Dogs").value >= 2 && trigger.sticks == false) {
		trigger.sticks = true
		unlockResource("Sticks", 3)
	}

	//Dogs like jobs!
	if (findBuilding("TreatsFarm").number >= 5 && trigger.dogfarmer == false) {
		trigger.dogfarmer = true
		unlockDogJob("DogFarmer","Treats", 2)
		textbox.append("The dogs have learned how to treats into more treats \n \n")
		textbox.scrollTop = textbox.scrollHeight 
	}	
	if (findBuilding("Burrows").number >= 1 && trigger.dogfetcher == false) {
		trigger.dogfetcher = true
		unlockDogJob("DogFetcher","Sticks", 2)
		textbox.append("Dogs like to fetch sticks! \n \n")
		textbox.scrollTop = textbox.scrollHeight 
	}

	//Unlocks Gaurd Dogs
	if (totaldogs() >= 10 && trigger.gaurddog == false) {
		trigger.gaurddog = true
		unlockDogJob("GuardDog", undefined, 0)
		textbox.append("The population is becoming pretty big, you might need protection \n \n")
		textbox.scrollTop = textbox.scrollHeight
	}

	//The cats notice your growing village and attack!
	if (totaldogs() >= 15 && trigger.catattack == false) {
		trigger.catattack = true
	}

	if (totaldogs() >= 20 && trigger.gold == false) {
		trigger.gold = true
		unlockResource("Gold", 1)
		unlockDogJob("Miner", "Gold", 1)
		textbox.append("A dog has come with a gold bar?\n \n")
		textbox.scrollTop = textbox.scrollHeight
	}

	if (findResource("Gold").value >= 10 && trigger.golddevice == false) {
		trigger.golddevice = true
		unlockBuilding("GoldMachine", 0, undefined, 0, 0, 20, 1.1, "Gold")
		textbox.append("A dog had brought back some blueprints of a strange device")
		textbox.scrollTop = textbox.scrollHeight
	}

	if (findBuilding("GoldMachine").number >= 1 && trigger.gameend == false) {
		trigger.gameend = true
		alert("You won!")
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

