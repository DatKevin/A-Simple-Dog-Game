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
	treatFarm: false,
	dogRate: false,
	borrows: false,
	sticks: false,
	dogFarmer: false,
	dogFetcher: false,
	gaurdDog: false,
	catAttack: false,
	gold: false,
	goldDevice: false,
	gameEnd: false,
	stickBundler: false,
	negativeTreats: false
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
	constructor(name, number, resource, rate, multiplier, cost, 
				costgrowth, costresource, cost2, costresource2, description) {
		this.name = name;
		this.number = number;
		this.resource = resource;
		this.rate = rate;	
		this.multiplier = multiplier
		this.cost = cost
		this.costgrowth = costgrowth
		this.costresource = costresource
		this.cost2 = cost2
		this.costresource2 = costresource2
		this.description = description
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
	newresource.innerText = name + ": "
	newresource.classList.add("resourcename")
	newresource.classList.add(name)
	
	let newresourcevalue = document.createElement("span")
	newresourcevalue.innerText = value
	newresourcevalue.classList.add("resourcevalue")
	newresourcevalue.classList.add(name)
	newresourcevalue.setAttribute("type", "number")

	let newresourcepersecond = document.createElement("span")
	newresourcepersecond.innerText = 0
	newresourcepersecond.classList.add("resourcepersecond")
	newresourcepersecond.classList.add(name)
	newresourcepersecond.setAttribute("type","number")

	newresource.append(newresourcevalue)
	newresource.append(newresourcepersecond)
	newresource.append("/second")
	resourceList.append(newresource)
}

