document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('button[data-name]');
  const summaryBox = document.getElementById('summaryBox');

  buttons.forEach(btn => {
    btn.addEventListener('click', function () {
      this.classList.toggle('selected');

      this.textContent = this.classList.contains('selected')
        ? "Mégsem"
        : "Szeretném";

      updateSummary(); // rebuild list
      if (window.updateMailLink) window.updateMailLink(); // refresh mailto
    });
  });

  function updateSummary() {
    const productList = document.getElementById('productList');
    const productTextarea = document.getElementById('productTextarea');

    if (!productList) return; // safety

    productList.innerHTML = '';
    const selectedItems = [];

    document.querySelectorAll('button.selected').forEach(btn => {
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      const id = name + price;
      const line = `${name} – ${price} Ft`;

      const li = document.createElement('li');
      li.textContent = line;
      li.setAttribute('data-id', id);

      const removeBtn = document.createElement('span');
      removeBtn.textContent = ' ❌';
      removeBtn.style.cursor = 'pointer';
      removeBtn.style.color = 'black';
      removeBtn.style.marginLeft = '8px';

      removeBtn.addEventListener('click', () => {
        const selector = `button[data-name="${btn.dataset.name}"][data-price="${btn.dataset.price}"]`;
        const originalButton = document.querySelector(selector);
        if (originalButton) {
          originalButton.classList.remove('selected');
          originalButton.textContent = 'Szeretném';
        }

        updateSummary(); // rebuild list after removal
        if (window.updateMailLink) window.updateMailLink(); // refresh mailto
      });

      li.appendChild(removeBtn);
      productList.appendChild(li);

      selectedItems.push(line);
    });

    if (productTextarea) {
      productTextarea.value = selectedItems.join('\n');
    }
  }

  // Initial build (in case some buttons are preselected)
  updateSummary();
  if (window.updateMailLink) window.updateMailLink();
});
