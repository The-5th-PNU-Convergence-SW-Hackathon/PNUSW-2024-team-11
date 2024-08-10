$(document).ready(() => {
    const defaultUrl = '/matching';

  $('#rmt_checklist').on('submit', (event) => {
      event.preventDefault();

      // Collect form data
      const formData = {
          gender: $('input[name="gender"]:checked').val(),
          smoking: $('input[name="smoking"]:checked').val(),
          drinking_frequency: $('input[name="drinking_frequency"]:checked').val(),
          sleep_pattern: $('input[name="sleep_pattern"]:checked').val(),
          sleep_habit: $('input[name="sleep_habit"]:checked').val(),
          guest_visit: $('input[name="guest_visit"]:checked').val()
      };

      // Check if all fields are filled
      const isFormValid = Object.values(formData).every(value => value !== undefined);

      // Check if all checkboxes and radio buttons have a selected option
      const checkRequired = () => {
          let allSelected = true;
          $('input[type="checkbox"], input[type="radio"]').each(function() {
              const name = $(this).attr('name');
              if ($(`input[name="${name}"]:checked`).length === 0) {
                  allSelected = false;
                  return false; // Exit loop early if a required input is not selected
              }
          });
          return allSelected;
      };

      if (!isFormValid || !checkRequired()) {
          $("#submit").removeAttr("disabled");
          return false;
      }


      console.log(formData);

  });

  $("input[type='checkbox']").on('click', function() {
    const name = $(this).attr('name');
    if (this.checked) {
        $(`input[name='${name}']`).not(this).prop('checked', false);
    }
  });

});