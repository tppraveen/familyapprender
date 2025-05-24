// expense-category.js
const apiUrl = "http://localhost:3000/oData/v1"; // Replace with your actual backend URL
let storedUsername=''
function validateLoginUser(){
    storedUsername = sessionStorage.getItem("username");

  if (storedUsername) {
    console.log("Welcome back, " + storedUsername + "!");
  } else {
     window.location.href = "/";
  }
}
validateLoginUser();
 



$(document).ready(function () {
  
  function showMessage(message, type) {
  const $messageBox = $('#messageBox');
  if ($messageBox.length) {
    $messageBox.text(message);
    $messageBox.css('color', type === 'success' ? 'green' : 'red');

    // Clear the message after 5 seconds
    setTimeout(() => {
      $messageBox.text('');
    }, 5000);
  }
}

  function renderTable() {
    $.ajax({
      url: apiUrl + '/ExpenseServices/getExpenseListsbyUser',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-username': storedUsername
      },
      success: function (response) {
        if (response.status === "success" && Array.isArray(response.data)) {
          const $tableBody = $("#expenseTableBody");
          $tableBody.empty();

          response.data.forEach(row => {
            const $tr = $(`
              <tr data-id="${row.id}">
                <td>${row.transactiontime}</td>
                <td>${row.type}</td>
                <td>${row.category}</td>
                <td>${row.subcategory}</td>
                <td>${row.description}</td>
                <td>${row.payment_mode}</td>
                <td>${row.amount}</td>
                <td>${row.flow}</td>
                <td>
                  <button class="btn btn-sm btn-primary edit-btn">Edit</button>
                  <button class="btn btn-sm btn-danger delete-btn">Delete</button>
                </td>
              </tr>
            `);
            $tableBody.append($tr);
          });

          showMessage(response.message || "Data loaded successfully.", 'success');
        } else {
          showMessage(response.error || "Failed to load data.", 'error');
        }
      },
      error: function () {
        showMessage("Failed to fetch data. Please try again.", 'error');
      }
    });
  }

  // Event delegation for edit
  $('#expenseTableBody').on('click', '.edit-btn', function () {
    const id = $(this).closest('tr').data('id');
   
    console.log("Edit ID:", id);

      $.ajax({
    url: apiUrl + '/ExpenseServices/readExpenseByID',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'x-username': storedUsername,
        'x-id':id
      },
    success: function (response) {
      if (response.status === "success" && response.data) {
        const data = response.data;
       openEditAddExpenseModal() 
        setExpenseFormValues(data) 
      } else {
        showMessageBox("Failed to load transaction.", { onOk: () => {} });
      }
    },
    error: function () {
      showMessageBox("An error occurred while loading the transaction.", { onOk: () => {} });
    }
  });


  
  });
   $('#categorySelect').on('change', loadSubcategories);
   $('#categorySelect2').on('change', loadSubcategories);

  function setExpenseFormValues(data) {
  const $form = $('#expenseForm');

  // Date/Time
  const datetimeValue = data.transactiontime ? new Date(data.transactiontime).toISOString().slice(0, 16) : '';
  $form.find('[name="datetime"]').val(datetimeValue);

  // Type
  $form.find('[name="type"]').val(data.type || '');

  // Payment Mode
  $form.find('[name="payment_mode"]').val(data.payment_mode || '');

  // Is Planned
  $form.find('[name="is_planned"]').val(data.is_planned ? 'Yes' : 'No');

  // Category
  //$form.find('[name="category"]').val(data.category || '').trigger('change');

  // Sub Category
  //$form.find('[name="sub_category"]').val(data.subcategory || '');

  // Amount
  $form.find('[name="amount"]').val(data.amount || '');

  // Payment Status
  $form.find('[name="payment_status"]').val(data.payment_status || '');

  // Description
  $form.find('[name="description"]').val(data.description || '');

  // Impact Saving
  $form.find('[name="impact_saving"]').val(data.saving_impact ? 'Yes' : 'No');

  // Cycle
  $form.find('[name="cycle"]').val(data.cycle || '');

  // Merchant Name
  $form.find('[name="merchant_name"]').val(data.merchant_name || '');

  // With Whom
  $form.find('[name="with_whom"]').val(data.with_whom || '');

  // Notes
  $form.find('[name="notes"]').val(data.notes || '');

  // Expense Mood (optional fallback)
  $form.find('[name="expense_mood"]').val(data.expense_mood || '');


  
 loadCategoriesAndSelect(data.category);
 loadSubcategoriesAndSelect(data.category, $('#subCategorySelect'), data.subcategory);

}
function loadCategoriesAndSelect(selectedCategory = '') {
  $.ajax({
    url: apiUrl + '/ExpenseCategoryConfigServices/getCategoryListsByUser',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-username': storedUsername
    },
    success: function(response) {
      if (response.status === "success" && Array.isArray(response.data)) {
        const $select = $('#categorySelect');
        $select.empty().append('<option value="">Select</option>');

        response.data.forEach(function(cat) {
          const isSelected = (cat === selectedCategory) ? 'selected' : '';
          $select.append(`<option value="${cat}" ${isSelected}>${cat}</option>`);
        });

        // Trigger change in case subcategories need to load
        if (selectedCategory) {
          $select.trigger('change');
        }

        showMessage(response.message || "Categories loaded successfully.", 'success');
      } else {
        showMessage(response.error || "Failed to load categories.", 'error');
      }
    },
    error: function() {
      showMessage('Failed to fetch categories. Please try again.', 'error');
    }
  });
}
function loadSubcategoriesAndSelect(categoryId, $subSelectElement, selectedSubcategory = '') {
  if (!categoryId || !$subSelectElement || !$subSelectElement.length) return;

  $.ajax({
    url: apiUrl + '/ExpenseCategoryConfigServices/getSubCategoryListsByUser',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-username': storedUsername,
      'x-category': categoryId
    },
    success: function(response) {
      if (response.status === "success" && Array.isArray(response.data)) {
        $subSelectElement.empty().append('<option value="">Select</option>');

        response.data.forEach(function(sub) {
          const isSelected = (sub === selectedSubcategory) ? 'selected' : '';
          $subSelectElement.append(`<option value="${sub}" ${isSelected}>${sub}</option>`);
        });

        showMessage(response.message || "Subcategories loaded.", 'success');
      } else {
        showMessage(response.error || "Failed to load subcategories.", 'error');
      }
    },
    error: function() {
      showMessage('Failed to fetch subcategories. Please try again.', 'error');
    }
  });
}





  // Event delegation for delete
  $('#expenseTableBody').on('click', '.delete-btn', function () {
    const id = $(this).closest('tr').data('id');
    console.log("Delete ID:", id);

    if (confirm("Are you sure you want to delete this expense?")) {
      $.ajax({
        url: apiUrl + '/ExpenseServices/deleteExpense/' + id,
        method: 'DELETE',
        success: function (res) {
          showMessage("Deleted successfully", 'success');
          renderTable(); // Refresh table
        },
        error: function () {
          showMessage("Failed to delete the item.", 'error');
        }
      });
    }
  });

  // Load table on page ready
  renderTable();
  function loadSubcategories() {
  const categoryId = $('#categorySelect').val();
  if (!categoryId) return;

  $.ajax({
    url: apiUrl + '/ExpenseCategoryConfigServices/getSubCategoryListsByUser',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-username': storedUsername,
      'x-category': categoryId
    },
    success: function(response) {
      if (response.status === "success" && Array.isArray(response.data)) {
        const data = response.data;
        const $subSelect = $('#subCategorySelect');
        const $subSelect2 = $('#subCategorySelect2');
        $subSelect.html('<option value="">Select</option>');
        $subSelect2.html('<option value="">Select</option>');
        data.forEach(function(sub) {
          $subSelect.append(`<option value="${sub}">${sub}</option>`);
          $subSelect2.append(`<option value="${sub}">${sub}</option>`);
        });
        showMessage(response.message || "Data loaded successfully.", 'success');
      } else {
        showMessage(response.error || "Failed to load data.", 'error');
      }
    },
    error: function() {
      showMessage('Failed to fetch data. Please try again.', 'error');
    }
  });
}


