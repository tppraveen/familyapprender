 const apiUrl = "/oData/v1"; // Replace with your actual backend URL

  // Check if user is logged in
  function validateLoginUser() {
    const storedUsername = sessionStorage.getItem("username");

    if (storedUsername) {
      console.log("Welcome back, " + storedUsername + "!");
    } else {
      window.location.href = "/";
    }
  }
   function showMessage(message, type) {
    const modal = new bootstrap.Modal(document.getElementById('popupMessageModal'));
    $('#popupMessageBody').text(message);
    const title = type === 'success' ? 'Success' : 'Error';
    const titleColor = type === 'success' ? 'text-success' : 'text-danger';
    $('#popupMessageLabel').text(title).removeClass('text-success text-danger').addClass(titleColor);
    modal.show();
  }

  // Load menu tiles dynamically
  function loadMenuTiles() {
    const username = sessionStorage.getItem("username");

      
    $.ajax({
      url: `${apiUrl}/UserServices/getLoginUserMenu`,
      method: 'GET',
      headers: {
        'X-Username': username
      },
      success: function (result) {
        const $container = $('#menu-container');
        $container.empty();
         if (result.status === "success") {
            showMessage(result.message, 'success');
           
          } else {
            showMessage(result.message, 'error');
          }
        let tiles= result.data
        tiles.forEach(tile => {
          const $col = $(`
            <div class="col">
              <div class="menu-tile h-100 d-flex flex-column justify-content-between" style="cursor: pointer;">
                <div>
                  <i class="bi ${tile.icon || 'bi-box'} fs-4 mb-2"></i>
                  <h5>${tile.menu}</h5>
                  <p class="text-muted">${tile.label}</p>
                </div>
              </div>
            </div>
          `);

          $col.find('.menu-tile').on('click', function () {
            navigateTo(tile.path);
          });

          $container.append($col);
         //   showMessage(tiles.message, 'error');
        });
      },
      error: function () {
          showMessage('Failed to load menu tiles.. Please try again.', 'error');
      }
    });
  }

  // Navigation handler
  function navigateTo(path) {
    window.location.href = path;
  }

  // Run on DOM ready
  $(document).ready(function () {
    validateLoginUser();
    loadMenuTiles();
  });