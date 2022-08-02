// ********** select items *************
const toggleIconDark = document.querySelector("#icon-moon")
const toggleIconLight = document.querySelector("#icon-sun")
const pagestyle = document.querySelector("#pagestyle")
const input = document.querySelector("#input")
const form = document.querySelector(".form")
const list = document.querySelector(".list-container")
const firstChild = document.querySelector(".update-parent")
const clrbtn = document.querySelector(".clr-btn")
const left = document.querySelector(".items-left")
const main = document.querySelector(".main")
const buttons = document.querySelectorAll(".btn")
const footer = document.querySelector(".footer-parent")
// *********** variables *********
let state = localStorage.getItem("darkmode")

// *********** functions ***********
// stylesheet toggling
const toggleStyleSheet = (style) => {
  pagestyle.setAttribute("href", style)
}
if (state === "darkmode") {
  toggleStyleSheet("./css/darkmode.css")
}
const createListItem = (id, value) => {
  const element = document.createElement("div")
  element.classList.add("item")
  const attr = document.createAttribute("data-id")
  attr.value = id
  element.setAttributeNode(attr)
  element.innerHTML = `<button class=" circle-parent"><span class="circle "></span></button>
    <div class="inactive"><button class=" img-parent "><img src="./images/icon-check.svg" alt="icon-check" class="check"></button></div>
    <p class="list-text">${value}</p>
    <button class="list-image-parent remove"><img src="./images/icon-cross.svg" alt="icon-cross" class="cross"></button>`
  const checkBtn = element.querySelector(".circle-parent")
  const remove = element.querySelector(".remove")
  checkBtn.addEventListener("click", checkFunc)
  remove.addEventListener("click", removeFunc)
  list.prepend(element)
}
// create list item checked
const createListItemCheck = (id, value) => {
  const element = document.createElement("div")
  element.classList.add("item")
  const attr = document.createAttribute("data-id")
  attr.value = id
  element.setAttributeNode(attr)
  element.innerHTML = `<button class=" circle-parent"><span class="circle "></span></button>
    <div class="inactive"><button class=" img-parent "><img src="./images/icon-check.svg" alt="icon-check" class="check"></button></div>
    <p class="list-text">${value}</p>
    <button class="list-image-parent remove"><img src="./images/icon-cross.svg" alt="icon-cross" class="cross"></button>`
  // remove from list
  const remove = element.querySelector(".remove")
  remove.addEventListener("click", removeFunc)
  // adding and removing class
  element.querySelector(".circle-parent").classList.add("inactive")
  element
    .querySelector(".circle-parent")
    .nextElementSibling.classList.remove("inactive")
  element
    .querySelector(".circle-parent")
    .nextElementSibling.nextElementSibling.classList.add("checked")
  list.prepend(element)
}
// edit state func
const editState = (id) => {
  let items = JSON.parse(localStorage.getItem("listItems"))
  items.map((item) => {
    if (item.id === id) {
      item.state = "checked"
    }
    return item
  })
  localStorage.setItem("listItems", JSON.stringify(items))
}
// check functionality

const checkFunc = (e) => {
  const btn = e.currentTarget
  btn.classList.add("inactive")
  const check = btn.nextElementSibling
  check.classList.remove("inactive")
  const text = check.nextElementSibling
  text.classList.add("checked")
  const element = btn.parentElement
  const id = element.dataset.id
  editState(id)
  const attr2 = document.createAttribute("draggable")
  attr2.value = true
  btn.parentElement.setAttributeNode(attr2)
}

// remove functionality
const removeFunc = (e) => {
  const cancel = e.currentTarget
  const item = cancel.parentElement
  const id = item.dataset.id
  list.removeChild(item)
  removeFromLocalStorage(id)
}
// clear completed functionality

const clearCompleted = () => {
  let checked = document.querySelectorAll(".checked")
  let parents = []
  checked.forEach((item) => {
    parents.push(item.parentElement)
  })
  parents.forEach((item) => {
    list.removeChild(item)
  })

  let items = JSON.parse(localStorage.getItem("listItems"))
  newItems = items.filter((item) => {
    if (item.state !== "checked") {
      return item
    }
  })
  localStorage.setItem("listItems", JSON.stringify(newItems))
}
// display items in local storage
const displayList = () => {
  value = JSON.parse(localStorage.getItem("status"))
  if (!value) {
    try {
      items = JSON.parse(localStorage.getItem("listItems"))
      if (items.length > 0) {
        items.forEach((item) => {
          if (item.state === "unchecked") {
            createListItem(item.id, item.value)
          } else if (item.state === "checked") {
            createListItemCheck(item.id, item.value)
          }
        })
      }
    } catch (error) {
      return
    }
  } else if (value === "all") {
    let todo = document.querySelectorAll(".item")
    todo.forEach((item) => {
      list.removeChild(item)
    })
    items = JSON.parse(localStorage.getItem("listItems"))
    if (items.length > 0) {
      items.forEach((item) => {
        if (item.state === "unchecked") {
          createListItem(item.id, item.value)
        } else if (item.state === "checked") {
          createListItemCheck(item.id, item.value)
        }
      })
    }
    buttons.forEach((item) => {
      item.classList.remove("active")
    })
    buttons.forEach((item) => {
      if (item.innerText === "All") {
        item.classList.add("active")
      }
    })
    enableInput()
    // div.classList.add("active")
  } else if (value === "completed") {
    let todo = document.querySelectorAll(".item")
    todo.forEach((item) => {
      list.removeChild(item)
    })
    items = JSON.parse(localStorage.getItem("listItems"))
    if (items.length > 0) {
      items.forEach((item) => {
        if (item.state === "checked") {
          createListItemCheck(item.id, item.value)
        }
      })
    }
    buttons.forEach((item) => {
      item.classList.remove("active")
    })
    buttons.forEach((item) => {
      if (item.innerText === "Completed") {
        item.classList.add("active")
      }
    })
    disableInput()
  } else if (value === "active") {
    let todo = document.querySelectorAll(".item")
    todo.forEach((item) => {
      list.removeChild(item)
    })
    items = JSON.parse(localStorage.getItem("listItems"))
    if (items.length > 0) {
      items.forEach((item) => {
        if (item.state === "unchecked") {
          createListItem(item.id, item.value)
        }
      })
    }
    buttons.forEach((item) => {
      item.classList.remove("active")
    })
    buttons.forEach((item) => {
      if (item.innerText === "Active") {
        item.classList.add("active")
      }
    })
    disableInput()
  }
}