$('#addExpenseBtn').on('click', openAddExpenseModal);
$('#CloseAddExpenseBtn').on('click', closeAddExpenseModal);
$('#CloseAddExpenseBtn2').on('click', closeAddExpenseModal);
$('#CloseEditExpenseBtn').on('click', closeEditExpenseModal);
$('#CloseEditExpenseBtn2').on('click', closeEditExpenseModal);
$('#saveExpenseBtn').on('click', saveExpense);

function openAddExpenseModal() {
  const modal = new bootstrap.Modal($('#expenseModal')[0]);
  modal.show();
  loadCategories(); // load when opening modal
}
function openEditAddExpenseModal() {
  const modal = new bootstrap.Modal($('#expenseModal')[0]);
  modal.show();
}

function closeAddExpenseModal() {
  const modalEl = $('#expenseModal')[0];
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  modalInstance.hide();
  $('#expenseForm')[0].reset();
}
function closeEditExpenseModal() {
 const modalEl2 = document.getElementById('EditExpenseModal');

  // Blur the currently focused element to prevent accessibility issues
  if (document.activeElement) {
    document.activeElement.blur();
  }

  // Get or create modal instance
  let modalInstance = bootstrap.Modal.getInstance(modalEl2);
  if (!modalInstance) {
    modalInstance = new bootstrap.Modal(modalEl2);
  }

  modalInstance.hide();

  // Reset the form (correct form ID)
  document.getElementById('expenseEditForm').reset();
}

