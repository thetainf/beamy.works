const buttons = document.querySelectorAll('button[data-name]');
const summaryBox = document.getElementById('summaryBox');

buttons.forEach(btn => {
  btn.addEventListener('click', function () {
    this.classList.toggle('selected'); // vagy 'active'

    this.textContent = this.classList.contains('selected')
      ? "Mégsem"
      : "Szeretném";

    updateSummary();
  });
});


function updateSummary() {
  const productList = document.getElementById('productList');
  const productTextarea = document.getElementById('productTextarea');

  productList.innerHTML = '';
  const selectedItems = [];

  document.querySelectorAll('button.selected').forEach(btn => {
    const name = btn.dataset.name;
    const price = btn.dataset.price;
    const id = name + price; // egyedi azonosító a törléshez
    const line = `${name} – ${price} Ft`;

    // Listaelem létrehozása
    const li = document.createElement('li');
    li.textContent = line;
    li.setAttribute('data-id', id);

    // Kuka ikon
    const removeBtn = document.createElement('span');
    removeBtn.textContent = ' ❌';
    removeBtn.style.cursor = 'pointer';
    removeBtn.style.color = 'black';
    removeBtn.style.marginLeft = '8px';

    removeBtn.addEventListener('click', () => {
      // visszaváltjuk a gombot
      const selector = `button[data-name="${btn.dataset.name}"][data-price="${btn.dataset.price}"]`;
      const originalButton = document.querySelector(selector);
      if (originalButton) {
        originalButton.classList.remove('selected');
        originalButton.textContent = 'Szeretném';
      }

      updateSummary(); // újraépítjük a listát
    });

    li.appendChild(removeBtn);
    productList.appendChild(li);

    // textarea-hoz is
    selectedItems.push(line);
  });

  productTextarea.value = selectedItems.join('\n');
}
