<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Expense Management</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" />
</head>
<body class="bg-light">
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary px-3">
    <button class="btn btn-outline-light mr-3">← Back</button>
    <span class="navbar-brand mx-auto font-weight-bold">Expense Management</span>
    <div>
      <button class="btn btn-outline-light mr-2 notification-icon" data-toggle="popover" title="Notifications" data-content="Loading notifications...">🔔</button>
      <button class="btn btn-outline-light" data-toggle="popover" title="User Menu" data-html="true" data-content="<a href='#'>Settings</a><br><a href='#'>Logout</a>">👤</button>
    </div>
  </nav>

  <div class="container-fluid mt-4">
    <div class="row">
      <div class="col-md-3">
        <div class="card mb-3">
          <div class="card-header bg-info text-white">Filter</div>
          <div class="card-body">
            <div class="form-group">
              <label>From Date</label>
              <input type="date" class="form-control" id="fromDate">
            </div>
            <div class="form-group">
              <label>To Date</label>
              <input type="date" class="form-control" id="toDate">
            </div>
            <button class="btn btn-primary btn-block mb-2" id="btnSearch">Search</button>
            <button class="btn btn-secondary btn-block">View/Export</button>
          </div>
        </div>

        <div class="card">
          <div class="card-header bg-warning">Reminders</div>
          <div class="card-body">
            <ul class="nav nav-tabs" id="reminderTabs">
              <li class="nav-item">
                <a class="nav-link active" data-toggle="tab" href="#upcoming">Upcoming</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" data-toggle="tab" href="#missed">Missed</a>
              </li>
            </ul>
            <div class="tab-content mt-2">
              <div class="tab-pane fade show active" id="upcoming">
                <ul id="upcomingList" class="list-group"></ul>
              </div>
              <div class="tab-pane fade" id="missed">
                <ul id="missedList" class="list-group"></ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-9">
        <div class="row">
          <div class="col-md-6">
            <div class="card mb-3">
              <div class="card-header bg-success text-white">Balance Summary</div>
              <div class="card-body text-center">
                <div class="row font-weight-bold">
                  <div class="col">Wallet</div>
                  <div class="col">Cash</div>
                  <div class="col">Bank</div>
                  <div class="col">Total</div>
                </div>
                <div class="row">
                  <div class="col" id="walletBalance">$120</div>
                  <div class="col" id="cashBalance">$80</div>
                  <div class="col" id="bankBalance">$400</div>
                  <div class="col" id="totalBalance">$600</div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-6">
            <div class="card mb-3">
              <div class="card-header bg-danger text-white">Expense Overview</div>
              <div class="card-body">
                <p>Monthly Income: <strong id="monthlyIncome">$2500</strong></p>
                <p>Monthly Expense: <strong id="monthlyExpense">$1600</strong></p>
                <p>Weekly Spend: <strong id="weeklySpend">$450</strong></p>
                <p>High Expense Category: <strong id="highExpenseCategory">Groceries</strong></p>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-3 d-flex justify-content-end">
          <button class="btn btn-success mr-2">Add Expense</button>
          <button class="btn btn-info">Category Config</button>
        </div>

        <div class="card">
          <div class="card-header bg-dark text-white">Expense Table</div>
          <div class="card-body p-0">
            <table class="table table-bordered table-hover mb-0">
              <thead class="thead-dark">
                <tr>
                  <th>Date/Time</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Sub Category</th>
                  <th>Description</th>
                  <th>Payment Mode</th>
                  <th>Amount</th>
                  <th>Flow</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody id="expenseTableBody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script src="https://code.jquery.com/jquery-3.5.1.min.js"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.bundle.min.js"></script>
  <script>
    $(document).ready(function () {
      $('[data-toggle="popover"]').popover({ trigger: 'click', placement: 'bottom' });

      const dummyNotifications = ["Your rent is due soon.", "Salary credited.", "Budget updated."];
      $('[data-toggle="popover"]').eq(0).attr('data-content', dummyNotifications.join('<br>'));

      const upcomingList = ["Salary Credit - 20 May", "Netflix - 25 May"];
      const missedList = ["Electricity Bill - 10 May"];
      upcomingList.forEach(item => $('#upcomingList').append(`<li class='list-group-item'>${item}</li>`));
      missedList.forEach(item => $('#missedList').append(`<li class='list-group-item'>${item}</li>`));

      function showToast(message) {
        const toast = $(`<div class="alert alert-info position-fixed" style="top:10px; right:10px; z-index:9999;">${message}</div>`);
        $('body').append(toast);
        setTimeout(() => toast.fadeOut(500, () => toast.remove()), 3000);
      }

      function loadTable() {
        const username = sessionStorage.getItem("username") || "praveen";
        $.ajax({
          url: "http://localhost:3001/oData/v1/ExpenseServices/getExpenseListsbyUser",
          method: "GET",
          headers: { username },
          success: function (res) {
            if (res.status === "success") {
              const data = res.data || [];
              $('#expenseTableBody').empty();
              data.forEach(item => {
                $('#expenseTableBody').append(`
                  <tr>
                    <td>${item.transactiontime}</td>
                    <td>${item.type}</td>
                    <td>${item.category}</td>
                    <td>${item.subcategory}</td>
                    <td>${item.description}</td>
                    <td>${item.payment_mode}</td>
                    <td>${item.amount}</td>
                    <td>${item.flow}</td>
                    <td>
                      <button class="btn btn-sm btn-primary">Edit</button>
                      <button class="btn btn-sm btn-danger btn-delete" data-id="${item.id}">Delete</button>
                    </td>
                  </tr>
                `);
              });
              showToast("Expenses loaded successfully.");
            }
          },
          error: function () {
            alert("Failed to load expenses.");
          }
        });
      }

      $(document).on("click", ".btn-delete", function () {
        const id = $(this).data("id");
        if (confirm("Are you sure you want to delete this expense?")) {
          $.ajax({
            url: `http://localhost:3001/oData/v1/ExpenseServices/deleteexpense?id=${id}`,
            method: 'DELETE',
            success: function () {
              showToast("Expense deleted successfully.");
              loadTable();
            },
            error: function () {
              alert("Error deleting expense.");
            }
          });
        }
      });

      loadTable();
    });
  </script>
</body>
</html>