function loadCategories() {
  $.ajax({
    url: apiUrl + '/ExpenseCategoryConfigServices/getCategoryListsByUser',
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-username': storedUsername
    },
    success: function (response) {
      if (response.status === "success" && Array.isArray(response.data)) {
        const $catSelect = $('#categorySelect');
        $catSelect.empty().append('<option value="">Select</option>');
        $.each(response.data, function (_, cat) {
          $catSelect.append(`<option value="${cat}">${cat}</option>`);
        });
        showMessage(response.message || "Categories loaded successfully.", 'success');
      } else {
        showMessage(response.error || "Failed to load categories.", 'error');
      }
    },
    error: function () {
      showMessage('Failed to fetch categories. Please try again.', 'error');
    }
  });
}

  

function saveExpense() {
  const $form = $('#expenseForm');
  const formData = $form.serializeArray();
  const payload = {};
  formData.forEach(field => {
    payload[field.name] = field.value;
  });

  closeAddExpenseModal();

  $.ajax({
    url: apiUrl + '/ExpenseServices/insertExpense',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-username': storedUsername
    },
    data: JSON.stringify(payload),
    success: function (data) {
      if (data.code === 201) {
        showMessage(data.message || "Expense saved successfully.", 'success');
        renderTable(); // Reload table
      } else {
        console.error('Error:', data.error || 'Unknown error');
        showMessage(data.message || 'Failed to save expense.', 'error');
      }
    },
    error: function (error) {
      console.error('Network error:', error);
      showMessage('Network error occurred. Please try again.', 'error');
    }
  });
}
















});































































document.addEventListener("DOMContentLoaded", function () {





  // Reminders
  const upcomingReminders = [
    { category: "Electricity", info: "Due 12 May" },
    { category: "Netflix", info: "Recurring Monthly" }
  ];

  const missedReminders = [
    { category: "Water Bill", info: "Missed 08 May" }
  ];

  function loadReminderList(data, elementId) {
    const list = document.getElementById(elementId);
    data.forEach(item => {
      const li = document.createElement("li");
      li.innerHTML = `<i class="bi bi-exclamation-circle-fill text-danger me-1"></i> 
                      ${item.category} - <small>${item.info}</small>`;
      list.appendChild(li);
    });
  }

  loadReminderList(upcomingReminders, "upcomingReminders");
  loadReminderList(missedReminders, "missedReminders");

  // Balance Summary
  const balanceData = [
    { label: "Total Balance", amount: 35000 },
    { label: "Wallet", amount: 50 }
  ];
  document.getElementById("balanceSummary").innerHTML = balanceData.map(item =>
    `<div class="d-flex justify-content-between">
       <span>${item.label}</span>
       <strong>${item.amount}</strong>
     </div>`).join("");

  // Quick Overview
  const overviewData = [
    { label: "Monthly Income", amount: 345553 },
    { label: "Monthly Expense", amount: 2345 },
    { label: "Weekly", amount: 234 },
    { label: "Yearly", amount: 13245 },
    { label: "High Expense Category", amount: "Groceries" }
  ];
//   document.getElementById("quickOverview").innerHTML = overviewData.map(item =>
//     `<div class="d-flex justify-content-between">
//        <span>${item.label}</span>
//        <strong>${item.amount}</strong>
//      </div>`).join("");

document.getElementById("quickOverview").innerHTML = `
  <div class="d-flex flex-wrap gap-3">
    ${overviewData.map(item =>
      `<div>
         <strong>${item.label}:</strong> ${item.amount}
       </div>`).join("")}
  </div>`;

 

  // Pie Chart
  const pieCtx = document.getElementById("pieChart").getContext("2d");
  new Chart(pieCtx, {
    type: "pie",
    data: {
      labels: ["Groceries", "Rent", "Utilities", "Leisure"],
      datasets: [{
        data: [1200, 15000, 3000, 800],
        backgroundColor: ["#007bff", "#28a745", "#ffc107", "#dc3545"]
      }]
    }
  });

  // Bar Chart
  const barCtx = document.getElementById("barChart").getContext("2d");
  new Chart(barCtx, {
    type: "bar",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May"],
      datasets: [{
        label: "Monthly Expense",
        data: [8000, 7000, 9000, 7500, 9500],
        backgroundColor: "#17a2b8"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });


  // Defailt chart off
  
  document.getElementById("pieChartCard").classList.toggle("d-none");
  document.getElementById("barChartCard").classList.toggle("d-none");
});




  function showMessage(message, type) {
    const messageBox = document.getElementById("messageBox");
    if (messageBox) {
      messageBox.textContent = message;
      messageBox.style.color = type === 'success' ? 'green' : 'red';

      // Clear the message after 10 seconds
      setTimeout(() => {
        messageBox.textContent = '';
      }, 5000);
    }
  }



function toggleChart(type) {
  const pieSection = document.getElementById("pieChartCard");
  const barSection = document.getElementById("barChartCard");

  if (type === "pie") {
    pieSection.classList.toggle("d-none");
  } else if (type === "bar") {
    barSection.classList.toggle("d-none");
  }
}


function onNavtoCategoryConfig(){
     window.location.href = "/ExpenseTracker/Category";
}















































 