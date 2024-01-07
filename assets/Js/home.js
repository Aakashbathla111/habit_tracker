function updateStatus(habitId, newStatus) {
    // Update the status in the HTML
    const statusElement = document.getElementById(`${habitId}-status`);
    statusElement.innerText = newStatus;
    fetch(`/update-status/${habitId}/${newStatus}`, {
        method: 'PUT',
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}
