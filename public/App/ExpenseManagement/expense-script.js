
const apiUrl = "http://localhost:3001/oData/v1";
const storedUsername = sessionStorage.getItem("username");

// Show toast message
function showMessage(message, type = "info") {
  const toast = $(\`<div class="toast align-items-center text-bg-\${type} border-0" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">\${message}</div>
    </div>
  </div>\`);
  $("#toastContainer").append(toast);
  toast.toast({ delay: 3000 });
  toast.toast("show");
}

// Open Add Modal
function openAddExpenseModal() {
  $("#expenseModalLabel").text("Add Transaction");
  $("#expenseForm")[0].reset();
  $("#expenseModal").modal("show");
  $("#expenseForm").attr("data-mode", "add");
  loadCategories();
}

// Open Edit Modal
function openEditExpenseModal(id) {
  $.ajax({
    url: apiUrl + "/ExpenseServices/readExpenseByID?id=" + id,
    headers: { "x-username": storedUsername },
    method: "GET",
    beforeSend: () => $("#loader").show(),
    success: (res) => {
      if (res.status === "success") {
        const data = res.data;
        $("#expenseModalLabel").text("Edit Transaction");
        $("#expenseForm")[0].reset();
        for (let key in data) {
          let el = $("[name=" + key + "]");
          if (el.length) el.val(data[key]);
        }
        $("#expenseModal").modal("show");
        $("#expenseForm").attr("data-mode", "edit").attr("data-id", data.id);
        loadCategories(data.category);
      }
    },
    complete: () => $("#loader").hide(),
    error: () => showMessage("Failed to load expense.", "danger")
  });
}

// Close Modal
function closeAddExpenseModal() {
  $("#expenseModal").modal("hide");
}

// Load categories
async function loadCategories(selectedCategory = "") {
  try {
    const res = await fetch(apiUrl + '/ExpenseCategoryConfigServices/getCategoryListsByUser', {
      headers: { 'Content-Type': 'application/json', 'x-username': storedUsername }
    });
    const json = await res.json();
    const categorySelect = document.getElementById('categorySelect');
    categorySelect.innerHTML = '<option value="">Select</option>';
    json.data.forEach(cat => {
      categorySelect.innerHTML += \`<option value="\${cat}" \${cat === selectedCategory ? 'selected' : ''}>\${cat}</option>\`;
    });
    loadSubcategories();
  } catch {
    showMessage("Error loading categories.", "danger");
  }
}

// Load subcategories
async function loadSubcategories() {
  const categoryId = $("#categorySelect").val();
  if (!categoryId) return;
  try {
    const res = await fetch(apiUrl + '/ExpenseCategoryConfigServices/getSubCategoryListsByUser', {
      headers: { 'Content-Type': 'application/json', 'x-username': storedUsername, 'x-category': categoryId }
    });
    const json = await res.json();
    const subSelect = document.getElementById('subCategorySelect');
    subSelect.innerHTML = '<option value="">Select</option>';
    json.data.forEach(sub => {
      subSelect.innerHTML += \`<option value="\${sub}">\${sub}</option>\`;
    });
  } catch {
    showMessage("Error loading subcategories.", "danger");
  }
}

// Save (Add or Update)
async function saveExpense() {
  const form = document.getElementById('expenseForm');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const isEdit = $("#expenseForm").attr("data-mode") === "edit";
  const id = $("#expenseForm").attr("data-id");

  $("#expenseModal").modal("hide");

  const url = isEdit
    ? \`\${apiUrl}/ExpenseServices/updateExpense?id=\${id}\`
    : \`\${apiUrl}/ExpenseServices/insertExpense\`;

  try {
    const res = await fetch(url, {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", "x-username": storedUsername },
      body: JSON.stringify(data)
    });
    const result = await res.json();
    showMessage(result.message || "Saved successfully", result.status === "success" || result.status === 201 ? "success" : "danger");
    loadExpenses(); // refresh table
  } catch {
    showMessage("Error saving data.", "danger");
  }
}

// Load table
function loadExpenses() {
  $("#loader").show();
  $.ajax({
    url: apiUrl + "/ExpenseServices/getExpenseListsbyUser",
    headers: { "x-username": storedUsername },
    method: "GET",
    success: (res) => {
      if (res.status === "success") {
        const tableBody = $("#expenseTableBody");
        tableBody.empty();
        res.data.forEach(item => {
          const row = \`<tr>
            <td>\${item.transactiontime}</td>
            <td>\${item.type}</td>
            <td>\${item.category}</td>
            <td>\${item.subcategory}</td>
            <td>\${item.description}</td>
            <td>\${item.payment_mode}</td>
            <td>\${item.amount}</td>
            <td>\${item.flow}</td>
            <td>
              <button class="btn btn-sm btn-warning" onclick="openEditExpenseModal(\${item.id})">Edit</button>
              <button class="btn btn-sm btn-danger" onclick="deleteExpense(\${item.id})">Delete</button>
            </td>
          </tr>\`;
          tableBody.append(row);
        });
      }
    },
    complete: () => $("#loader").hide(),
    error: () => showMessage("Failed to load expenses", "danger")
  });
}

// Delete
function deleteExpense(id) {
  if (!confirm("Are you sure you want to delete this expense?")) return;
  fetch(apiUrl + "/ExpenseServices/deleteExpense?id=" + id, {
    method: "DELETE",
    headers: { "x-username": storedUsername }
  }).then(res => res.json())
    .then(data => {
      showMessage(data.message || "Deleted successfully", "success");
      loadExpenses();
    }).catch(() => showMessage("Delete failed", "danger"));
}

// On ready
$(document).ready(function () {
  loadExpenses();
});
