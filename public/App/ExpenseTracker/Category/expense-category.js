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
 
async function renderTable() {

  try {
    const res = await fetch(apiUrl + '/ExpenseCategoryConfigServices/getExpenseListsbyUser', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-username': storedUsername
      }
    });

    const json = await res.json();

    if (json.status === "success" && Array.isArray(json.data)) {
      const data = json.data;

  const tableBody = document.getElementById("categoryTableBody");
   tableBody.innerHTML = "";
      data.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td><input type="checkbox" class="row-select" data-id="${item.id}"></td>
          <td>${item.category}</td>
          <td>${item.subcategory}</td>
          <td>${item.importance}</td>
          
          <td>
  <div class="container-fluid p-0">
    <div class="row">
      <div class="col-6">
        <strong>Year:</strong> ${item.yearlimit}
      </div>
      <div class="col-6">
        <strong>Month:</strong> ${item.monthlimit}
      </div>
    </div>
    <div class="row">
      <div class="col-6">
        <strong>Week:</strong> ${item.weeklimit}
      </div>
      <div class="col-6">
        <strong>Day:</strong> ${item.dailylimit}
      </div>
    </div>
  </div>
</td>
          <td>${item.recurring ? `Every ${item.recurringevery}-${item.recurringtype}` : 'No'}</td>
          <td>${item.suggestions || ''}</td>
          <td>${item.notes || ''}</td>
          <td>${item.status}</td>
          <td>${new Date(item.created_on).toLocaleDateString()}</td>
        `;
        tableBody.appendChild(row);
      });

      
      
    showMessage(json.message || "Data loaded successfully.", 'success');

    } else {
       
      
    showMessage(json.error || "Failed to load data.", 'error');
    }

  } catch (err) {    
      showMessage('Failed to fetch data. Please try again.', 'error');
    
    
    console.error(err);
  }
}
 

function applyFilters() {
  alert("Filter applied (logic to be implemented)");
}
 

 
function deleteSelected() {
  const selected = getSelectedId();
  if (!selected) { 
      showMessage("Please select a row to delete.", 'error');
    return;
  } 
  showMessage("Delete request for ID: " + selected, 'success');
}

function getSelectedId() {
  const checkboxes = document.querySelectorAll(".row-select");
  for (let checkbox of checkboxes) {
    if (checkbox.checked) {
      return checkbox.getAttribute("data-id");
    }
  }
  return null;
}
 
 

document.addEventListener("DOMContentLoaded", () => {
  renderTable();

  document.getElementById("selectAll").addEventListener("change", function () {
    const checked = this.checked;
    document.querySelectorAll(".row-select").forEach(cb => cb.checked = checked);
  });
});




function onNavBack(){
     window.location.href = "/ExpenseTracker";
}


















function openAddCategory() {
  document.getElementById("addCategoryForm").reset();
  const modal = new bootstrap.Modal(document.getElementById("addCategoryModal"));
  modal.show();
}

 



async function openEditCategory() {
     const selectedId = getSelectedId();
  if (!selectedId) {
      showMessage("Please select a row to edit.", 'error');
    return;
  }
  

  const form = document.getElementById("editCategoryForm");
  form.reset();
 
  try {
    const res = await fetch(apiUrl + '/ExpenseCategoryConfigServices/readExpenseCategoryByID', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',    
          'x-username': storedUsername,
          'x-id': selectedId
        }
    });

    const json = await res.json();

    if (json.status === "success" && json.data) {
      const data = json.data;

      document.getElementById("edit_category").value = data.category;
  document.getElementById("edit_subcategory").value = data.subcategory;
  document.getElementById("edit_limitYear").value = data.yearlimit || "";
  document.getElementById("edit_limitMonth").value = data.monthlimit || "";
  document.getElementById("edit_limitWeek").value = data.weeklimit || "";
  document.getElementById("edit_limitDaily").value = data.dailylimit || "";
  document.getElementById("edit_importance").value = data.importance || "";
  document.getElementById("edit_status").value = data.status || "";
  document.getElementById("edit_suggestions").value = data.suggestions || "";
  document.getElementById("edit_notes").value = data.notes || "";
  document.getElementById("edit_recurring").checked = data.recurring || false;
  document.getElementById("edit_recurringType").value = data.recurringtype || "";
  document.getElementById("edit_recurringDays").value = data.recurringevery || "";
  document.getElementById("edit_remainder").checked = data.isreminder || false;
  document.getElementById("edit_id").value = data.id || "";

  const modal = new bootstrap.Modal(document.getElementById("editCategoryModal"));
  modal.show();

      
      
    showMessage(json.message || "Data loaded successfully.", 'success');

    } else {
       
      
    showMessage('Error:', data.error || "Failed to load data.", 'error');
    }

  } catch (err) {    
      showMessage('Failed to fetch data. Please try again.', 'error');   
    
    console.error(err);
  }

 
  
}

async function saveCategory() {
  const payload = {
    username: storedUsername,
    category: document.getElementById("add_category").value,
    subcategory: document.getElementById("add_subcategory").value,
    yearlimit: parseInt(document.getElementById("add_limitYear").value),
    monthlimit: parseInt(document.getElementById("add_limitMonth").value),
    weeklimit: parseInt(document.getElementById("add_limitWeek").value),
    dailylimit: parseInt(document.getElementById("add_limitDaily").value),
    importance: document.getElementById("add_importance").value,
    status: document.getElementById("add_status").value,
    suggestions: document.getElementById("add_suggestions").value,
    notes: document.getElementById("add_notes").value,
    recurring: document.getElementById("add_recurring").checked,
    recurringtype: document.getElementById("add_recurringType").value,
    recurringevery: parseInt(document.getElementById("add_recurringDays").value),
    isreminder: document.getElementById("add_remainder").checked
  };

  console.log("Saving category:", payload);

  try {
    const res = await fetch(apiUrl + '/ExpenseCategoryConfigServices/insertExpenseCategoryConfig', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.status === 201) {
      console.log('Success:', data.message, 'Inserted ID:', data.id);
      showMessage('Category saved successfully!', 'success');
      renderTable(); // reload updated data
    } else {
      console.error('Error:', data.error || 'Unknown error', data.details || '');
      showMessage(data.error || 'Failed to save category.', 'error');
    }
    renderTable()

  } catch (error) {
    console.error('Network or server error:', error);
    showMessage('Network error occurred. Please try again.', 'error');
  }

  // Hide the modal after attempting to save
  bootstrap.Modal.getInstance(document.getElementById("addCategoryModal")).hide();
}

async function updateCategory() {
  const payload = {
    username: storedUsername,
    category: document.getElementById("edit_category").value,
    subcategory: document.getElementById("edit_subcategory").value,
    yearlimit: parseInt(document.getElementById("edit_limitYear").value),
    monthlimit: parseInt(document.getElementById("edit_limitMonth").value),
    weeklimit: parseInt(document.getElementById("edit_limitWeek").value),
    dailylimit: parseInt(document.getElementById("edit_limitDaily").value),
    importance: document.getElementById("edit_importance").value,
    status: document.getElementById("edit_status").value,
    suggestions: document.getElementById("edit_suggestions").value,
    notes: document.getElementById("edit_notes").value,
    recurring: document.getElementById("edit_recurring").checked,
    recurringtype: document.getElementById("edit_recurringType").value,
    recurringevery: parseInt(document.getElementById("edit_recurringDays").value),
    isreminder: document.getElementById("edit_remainder").checked,
    id: document.getElementById("edit_id").value // Make sure to include the ID for update
  };

  console.log("Updating category:", payload);

  try {
    const res = await fetch(apiUrl + '/ExpenseCategoryConfigServices/updateExpenseCategoryConfig', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (data.status === 200 ||data.status === 201 || data.status === "success") {
      showMessage(data.message || 'Category updated successfully!', 'success');
      renderTable(); // Refresh table
    } else {
      showMessage(data.error || 'Failed to update category.', 'error');
      console.error('Update error:', data.error, data.details);
    }
    renderTable()

  } catch (error) {
    console.error('Network or server error:', error);
    showMessage('Network error occurred. Please try again.', 'error');
    
  }

  bootstrap.Modal.getInstance(document.getElementById("editCategoryModal")).hide();
}



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
