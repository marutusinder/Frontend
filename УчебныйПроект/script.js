document.addEventListener("DOMContentLoaded", () => {
    let current = 0;
    const track = document.querySelector(".carousel-track");
    const items = document.querySelectorAll(".carousel-item");
    const total = items.length;

    function updateCarousel() {
        track.style.transform = `translateX(-${current * 100}%)`;
    }

    document.querySelector(".carousel-arrow.right").addEventListener("click", () => {
        current = (current + 1) % total;
        updateCarousel();
    });

    document.querySelector(".carousel-arrow.left").addEventListener("click", () => {
        current = (current - 1 + total) % total;
        updateCarousel();
    });

    setInterval(() => {
        document.querySelector(".carousel-arrow.right").click();
    }, 5000);

    const select = document.getElementById("order-service-select");
    const selectedDiv = document.getElementById("order-selected-services");
    const totalDiv = document.getElementById("order-total-price");
    const submitBtn = document.getElementById("order-submit");

    const originalOptions = [
        { id: "srv-furn", text: "Собрать мебель — 1500₽", price: 1500 },
        { id: "srv-plumb", text: "Починить сантехнику — 1200₽", price: 1200 },
        { id: "srv-shelf", text: "Прикрутить полку — 800₽", price: 800 }
    ];

    let selected = [];

    function refreshSelect() {
        select.innerHTML = '<option value="0">-- Выберите услугу --</option>';

        originalOptions.forEach(opt => {
            if (!selected.some(s => s.id === opt.id)) {
                const option = document.createElement("option");
                option.value = opt.id;
                option.textContent = opt.text;
                select.appendChild(option);
            }
        });
    }

    function refreshList() {
        selectedDiv.innerHTML = "";

        if (selected.length === 0) {
            selectedDiv.innerHTML =
                '<p style="color:#d8d5ce; opacity:0.8;">Тут пока ничего нет...</p>';
            totalDiv.textContent = "";
            return;
        }

        let totalPrice = 0;

        selected.forEach(s => {
            const row = document.createElement("div");
            row.className = "service-row";

            row.innerHTML = `
                <p>${s.text}</p>
                <button class="remove-btn" data-id="${s.id}">Удалить</button>
            `;

            selectedDiv.appendChild(row);
            totalPrice += s.price;
        });

        totalDiv.textContent = `Итоговая стоимость: ${totalPrice}₽`;
    }

    select.addEventListener("change", function () {
        const id = this.value;

        if (id === "0") return;

        const opt = originalOptions.find(o => o.id === id);
        if (!opt) return;

        if (!selected.some(s => s.id === id)) {
            selected.push(opt);
        }

        refreshList();
        refreshSelect();
    });

    selectedDiv.addEventListener("click", (e) => {
        if (!e.target.classList.contains("remove-btn")) return;

        const id = e.target.dataset.id;

        selected = selected.filter(s => s.id !== id);

        refreshList();
        refreshSelect();
    });

    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const name = document.getElementById("order-client-name").value.trim();
        const phone = document.getElementById("order-client-phone").value.trim();
        const date = document.getElementById("order-date").value.trim();

        const totalPrice = selected.reduce((sum, s) => sum + s.price, 0);

        if (selected.length === 0) {
            showAlert();
            return;
        }

        const displayDate = date.replace("T", " ");

        const overlay = document.getElementById("order-overlay");
        const msg = overlay.querySelector(".msg");

        msg.innerHTML = `
            Ваш заказ оформлен!<br>
            Сумма: <b>${totalPrice}₽</b><br>
            Выбранная дата и время: <b>${displayDate}</b>
        `;

        overlay.style.display = "flex";

        requestAnimationFrame(() => {
            overlay.classList.add("show");
        });

        submitBtn.disabled = true;

        setTimeout(() => {
            overlay.classList.remove("show");

            setTimeout(() => {
                overlay.style.display = "none";
            }, 800);

            selected = [];
            refreshList();
            refreshSelect();

            submitBtn.disabled = false;

            document.getElementById("order-client-name").value = "";
            document.getElementById("order-client-phone").value = "";
            document.getElementById("order-date").value = "";
        }, 3000);
    });

    refreshSelect();
    refreshList();
});