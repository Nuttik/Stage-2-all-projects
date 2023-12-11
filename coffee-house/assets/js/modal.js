//DOM
const cardList = document.querySelectorAll(".cards-list__card");
const modal = document.querySelector(".modal");
const modalCloseButton = modal.querySelector(".modal__button");
const modalBg = modal.querySelector(".modal__bg");
const modalSizesRow = modal.querySelector(".row-sizes");
const modalAdditivesRow = modal.querySelector(".row-additives");
const modalImg = modal.querySelector("img");
const modalName = modal.querySelector(".modal__title");
const modalDesc = modal.querySelector(".modal__desc");
const modalPrice = modal.querySelector(".modal__total-value");

const urlFolderImages = "assets/images/menu/";

async function getJson() {
  //получаем с сервера json
  let response = await fetch("assets/products.json");
  const productsJSON = await response.json();

  //проверяем валидность данных и создаем карточки товаров
  if (!Array.isArray(productsJSON)) {
    throw TypeError(`Menu error. Products array i invalid.`);
  } else {
    document.querySelectorAll(".cards-list__card").forEach((card) => {
      card.addEventListener("click", function () {
        showModal(event, productsJSON);
      });
    });
  }
}
getJson();

function showModal(event, productsJSON) {
  document.querySelector("body").classList.toggle("scroll-none");
  modal.classList.remove("hidden");
  let prodTitle = getProdTitle(event);
  let product = findObject(prodTitle, productsJSON);
  fillModal(product, modal);
}

//находим название товара в карточке, по которой был клик
function getProdTitle(event) {
  let card = event.target.closest(".cards-list__card");
  let title = card.querySelector(".card__title").innerHTML;
  return title;
}

//находим нужный товар в массиве
function findObject(title, array) {
  let object = array.find((obj) => {
    if (obj.name === title) {
      return title;
    }
  });
  return object;
}

function fillModal(obj, modal) {
  const imageSrc =
    urlFolderImages + obj.name.toLowerCase().split(" ").join("-") + ".jpg";

  //заполняю html
  modalName.innerHTML = obj.name;
  modalDesc.innerHTML = obj.description;
  modalImg.src = imageSrc;
  modalPrice.innerHTML = obj.price;

  //размер
  for (let key in obj.sizes) {
    let sizeName = key;
    let sizeValue = obj.sizes[key].size;
    let sizePrice = obj.sizes[key].addPrice;
    let input = `<input type="radio" id="size-${sizeName}" name="size" value="${sizePrice}" class="input"/>`;
    let label = `<label for="size-${sizeName}"><span class="input__type">${sizeName.toUpperCase()}</span><span class="input__value">${sizeValue}</span></label>`;
    if (key === "s") {
      input = `<input type="radio" id="size-${sizeName}" name="size" value="${sizePrice}" class="input" checked/>`;
    }
    modalSizesRow.insertAdjacentHTML("beforeend", input);
    modalSizesRow.insertAdjacentHTML("beforeend", label);
  }

  //допопции
  obj.additives.map((additive, index, array) => {
    let additiveName = additive.name;
    let additivePrice = additive.addPrice;
    let input = `<input type="checkbox" id="additives-${
      index + 1
    }" name="additives" value="${additivePrice}" class="input"/>`;
    let label = `<label for="additives-${
      index + 1
    }"><span class="input__type">${
      index + 1
    }</span><span class="input__value">${additiveName}</span></label>`;
    modalAdditivesRow.insertAdjacentHTML("beforeend", input);
    modalAdditivesRow.insertAdjacentHTML("beforeend", label);
  });

  //вешаем обработчик для созданных лейблов
  modal.querySelectorAll("label").forEach((label) => {
    label.addEventListener("click", function () {
      calculatePrice(obj.price);
    });
  });
}

//закрытие модального окна по клику
function closeModal(event) {
  if (event.target == modalCloseButton || event.target == modalBg) {
    modal.classList.add("hidden");
    document.querySelector("body").classList.toggle("scroll-none");
    cleanModal();
  }
}
//очистка модального окна
function cleanModal() {
  modalAdditivesRow.innerHTML = "";
  modalSizesRow.innerHTML = "";
  modalName.innerHTML = "";
  modalDesc.innerHTML = "";
  modalImg.src = "";
  modalPrice.innerHTML = "";
}

//калькулятор
function calculatePrice(str) {
  //ждем, чтобы инпут на лейбл которого кликнули стал checked
  setTimeout(() => {
    const checkedInputs = modal.querySelectorAll("input:checked");
    const inputs = modal.querySelectorAll("input");
    console.log(inputs);
    console.log(checkedInputs);

    let price = parseFloat(str);
    for (let i = 0; i < checkedInputs.length; i++) {
      let current = parseFloat(checkedInputs[i].value);
      price += current;
    }

    if (Number.isInteger(price)) {
      price = price + ".0";
    }
    if (price % 10 != 0) {
      price = price + "0";
    }
    modalPrice.innerHTML = price;
  }, 1);
}

//Вешаем события
modal.addEventListener("click", closeModal);
