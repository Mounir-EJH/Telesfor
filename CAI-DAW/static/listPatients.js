// Variables globales //////////////////////////////////////////////////////////////////////////////
var swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 30,
  slidesPerGroup: 1,
  loop: true,
  loopFillGroupWithBlank: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
});

var modal = document.getElementById("paciente-details");
var span = document.getElementsByClassName("close")[0];
var currentUser = "";

// Funciones a ejecutar en el windows load
window.onload = () => {
  // Configuración del swiper
  var card = Array.from(document.getElementsByClassName("card"));
  var swiperButtonPrev = Array.from(document.getElementsByClassName("swiper-button-prev"));
  var swiperButtonNext = Array.from(document.getElementsByClassName("swiper-button-next"));

  card.forEach(function (item) {
    item.onclick = displayModal;
  });

  swiperButtonPrev.forEach(function (item) {
    item.onclick = swipeSlide;
  });

  swiperButtonNext.forEach(function (item) {
    item.onclick = swipeSlide;
  });
};

window.onclick = function (event) {
  span.onclick = function () {
    modal.style.display = "none";
  };
}

//Funciones de interactividad del swiper ///////////////////////////////////////////////////////////
function displayModal() {
  currentUser = this.id;
  swiper.realIndex = 0;
  swiper.activeIndex = 0;
  getDataForModal();
  modal.style.display = "block";
}

function swipeSlide() {
  getDataForModal();
  modal.style.display = "block";
}

function getDataForModal(card) {
  currentDNI = currentUser;
  currentSlide = swiper.realIndex;
  currentModal = swiper.slides[swiper.activeIndex];
  // console.log(`active: ${swiper.activeIndex}, real: ${swiper.realIndex}`)
  // console.log(currentModal);
  // Montar AJAX
  queryData(currentDNI, currentSlide, currentModal)
}

function queryData(currentDNI, currentSlide, currentModal) {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = function () {
    userData = JSON.parse(this.responseText);
    // console.log(userData);
    updateModalElements(currentModal, userData)
  }
  xhttp.open("POST", "/consultarDatosPaciente", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

  payload = `dni=${currentDNI}&tableNum=${currentSlide}`;
  xhttp.send(payload);
  return
}

function updateModalElements(currentModal, userData) {
  // Update modal
  // console.log(currentModal);
  let modalContent = currentModal.children[0]
  // modalContent.innerHTML = userData;
  createTable(modalContent, userData)
  return
}

function createTable(modalContent, userData) {
  let tables = document.getElementsByClassName("dataTable")[0];
  if (tables != undefined) {
    tables.remove();
  }

  //Creamos tabla
  let table = document.createElement('div');
  table.classList.add("dataTable");
  //Crear celdas de encabezado
  userData[0].forEach(function(value,index){
    // console.log(heading)
    let cell = document.createElement('div');
    cell.classList.add("cell");
    let headingCell = document.createElement('div');
    headingCell.classList.add("headingCell");
    let dataCell = document.createElement('div');
    dataCell.classList.add("dataCell");
    headingCell.innerHTML = value;
    dataCell.innerHTML = userData[1][index];
    cell.append(headingCell);
    cell.append(dataCell);
    table.append(cell);
  })
  modalContent.append(table);
}

// Tools ///////////////////////////////////////////////////////////////////////////////////////////
