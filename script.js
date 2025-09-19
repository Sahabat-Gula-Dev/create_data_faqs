document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL =
    "https://backend-javascript-sahabat-gula-166777420148.asia-southeast1.run.app";
  const ACCESS_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImIyMDU0MmM5LTQzODYtNDYzNi1iOTA2LTg2M2YzNmNiYzdkZCIsImVtYWlsIjoiZml0cmlAc2FoYWJhdGd1bGEuY29tIiwicm9sZSI6ImFkbWluIiwidXNlcm5hbWUiOiJmaXRyaSIsImlhdCI6MTc1ODE2NDA1MCwiZXhwIjoxNzU4NzY4ODUwfQ.eqAJimZiUfUdjO3_ACnPDasMX7dqOUTPug9SqxPQ2qc";

  const faqForm = document.getElementById("faqForm");
  const categorySelect = document.getElementById("category_id");
  const categoryNameInput = document.getElementById("category_name");
  const submitBtn = document.getElementById("submitBtn");

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/faq-categories`);
      if (!response.ok) throw new Error("Gagal memuat kategori FAQ");
      const result = await response.json();
      const categories = result.data || [];
      categorySelect.innerHTML = '<option value="">Pilih Kategori...</option>';
      categories.forEach((cat) =>
        categorySelect.add(new Option(cat.name, cat.id))
      );
    } catch (error) {
      console.error("Error fetching categories:", error);
      showNotification(
        "warning",
        "Gagal Memuat Kategori",
        "Anda masih bisa membuat kategori baru."
      );
    }
  };

  const setLoadingState = (isLoading) => {
    submitBtn.disabled = isLoading;
    submitBtn.classList.toggle("loading", isLoading);
    submitBtn.querySelector(".btn-text").textContent = isLoading
      ? "Menyimpan..."
      : "Simpan FAQ";
  };

  const showNotification = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonColor: "var(--primary-color)",
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!categorySelect.value && !categoryNameInput.value.trim()) {
      showNotification(
        "warning",
        "Kategori Wajib Diisi",
        "Silakan pilih kategori yang ada atau buat kategori baru."
      );
      return;
    }

    setLoadingState(true);

    const payload = {
      question: document.getElementById("question").value,
      answer: document.getElementById("answer").value,
    };

    const categoryId = categorySelect.value;
    const categoryName = categoryNameInput.value.trim();

    if (categoryName) {
      payload.category_name = categoryName;
    } else if (categoryId) {
      payload.category_id = categoryId;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/faqs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Gagal menyimpan FAQ.");

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "FAQ berhasil disimpan.",
      });
      faqForm.reset();
      fetchCategories();
    } catch (error) {
      showNotification("error", "Gagal", error.message);
    } finally {
      setLoadingState(false);
    }
  };

  faqForm.addEventListener("submit", handleFormSubmit);
  fetchCategories();
});
