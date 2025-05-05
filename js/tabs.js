// Tab functionality
function openTab(evt, tabId) {
    // Hide all tab contents
    var tabContents = document.getElementsByClassName("tab-content");
    for (var i = 0; i < tabContents.length; i++) {
        tabContents[i].classList.remove("active");
    }
    
    // Remove active class from all buttons
    var tabButtons = document.getElementsByClassName("tab-btn");
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove("active");
    }
    
    // Show the clicked button's content and add active class to the button
    document.getElementById(tabId).classList.add("active");
    evt.currentTarget.classList.add("active");
} 