//Dynamically adds new buildings and gives them functionality
let unlockBuilding = function(name, number, resource, rate, multiplier, 
	cost, costgrowth, costresource, cost2, costresource2, description) {

	//creates the new building and dynamically adds it to the list
	let arrayelement = new Building(name, number, resource, rate, multiplier, 
		cost, costgrowth, costresource, cost2, costresource2, description)
	buildingStats.push(arrayelement)
	
	let newbuilding = document.createElement("span")
	newbuilding.innerText = name
	newbuilding.classList.add("buildingname")

	let buildingnumber = document.createElement("span")
	buildingnumber.innerText = " Number: " + number
	buildingnumber.classList.add("buildingnumber")
	newbuilding.classList.add(name)
	buildingnumber.setAttribute("type", "number")

	let buildingcost = document.createElement("span")
	buildingcost.innerText = " Cost: " + cost + " " + costresource 
	buildingcost.classList.add("buildingcost")
	newbuilding.classList.add(name)
	buildingcost.setAttribute("type", "number")

	let buildingcost2 = document.createElement("span")
	if (costresource2 != null) {
		buildingcost2.classList.add("buildingcost2")
		newbuilding.classList.add(name)
		buildingcost2.setAttribute("type", "number")
		buildingcost.innerText = " Cost: " + Math.floor(arrayelement.cost)
			+ " " + arrayelement.costresource + " and " 
			+ Math.floor(arrayelement.cost2) + " " + costresource2
	}

	//Checks if the cost for the building is available and reduces resources accordingly
	let addnew = function() {
		let resource = findResource(arrayelement.costresource)
		if (resource.value >= arrayelement.cost) {	
			arrayelement.number += 1
			resource.value -= arrayelement.cost
			let resourceValueText = document.querySelector(".resourcevalue." + resource.name)
			resourceValueText.innerText = Math.floor(resource.value)
			arrayelement.cost *= arrayelement.costgrowth

			//checks for a second cost resource
			if (arrayelement.costresource2 != null) {
				let resource2 = findResource(arrayelement.costresource2)
				let resource2ValueText = document.querySelector(".resourcevalue." + resource2.name)
				resource2.value -= arrayelement.cost2
				resource2ValueText.innerText = Math.floor(resource2.value)
				arrayelement.cost2 *= arrayelement.costgrowth
				buildingnumber.innerText = " Number: " + arrayelement.number
				buildingcost.innerText = " Cost: " + Math.floor(arrayelement.cost) + " "
				 	+ arrayelement.costresource2 + " and " + Math.floor(arrayelement.cost2) 
					+ costresource2
			}
			else {
				buildingnumber.innerText = " Number: " + arrayelement.number
				buildingcost.innerText = " Cost: " + Math.floor(arrayelement.cost)
				+ " " + arrayelement.costresource
			}

			if (resource != null) {
				buildingratepersecond.innerText = arrayelement.number * arrayelement.rate
			}
			updateProductionValues()
			console.log(arrayelement.number)
		}
		console.log("Button works")
	}

	let addbutton = document.createElement("button")
	addbutton.addEventListener("click", addnew)
	addbutton.classList.add("addbutton")
	addbutton.classList.add("buildingbutton")
	addbutton.setAttribute("type", "button")
	addbutton.innerText = "Add Building"

	let buildingdescription = document.createElement("span")
	buildingdescription.innerText = description
	buildingdescription.classList.add("buildingdescription")
	buildingdescription.classList.add(name)

	//checks if the building actually produces anything
	let buildingratepersecond = document.createElement("span")
	if (resource != null) {
		buildingratepersecond.innerText = rate
		buildingratepersecond.classList.add("buildingratepersecond")
		buildingratepersecond.classList.add(name)
		buildingratepersecond.setAttribute("type","number")
	}


	newbuilding.append(addbutton)
	newbuilding.append(buildingnumber)
	newbuilding.append(buildingcost)
	if (costresource2 != null) {
		newbuilding.append(buildingcost2)
	}
	newbuilding.append(buildingdescription)
	if (resource != null) {
		newbuilding.append(buildingratepersecond)
		newbuilding.append(" " + resource)
		newbuilding.append("/second")
	}
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
			if (arrayelement.resource != null) {
				dogratepersecond.innerText = arrayelement.number * arrayelement.rate
			}
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
			if (arrayelement.resource != null) {
				dogratepersecond.innerText = arrayelement.number * arrayelement.rate
			}
		}
	}

	let joblist = document.querySelector(".dogjoblist")
	let arrayelement = new DogJobs(name, resource, rate)
	dogjobStats.push(arrayelement)

	let newdogjob = document.createElement("span")
	newdogjob.innerText = name + "   Number: "
	newdogjob.classList.add("dogjobname")
	newdogjob.classList.add(name)

	let newdogjobvalue = document.createElement("span")
	newdogjobvalue.setAttribute("type", "number")
	newdogjobvalue.innerText = arrayelement.number
	newdogjobvalue.classList.add("dogjobvalue")
	newdogjobvalue.classList.add(name)

	let addbutton = document.createElement("button")
	addbutton.addEventListener("click", addDog)
	addbutton.classList.add("addbutton")
	addbutton.classList.add("dogjobbutton")
	addbutton.setAttribute("type", "button")
	addbutton.innerText = "Add Dog"

	let removebutton = document.createElement("button")
	removebutton.addEventListener("click", removeDog)
	removebutton.classList.add("removebutton")
	removebutton.classList.add("dogjobbutton")
	removebutton.setAttribute("type", "button")	
	removebutton.innerText = "Remove Dog"

	//Checks if the dog actually produces anything
	let dogratepersecond = document.createElement("span")
	if (resource != null) {
		dogratepersecond.innerText = rate
		dogratepersecond.classList.add("dogratepersecond")
		dogratepersecond.classList.add(name)
		dogratepersecond.setAttribute("type","number")
	}

	newdogjob.append(newdogjobvalue)
	if (resource != null) {
		newdogjob.append(dogratepersecond)
		newdogjob.append(" " + resource + "/second")
	}
	joblist.append(newdogjob)
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


	//Increments through all resources and increases them appropriately
	for (let i = 0; i < resourceStats.length; i++) {
		let element = resourceStats[i]
		let elementValue = document.querySelector(".resourcevalue." + element.name)
		let elementPerSecond = document.querySelector(".resourcepersecond." + element.name)
		
		//Increases resources based on what jobs dogs are working
		let dogincrease = function () {
			let increase = 0
			for (let k = 0; k < dogjobStats.length; k++) {
				if (dogjobStats[k].resource == element.name) {
					increase += dogjobStats[k].rate * dogjobStats[k].number
				}			
			}
			return increase	
		}

		//Dogs eat treats! They will reduce the value of treats
		if (element.name == "Treats" && dogs != undefined) {
			let dognoms = totaldogs() * 1
			element.value += element.persecond + dogincrease() - dognoms		
			//if there aren't enough treats, dogs will start to die
			if (element.value < 0) {
				element.value = 0
				if (dogs.value > 0) {
					dogs.value -= 1
					let dogtextvalue = document.querySelector(".resourcevalue.Dogs")
					dogtextvalue.innerText = dogs.value
				}
				else {
					for (let j = 0; j < dogjobStats.length; j++) {
						if (dogjobStats[j].number > 0) {
							dogjobStats[j].number -= 1								
							let specialdogtextvalue = document.querySelector(".dogjobvalue." + dogjobStats[j].name)
							specialdogtextvalue.innerText = dogjobStats[j].number
						}
					}	
				}
			} 	
			elementValue.innerText = Math.floor(element.value)
			elementPerSecond.innerText = element.persecond + dogincrease() - dognoms
			
			//alerts player of negative treats
			if (elementPerSecond.innerText < 0 && trigger.negativeTreats == false) {
				trigger.negativeTreats = true
				textbox.append("Oh no, the dogs are eating more treats than they produce!")
				textbox.append("Dogs will start to die if there aren't enough treats \n \n")
			}
			else if (elementPerSecond.innerText > 0 && trigger.negativeTreats == true) {
				trigger.negativeTreats = false
				textbox.append("Dogs celebrate as there is enough for all to eat! \n \n")
			}
		}

		//updates the value of the resource on the page
		else{
			element.value += element.persecond + dogincrease()
			elementValue.innerText = Math.floor(element.value)
			elementPerSecond.innerText = element.persecond + dogincrease()
		}
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
	if (trigger.catAttack == true) {
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

//List of unlockables that dynamically adds them
let unlocklist = function(name, resource, rate) {

	//Treat Farm unlocks once x Treats have been obtained
	if (findResource("Treats").value >= 5 && trigger.treatFarm == false) {
		trigger.treatFarm = true
		unlockBuilding("TreatsFarm", 0, "Treats", 1.25, 0, 3, 1.1, "Treats", 0, null, 
			"A quaint farm to grow more dog treats")
	}

	//Dogs start to come in and borrows are created to house the dog
	if (findBuilding("TreatsFarm").number >= 3 && trigger.dogRate == false) {
		trigger.dogRate = true
		
		unlockResource("Dogs", 1)
		let dogs = findResource("Dogs")
		dogs.persecond += 1
		textbox.append("The dogs are attracted to your treat farms! \n \n")
		textbox.scrollTop = textbox.scrollHeight 
		
		unlockBuilding("Burrows", 1, null, 0, 0, 5, 1.2, "Sticks", 0, null, 
			"A cheap and easy home made by digging a hole and putting some sticks in it")
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
	if (findBuilding("TreatsFarm").number >= 5 && trigger.dogFarmer == false) {
		trigger.dogFarmer = true
		unlockDogJob("DogFarmer","Treats", 2)
		textbox.append("The dogs have learned how to treats into more treats \n \n")
		textbox.scrollTop = textbox.scrollHeight 
	}	
	if (findBuilding("Burrows").number >= 1 && trigger.dogFetcher == false) {
		trigger.dogFetcher = true
		unlockDogJob("DogFetcher","Sticks", 2)
		textbox.append("Dogs like to fetch sticks! \n \n")
		textbox.scrollTop = textbox.scrollHeight 
	}

	//Unlocks Gaurd Dogs
	if (totaldogs() >= 10 && trigger.gaurdDog == false) {
		trigger.gaurdDog = true
		unlockDogJob("GuardDog", null, 0)
		textbox.append("The population is becoming pretty big, you might need protection \n \n")
		textbox.scrollTop = textbox.scrollHeight
	}

	//The cats notice your growing village and attack!
	if (totaldogs() >= 15 && trigger.catAttack == false) {
		trigger.catAttack = true
	}

	if (totaldogs() >= 20 && trigger.gold == false) {
		trigger.gold = true
		unlockResource("Gold", 1)
		unlockDogJob("Miner", "Gold", 1)
		textbox.append("A dog has come with a gold bar?\n \n")
		textbox.scrollTop = textbox.scrollHeight
	}

	if (findResource("Gold").value >= 10 && trigger.goldDevice == false) {
		trigger.goldDevice = true
		unlockBuilding("GoldDevice", 0, null, 0, 0, 20, 1.1, "Gold", 30, "Treats",
			"A mysterious and intricate machine. Who knows what it does?")
		textbox.append("A dog had brought back some blueprints of a strange device")
		textbox.scrollTop = textbox.scrollHeight
	}

	if (findBuilding("GoldDevice").number >= 1 && trigger.gameEnd == false) {
		trigger.gameEnd = true
		alert("You won!")
	}

	if (findResource("Sticks").number >= 20 && trigger.stickBundler == false) {
		trigger.stickBundler = true
	}
}


//Unlocks default resources and button
let addTreat = function() {	
	let treats = findResource("Treats")
	treats.value += 1
	let valueText = document.querySelector(".resourcevalue.Treats")
	valueText.innerText = Math.floor(treats.value)	
}
unlockResource("Treats", 0)
treatsButton.addEventListener("click",addTreat)

//Constantly increments and checks to see if unlock conditions have been met
let incrementalchecker = function() {
	setInterval(unlocklist, 1000)
	setInterval(increment, 1000)
}

//Starts the game
incrementalchecker()