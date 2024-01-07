// function for updating status in html/ejs file
function updateStatus(habitId, day) {
    // Get the selected value from the dropdown
    const newStatusElement = document.getElementById(`${habitId}-${day}-new-status`);
    const newStatus = newStatusElement.value;

    // Update the status in the HTML only if the day is today or a previous day
    const currentDayIndex = new Date().getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const providedDayIndex = daysOfWeek.indexOf(day);
    console.log(providedDayIndex, currentDayIndex)

    if (providedDayIndex <= currentDayIndex) {
        // Update the status in the HTML
        const statusElement = document.getElementById(`${habitId}-${day}-status`);
        statusElement.innerText = newStatus;

        // Send an AJAX request to update the status in the database
        fetch(`/updatestatus/${habitId}/${day}/${newStatus}`, {
            method: 'PUT',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                // Handle the response as needed
            })
            .catch(error => console.error('Error:', error));
    } else {
        new Noty({
            theme: 'relax',
            text: "Cannot update status for future days",
            type: 'error',
            layout: 'topRight',
            timeout: 2000
        }).show();
        return;
    }
}