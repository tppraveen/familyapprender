// expense-category.js
const apiUrl = "/oData/v1"; // Replace with your actual backend URL
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
















 
  // API base URL (adjust as per your server)
  const API_BASE = '/oData/v1';

  // Bootstrap modal instance
  let expenseModal = new bootstrap.Modal(document.getElementById('expenseModal'));

  // Current editing expense id (null if adding)
  let editingExpenseId = null;

  // Utility - show alert (success or danger)
 function showAlert(message, type = 'success') {
  const alertId = 'alert-' + Date.now();
  const alertHtml = `
    <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  $('#alertPlaceholder').append(alertHtml);
  setTimeout(() => {
    $('#' + alertId).alert('close');
  }, 4000);
}


  // Format date to yyyy-MM-ddTHH:mm for datetime-local input
  function formatDateTimeLocal(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    const pad = (n) => n.toString().padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // Format date for display (dd/MM/yyyy HH:mm)
  function formatDisplayDate(dateStr) {
    const d = new Date(dateStr);
    if (isNaN(d)) return '';
    const pad = (n) => n.toString().padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  // Load categories and fill category dropdown
  function loadCategories(selectedCategory) {
    
    let storedUsername = sessionStorage.getItem("username");
    return $.ajax({
      url: `${API_BASE}/ExpenseCategoryConfigServices/getCategoryListsByUser`,
      method: 'GET',
       headers: {
      'Content-Type': 'application/json',
      'x-username': storedUsername
    },
      dataType: 'json',
      success: function(res) {
        if(res.status === 'success') {
          let options = '<option value="">Select Category</option>';
          res.data.forEach(cat => {
            options += `<option value="${cat}" ${cat === selectedCategory ? 'selected' : ''}>${cat}</option>`;
          });
          $('#categorySelect').html(options).trigger('change');
        } else {
          showAlert('Failed to load categories', 'danger');
        }
      },
      error: function() {
        showAlert('Error loading categories', 'danger');
      }
    });
  }
    storedUsername = sessionStorage.getItem("username");

  // Load subcategories by selected category
  function loadSubCategories(category, selectedSubCategory) {
    
    if (!category) {
      $('#subCategorySelect').html('<option value="">Select Sub Category</option>');
      return;
    }
    $.ajax({
      url: `${API_BASE}/ExpenseCategoryConfigServices/getSubCategoryListsByUser`,
      method: 'GET',
      dataType: 'json',
    headers: {
      'Content-Type': 'application/json',
      'x-username': storedUsername,
      'x-category': category
    },
      
      data: { category }, // Assuming category param required, adjust if not
      success: function(res) {
        if(res.status === 'success') {
          let options = '<option value="">Select Sub Category</option>';
          res.data.forEach(sub => {
            options += `<option value="${sub}" ${sub === selectedSubCategory ? 'selected' : ''}>${sub}</option>`;
          });
          $('#subCategorySelect').html(options);
        } else {
          showAlert('Failed to load sub categories', 'danger');
        }
      },
      error: function() {
        showAlert('Error loading sub categories', 'danger');
      }
    });
  }

  // Load expenses from API and populate table
  function loadExpenses() {
    let storedUsername = sessionStorage.getItem("username");
    $.ajax({
      url: `${API_BASE}/ExpenseServices/getExpenseListsbyUser`,
      method: 'GET', 
       headers: {
      'Content-Type': 'application/json',
      'x-username': storedUsername
    },
      dataType: 'json',
      success: function(res) {
        if(res.status === 'success') {
          const rows = res.data.map(exp => {
            return `
              <tr data-id="${exp.id}">
                <td>${formatDisplayDate(exp.transactiondate)}</td>
                <td>${exp.type}</td>
                <td>${exp.category}</td>
                <td>${exp.subcategory}</td>
                <td>${exp.description || ''}</td>
                <td>${exp.payment_mode}</td>
                <td>${exp.amount}</td>
                <td>${exp.flow}</td>
                <td>
                 
                  
                  <button class=" btn btn-sm btn-primary icon-btn edit-btn text-primary" title="Edit"><i class="bi bi-pencil-fill fs-5 icon-btn"></i></button>
                  <button class="btn btn-sm btn-primary  icon-btn delete-btn text-danger" title="Delete"><i class="bi bi-trash-fill fs-5 icon-btn"></i></button>
                </td>
              </tr>`;
          }).join('');
          $('#expenseTable tbody').html(rows);
        } else {
          showAlert('Failed to load expenses', 'danger');
        }
      },
      error: function() {
        showAlert('Error loading expenses', 'danger');
      }
    });
  }

  // Clear form
  function clearForm() {
    $('#expenseForm')[0].reset();
    $('#expenseForm input[name="id"]').val('');
  }

  // Populate form for edit
  function populateForm(exp) {
    $('#expenseForm input[name="id"]').val(exp.id);
    $('#expenseForm input[name="datetime"]').val(formatDateTimeLocal(exp.transactiondate));
    $('#expenseForm select[name="type"]').val(exp.type);
    $('#expenseForm select[name="payment_mode"]').val(exp.payment_mode);
    $('#expenseForm select[name="is_planned"]').val(exp.is_planned ? 'Yes' : 'No');
    $('#expenseForm select[name="category"]').val(exp.category);
    // loadSubCategories will set sub_category value asynchronously
    loadSubCategories(exp.category, exp.subcategory);
    $('#expenseForm input[name="amount"]').val(exp.amount);
    $('#expenseForm select[name="payment_status"]').val(exp.payment_status);
    $('#expenseForm textarea[name="description"]').val(exp.description);
    $('#expenseForm select[name="impact_saving"]').val(exp.saving_impact ? 'Yes' : 'No');
    $('#expenseForm select[name="cycle"]').val(exp.cycle);
    $('#expenseForm input[name="merchant_name"]').val(exp.merchant_name);
    $('#expenseForm input[name="with_whom"]').val(exp.with_whom);
    $('#expenseForm input[name="notes"]').val(exp.notes);
    $('#expenseForm select[name="expense_mood"]').val(exp.expense_mood);
  }

  // Add or Update Expense API call
  function saveExpense(data, isEdit) {
    // Prepare payload keys according to API example
    const payload = {
      id: data.id,
      datetime: data.datetime,
      type: data.type,
      payment_mode: data.payment_mode,
      is_planned: data.is_planned,
      category: data.category,
      sub_category: data.sub_category,
      amount: data.amount,
      payment_status: data.payment_status,
      description: data.description,
      impact_saving: data.impact_saving,
      cycle: data.cycle,
      merchant_name: data.merchant_name,
      with_whom: data.with_whom,
      notes: data.notes,
      expense_mood: data.expense_mood,
      username : storedUsername
    };

    // Decide API endpoint and method
    let url, method;
    if (isEdit) {
      url = `${API_BASE}/ExpenseServices/updateExpense/${payload.id}`; // Assuming you have this API, else adjust
      method = 'PUT';
    } else {
      url = `${API_BASE}/ExpenseServices/insertExpense`;
      method = 'POST';
    }

    return $.ajax({
      url,
      method,
      contentType: 'application/json',
      data: JSON.stringify(payload),
    });
  }

  // Delete Expense API call
  function deleteExpense(id) {
    return $.ajax({
      url: `${API_BASE}/ExpenseServices/deleteExpense/` + id, // Assuming this endpoint exists
      method: 'PUT',
      contentType: 'application/json',
      data: JSON.stringify({ username:storedUsername }),
    });
  }

  // On document ready
  $(function() {
    loadExpenses();
    loadCategories();

    // When category changes, load subcategories
    $('#categorySelect').on('change', function() {
      loadSubCategories(this.value);
    });

    // Open add expense modal
    $('#addExpenseBtn').on('click', function() {
      editingExpenseId = null;
      clearForm();
      $('#expenseModalLabel').text('Add Transaction');
      expenseModal.show();
    });

    // Close buttons
    $('#CloseAddExpenseBtn, #CloseAddExpenseBtn2').on('click', function() {
      expenseModal.hide();
    });

    // Save expense (add or edit)
    $('#saveExpenseBtn').on('click', function() {
      const form = $('#expenseForm')[0];
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const formData = Object.fromEntries(new FormData(form).entries());

      // Normalize boolean fields
      formData.is_planned = formData.is_planned === 'Yes' ? true : false;
      formData.impact_saving = formData.impact_saving === 'Yes' ? true : false;

      // For datetime-local to ISO string (assuming API expects ISO)
      formData.datetime = new Date(formData.datetime).toISOString();

      const isEdit = !!formData.id;

      saveExpense(formData, isEdit)
        .done(res => {
          if (res.status === 'success') {
            showAlert(`Expense ${isEdit ? 'updated' : 'added'} successfully.`);
            expenseModal.hide();
            loadExpenses();
          } else {
            showAlert(res.message || `Failed to ${isEdit ? 'update' : 'add'} expense.`, 'danger');
          }
        })
        .fail(() => {
          showAlert(`Error while ${isEdit ? 'updating' : 'adding'} expense.`, 'danger');
        });
    });

    // Edit button click
    $('#expenseTable').on('click', '.edit-btn', function() {
      const row = $(this).closest('tr');
      const id = row.data('id');

      // Fetch expense by id from current table or API (for simplicity, API)
      $.ajax({
        url: `${API_BASE}/ExpenseServices/readExpenseByID`, // Adjust to your API
        method: 'GET',
        dataType: 'json',
         headers: {
        'Content-Type': 'application/json',
        'x-username': storedUsername,
        'x-id':id
      },
        data: { id },
        success: function(res) {
          if(res.status === 'success' && res.data) {
            editingExpenseId = id;
            $('#expenseModalLabel').text('Edit Transaction');
            populateForm(res.data);
            expenseModal.show();
          } else {
            showAlert('Failed to load expense for editing', 'danger');
          }
        },
        error: function() {
          showAlert('Error fetching expense details', 'danger');
        }
      });
    });

    // Delete button click
    $('#expenseTable').on('click', '.delete-btn', function() {
      const row = $(this).closest('tr');
      const id = row.data('id');

      if(confirm('Are you sure you want to delete this expense?')) {
        deleteExpense(id)
          .done(res => {
            if(res.status === 'success') {
              showAlert('Expense deleted successfully.');
              loadExpenses();
            } else {
              showAlert('Failed to delete expense.', 'danger');
            }
          })
          .fail(() => {
            showAlert('Error deleting expense.', 'danger');
          });
      }
    });
  });




























 