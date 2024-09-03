$(document).ready(() => {
    // Function to update the submit button state
    const updateSubmitButtonState = () => {
        const formData = {
            gender: $('input[name="gender"]:checked').val(),
            smoking: $('input[name="smoking"]:checked').val(),
            drinking_frequency: $('input[name="drinking_frequency"]:checked').val(),
            sleep_pattern: $('input[name="sleep_pattern"]:checked').val(),
            sleep_habit: $('input[name="sleep_habit"]:checked').val(),
            guest_visit: $('input[name="guest_visit"]:checked').val(),
            comment: $('#comment').val().trim() // Check if the comment field is not empty
        };

        const isFormValid = Object.values(formData).every(value => value !== undefined && value !== '');

        const checkRequired = () => {
            let allSelected = true;
            $('input[type="checkbox"], input[type="radio"]').each(function () {
                const name = $(this).attr('name');
                if ($(`input[name="${name}"]:checked`).length === 0) {
                    allSelected = false;
                    return false;
                }
            });
            return allSelected;
        };

        if (isFormValid && checkRequired()) {
            $("#submit").removeAttr("disabled");
        } else {
            $("#submit").attr("disabled", "disabled");
        }
    };

    // Function to populate form with existing checklist data
    const populateFormData = (data) => {
        if (data) {
            $(`input[name="gender"][value="${data.GENDER}"]`).prop('checked', true);
            $(`input[name="dorm"][value="${data.DORM}"]`).prop('checked', true);
            $(`input[name="smoking"][value="${data.SMOKING}"]`).prop('checked', true);
            $(`input[name="drinking_frequency"][value="${data.DRINKING_FREQUENCY}"]`).prop('checked', true);
            $(`input[name="sleep_pattern"][value="${data.SLEEP_PATTERN}"]`).prop('checked', true);
            $(`input[name="sleep_habit"][value="${data.SLEEP_HABIT}"]`).prop('checked', true);
            $(`input[name="guest_visit"][value="${data.GUEST_VISIT}"]`).prop('checked', true);
            $('#comment').val(data.COMMENT); // Populate the comment field
        }

        updateSubmitButtonState();
    };

    // AJAX call to fetch existing checklist data
    $.ajax({
        url: '/checklist/get_checklist',
        method: 'GET',
        success: (response) => {
            populateFormData(response);
        },
        error: (error) => {
            console.error("Error fetching checklist data:", error);
        }
    });

    // Update submit button state on input click or textarea input
    $("input[type='checkbox'], input[type='radio'], #comment").on('click keyup', function () {
        const name = $(this).attr('name');
        if (this.checked) {
            $(`input[name='${name}']`).not(this).prop('checked', false);
        }
        updateSubmitButtonState();
    });
});