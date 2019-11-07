//Grabs game opening assets
let treatsButton = document.querySelector(".gettreats")
let buildingList = document.querySelector(".buildingslist")
let resourceList = document.querySelector(".resourcelist")
let dogJobList = document.querySelector(".dogjoblist")
let linebreak = document.createElement("br")
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
	guardDog: false,
	catAttack: false,
	gold: false,
	goldMonument: false,
	gameEnd: false,
	stickBundler: false,
	negativeTreats: false,
	dogHouse:false,
	dogGods: false,
	firstmessage: false,
	secondmessage: false,
	thirdmessage: false,
	forthmessage: false
}

//Iterates through all buildings and updates the production value of that resource
let updateProductionValues = function() {
	for(let i = 0; i<buildingStats.length; i++) {
		let resource = findResource(buildingStats[i].resource)
		if (resource != undefined) {
			resource.base = (buildingStats[i].rate * buildingStats[i].number)
			resource.multiplier = (buildingStats[i].multiplier * buildingStats[i].number)
			resource.updateResource()
			console.log(buildingStats)
		}
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
	newresource.append(" /s")
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
	newbuilding.classList.add("buildingitem")
	newbuilding.classList.add(name)
	newbuilding.classList.add("card")

	let buildingbody = document.createElement("span")
	buildingbody.classList.add("buildingbody")
	buildingbody.classList.add(name)
	buildingbody.classList.add("card-body")

	let buildingname = document.createElement("h5")
	buildingname.innerText = name
	buildingname.classList.add("buildingname")
	buildingname.classList.add(name)
	buildingname.classList.add("card-title")

	let buildingnumber = document.createElement("span")
	buildingnumber.innerText = "x" + number
	buildingnumber.classList.add("buildingnumber")
	buildingnumber.classList.add(name)
	buildingnumber.setAttribute("type", "number")
	buildingnumber.classList.add("card-text")

	let buildingcost = document.createElement("span")
	buildingcost.innerText = " Cost: " + cost + " " + costresource 
	buildingcost.classList.add("buildingcost")
	buildingcost.classList.add(name)
	buildingcost.setAttribute("type", "number")

	let buildingcost2 = document.createElement("span")
	if (costresource2 != null || costresource2 != undefined) {
		buildingcost2.classList.add("buildingcost2")
		buildingcost2.classList.add(name)
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
				buildingnumber.innerText = "x" + arrayelement.number
				buildingcost.innerText = " Cost: " + Math.floor(arrayelement.cost) + " "
				 	+ arrayelement.costresource2 + " and " + Math.floor(arrayelement.cost2) 
					+ costresource2
			}
			else {
				buildingnumber.innerText = "x" + arrayelement.number
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
	addbutton.classList.add("btn")
	addbutton.classList.add("btn-info")
	addbutton.setAttribute("type", "button")
	addbutton.innerText = "Add Building"

	let buildingdescription = document.createElement("h6")
	buildingdescription.innerText = description
	buildingdescription.classList.add("buildingdescription")
	buildingdescription.classList.add("card-subtitle")
	buildingdescription.classList.add(name)

	//checks if the building actually produces anything
	let buildingratepersecond = document.createElement("span")
	if (resource != null) {
		buildingratepersecond.innerText = rate
		buildingratepersecond.classList.add("buildingratepersecond")
		buildingratepersecond.classList.add(name)
		buildingratepersecond.setAttribute("type","number")
	}

	buildingbody.append(buildingname)
	buildingname.append(buildingnumber)
	if (resource != null) {
		buildingbody.append(buildingratepersecond)
		buildingbody.append(" " + resource)
		buildingbody.append(" /s")
	}
	buildingbody.append(buildingdescription)
		buildingbody.append(buildingcost)
	if (costresource2 != null || costresource2 != undefined) {
		buildingbody.append(buildingcost2)
	}
	newbuilding.append(buildingbody)
	buildingbody.append(addbutton)
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
	newdogjob.innerText = name + "  x"
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
	addbutton.classList.add("btn")
	addbutton.classList.add("btn-info")
	addbutton.classList.add("dogjobbutton")
	addbutton.setAttribute("type", "button")
	addbutton.innerText = "Add Dog"

	let removebutton = document.createElement("button")
	removebutton.addEventListener("click", removeDog)
	removebutton.classList.add("removebutton")
	removebutton.classList.add("dogjobbutton")
	removebutton.classList.add("btn")
	removebutton.classList.add("btn-secondary")
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
		newdogjob.append(" " + resource + " /s")
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
				textbox.append("\n \n")
				textbox.append("Oh no, the dogs are eating more treats than they produce!")
				textbox.append("\n")
				textbox.append("Dogs will start to die if there aren't enough treats")
			}
			else if (elementPerSecond.innerText > 0 && trigger.negativeTreats == true) {
				trigger.negativeTreats = false
				textbox.append("\n \n")
				textbox.append("Dogs celebrate as there is enough for all to eat!")
			}
		}

		//updates the value of the resource on the page
		else{
			element.value += element.persecond + dogincrease()
			elementValue.innerText = Math.floor(element.value)
			elementPerSecond.innerText = element.persecond + dogincrease()
		}
	}


	//Caps the number of dogs = to the value of the burrows and dog houses
	let burrows = findBuilding("Burrows")
	let doghouse = findBuilding("DogHouse")
	if (doghouse == undefined) {
		doghouse = {number:0}
	}
	if (totaldogs() >= ((burrows.number * 5) + (doghouse.number * 10)) && holdvalue == 0) {
		holdvalue = dogs.persecond
		dogs.persecond = 0
		console.log("Stopped")
	}
	if (totaldogs() < ((burrows.number * 5) + (doghouse.number * 10)) && holdvalue != 0) {
		dogs.persecond = holdvalue
		holdvalue = 0
		console.log("Continue")
	}
	let dogvalue = document.querySelector(".resourcevalue.Dogs")
	dogvalue.innerText = Math.floor(dogs.value)
	console.log(resourceStats)





	//Triggers Cat attack on random values
	if (trigger.catAttack == true) {
		let randomNumber = Math.floor(Math.random() * 40) + 1
		console.log(randomNumber)
		let guard = findDogJob("GuardDog")
		let goldMonument = findBuilding("GoldMonument")
		//They attack at x % rate
		if  (goldMonument == undefined || goldMonument.number == 0) {
			goldMonument = {number:1}
		}
		if (randomNumber <= goldMonument.number) {
			textbox.append("\n \n")
			textbox.append("The cats have attacked!")
			let catAttack = goldMonument.number
			let difference = guard.number - catAttack

			//battle results are calculated
			if (difference >= 0) {
				textbox.append("\n")
				textbox.append("The dogs have defended the attack!")
			}

			//lives are lost in Guard Dogs > regular Dogs > other Dogs
			else {
				difference = Math.abs(difference)
				let totaldeaths = 0
				for (let i = 1; i <= difference; i++){
					let once = false
					if (guard.number > 0) {
						guard.number -= 1
						totaldeaths += 1
						let guardvalue = document.querySelector(".dogjobvalue.GuardDog")
						guardvalue.innerText = guard.number
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
					textbox.append("\n")
					textbox.append("A dog has lost its life in battle...")
				}
				else {
					textbox.append("\n")
					textbox.append(totaldeaths + " dogs have lost thier lives in the attack... \n \n")
				}
			}
		}
	}

	//Updates total number of dogs
	let totaldogcount = document.querySelector(".resourcevalue.TotalDogs")
	totaldogcount.innerText = dogs.value + "/" + totaldogs()


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

	if (findBuilding("TreatsFarm") != undefined) {
		//Dogs start to come in and borrows are created to house the dog
		if (findBuilding("TreatsFarm").number >= 3 && trigger.dogRate == false) {
			trigger.dogRate = true
			
			unlockResource("Dogs", 1)
			let dogs = findResource("Dogs")
			dogs.persecond += 1
			textbox.append("\n \n")
			textbox.append("The dogs are attracted to your treat farms!")
			textbox.scrollTop = textbox.scrollHeight 
			
			unlockBuilding("Burrows", 1, null, 0, 0, 5, 1.2, "Sticks", 0, null, 
				"A cheap and easy home made by digging a hole and putting some sticks in it. Can hold 5 dogs each")
			textbox.append("\n \n")
			textbox.append("The dog has built a nearby burrow as a home.")	
			textbox.scrollTop = textbox.scrollHeight 

			//creates Total Dog count
			let totaldogcount = document.createElement("span")
			let totaldogcountvalue = document.createElement("span")
			
			totaldogcount.innerText = "Total Dogs: "
			totaldogcount.classList.add("resourcename")
			totaldogcount.classList.add("TotalDogs")

			totaldogcountvalue.innerText = dogs.value + "/" + totaldogs()
			totaldogcountvalue.classList.add("resourcevalue")
			totaldogcountvalue.classList.add("TotalDogs")
			totaldogcountvalue.setAttribute("type", "number")

			totaldogcount.append(totaldogcountvalue)
			dogJobList.prepend(totaldogcount)
		}

		//Dogs like jobs!
		if (findBuilding("TreatsFarm").number >= 5 && trigger.dogFarmer == false) {
			trigger.dogFarmer = true
			unlockDogJob("DogFarmer","Treats", 2)
			textbox.append("\n \n")
			textbox.append("The dogs have learned how to treats into more treats")
			textbox.scrollTop = textbox.scrollHeight 
		}	
		if (findBuilding("Burrows").number >= 1 && trigger.dogFetcher == false) {
			trigger.dogFetcher = true
			unlockDogJob("DogFetcher","Sticks", 2)
			textbox.append("\n \n")
			textbox.append("Dogs like to fetch sticks!")
			
			textbox.scrollTop = textbox.scrollHeight 
		}
	}


	//Dogs like to fetch sticks
	if (findResource("Dogs") != undefined) {
		if (findResource("Dogs").value >= 2 && trigger.sticks == false) {
			trigger.sticks = true
			unlockResource("Sticks", 3)
		}

		//Unlocks Guard Dogs
		if (totaldogs() >= 10 && trigger.guardDog == false) {
			trigger.guardDog = true
			unlockDogJob("GuardDog", null, 0)
			textbox.append("\n \n")
			textbox.append("The population is becoming pretty big, you might need protection")
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
			textbox.append("\n \n")
			textbox.append("A dog has come with a gold bar?")
			textbox.scrollTop = textbox.scrollHeight
		}
	}

	if (findResource("Gold") != undefined) {
		if (findResource("Gold").value >= 10 && trigger.goldMonument == false) {
			trigger.goldMonument = true
			unlockBuilding("GoldMonument", 0, null, 0, 0, 20, 1.1, "Gold", 30, "Logs",
				"A mysterious and intricate machine. Who knows what it does?")
			textbox.append("\n \n")
			textbox.append("A dog had brought back some blueprints of a strange device")
			textbox.scrollTop = textbox.scrollHeight
		}
	}
	
	if (false) {
		if (findBuilding("GoldMonument").number >= 1 && trigger.gameEnd == false) {
			trigger.gameEnd = true
			alert("You won!")
		}
	}

	if (findResource("Sticks") != undefined) {

		if (findResource("Sticks").value >= 20 && trigger.stickBundler == false) {
			trigger.stickBundler = true
			unlockResource("Logs", 0)
			unlockBuilding("StickBundler", 0, "Logs", 1, 0, 10, 1.25, "Sticks", 0, null,
				"Turns big unusable sticks to bigger but usuable sticks")
		}
	}

	if (findResource("Logs") != undefined) {
		if (findResource("Logs").value >= 20 && trigger.dogHouse == false) {
			trigger.dogHouse = true
			unlockBuilding("DogHouse", 0, null, 0, 0, 15, 1.5, "Logs", 50, "Treats",
				"A home made for a very good dog, or at least 10 of them")
		}
	}

	if (findBuilding("GoldMonument") != undefined) {
		if (findBuilding("GoldMonument").number >= 1 && trigger.firstmessage == false) {
			trigger.firstmessage = true
			textbox.append("\n \n")
			textbox.append("Something stirs in the air as the first monument is erected...")
			textbox.scrollTop = textbox.scrollHeight

		} 
		if (findBuilding("GoldMonument").number >= 2 && trigger.secondmessage == false) {
			trigger.secondmessage = true
			textbox.append("\n \n")
			textbox.append("As the second monument is erected, an unsettling breeze blows through the village")
			textbox.scrollTop = textbox.scrollHeight
		} 
		if (findBuilding("GoldMonument").number >= 3 && trigger.thirdmessage == false) {
			trigger.thirdmessage = true
			textbox.append("\n \n")
			textbox.append("Life of the trees nearby are starting to wilt. Dogs are falling ill and a rumor of the 'best dog' starts to spread")
			textbox.scrollTop = textbox.scrollHeight
		} 
		if (findBuilding("GoldMonument").number >= 4 && trigger.forthmessage == false) {
			trigger.forthmessage = true
			textbox.append("\n \n")
			textbox.append("At the moment of the monument's completion, an eerie silence overtakes all of dogs. In unison they all quietly mutter 'The best dog cometh'")
			textbox.scrollTop = textbox.scrollHeight
		} 
		if (findBuilding("GoldMonument").number >= 5 && trigger.dogGods == false) {
			trigger.dogGods = true
			textbox.append("\n \n")
			textbox.append("You are now the best dog")
			textbox.scrollTop = textbox.scrollHeight

		}
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