// fetching input value
const addInputValue = (e) => {
  e.preventDefault()
  const value = input.value
  const id = new Date().getTime().toString()
  if (value) {
    createListItem(id, value)
    // set back to default
    input.value = ""
    // add to local storage
    addToLocalStorage(id, value)
    // update number of todos
  }
}
// update list number
const updateListNumber = () => {
  try {
    let items = JSON.parse(localStorage.getItem("listItems"))
    newItems = items.filter((item) => {
      if (item.state !== "checked") {
        return item
      }
    })

    let total = newItems.length
    if (total <= 1) {
      return (left.innerText = `${total} item left`)
    } else if (total > 1) {
      return (left.innerText = `${total} items left`)
    }
  } catch (error) {
    return (left.innerText = `0 item left`)
  }
}
// update list functionality
const updateList = (e) => {
  let div = e.currentTarget
  let activeClass = div.classList.contains("active")
  if (!activeClass) {
    buttons.forEach((item) => {
      item.classList.remove("active")
    })
    div.classList.add("active")
  }
  if (div.innerText === "Active") {
    setStatus("active")
    let todo = document.querySelectorAll(".item")
    todo.forEach((item) => {
      list.removeChild(item)
    })
    items = JSON.parse(localStorage.getItem("listItems"))
    if (items.length > 0) {
      items.forEach((item) => {
        if (item.state === "unchecked") {
          createListItem(item.id, item.value)
        }
      })
    }
    disableInput()
  }
  if (div.innerText === "Completed") {
    setStatus("completed")
    let todo = document.querySelectorAll(".item")
    todo.forEach((item) => {
      list.removeChild(item)
    })
    items = JSON.parse(localStorage.getItem("listItems"))
    if (items.length > 0) {
      items.forEach((item) => {
        if (item.state === "checked") {
          createListItemCheck(item.id, item.value)
        }
      })
    }
    disableInput()
  }
  if (div.innerText === "All") {
    setStatus("all")
    let todo = document.querySelectorAll(".item")
    todo.forEach((item) => {
      list.removeChild(item)
    })
    items = JSON.parse(localStorage.getItem("listItems"))
    if (items.length > 0) {
      items.forEach((item) => {
        if (item.state === "unchecked") {
          createListItem(item.id, item.value)
        } else if (item.state === "checked") {
          createListItemCheck(item.id, item.value)
        }
      })
    }
    enableInput()
  }
}
const disableInput = () => {
  input.disabled = true
  footer.classList.add("inactive")
  btns = document.querySelectorAll(".circle-parent")
  btns2 = document.querySelectorAll(".img-parent")
  btns.forEach((btn) => {
    btn.disabled = true
    btn.classList.add("initial")
  })
  btns2.forEach((btn) => {
    btn.disabled = true
    btn.classList.add("initial")
  })
}
const enableInput = () => {
  input.disabled = false
  footer.classList.remove("inactive")
  btns = document.querySelectorAll(".circle-parent")
  btns2 = document.querySelectorAll(".img-parent")
  btns.forEach((btn) => {
    btn.disabled = false
    btn.classList.remove("initial")
  })
  btns2.forEach((btn) => {
    btn.disabled = false
    btn.classList.remove("initial")
  })
}

// drag and drop functionality
const dragStart = () => {
  console.log("start")
}
const dragEnd = () => {
  console.log("end")
}

// *********** event listeners **********
toggleIconDark.addEventListener("click", () => {
  toggleStyleSheet("./css/darkmode.css")
  setDarkMode("darkmode")
})
toggleIconLight.addEventListener("click", () => {
  toggleStyleSheet("./css/lightmode.css")
  setDarkMode("lightmode")
})
form.addEventListener("submit", addInputValue)
window.addEventListener("DOMContentLoaded", displayList)
clrbtn.addEventListener("click", clearCompleted)
main.addEventListener("submit", updateListNumber)
main.addEventListener("click", updateListNumber)
buttons.forEach((item) => {
  item.addEventListener("click", updateList)
})
window.addEventListener("DOMContentLoaded", updateListNumber)
const divs = document.querySelectorAll(".item")
divs.forEach((item) => {
  item.addEventListener("drangstart", dragStart)
  item.addEventListener("dragend", dragEnd)
})
// ********** local storage ********
const setStatus = (value) => {
  localStorage.setItem("status", JSON.stringify(value))
}
const setDarkMode = (state) => {
  localStorage.setItem("darkmode", state)
}
const addToLocalStorage = (id, value) => {
  let todo = JSON.parse(localStorage.getItem("listItems")) || []
  tempList = [...todo, { id, value, state: "unchecked" }]
  localStorage.setItem("listItems", JSON.stringify(tempList))
}

const removeFromLocalStorage = (id) => {
  let items = JSON.parse(localStorage.getItem("listItems"))
  items = items.filter((item) => {
    if (item.id !== id) {
      return item
    }
  })

  localStorage.setItem("listItems", JSON.stringify(items))
}
