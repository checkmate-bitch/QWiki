// Use default color scheme
function save_scheme() {
    console.log("inside save_scheme ");
    var colors = {};
    colors.bgColor = "#2f4f4f";
    colors.paraColor = "#f5deb3";
    colors.mainHeading = "#f1f1f1";
    colors.closeColor = "#ffffff";
    colors.subHeading = "#f5deb3"
    colors.subHeadingH3 = "#f5deb3"

    console.log("default color palette", { colors });
    chrome.storage.sync.set({
        "colors": colors,
    }, function() {
        // Update status to let user know options were saved.
        // console.log("just trhying for", a);
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Use custom color scheme
function save_colors() {
    console.log("inside save_colors ");
    var colors = {};
    colors.bgColor = document.getElementById("bg-color").value;
    colors.paraColor = document.getElementById("para-font-color").value;
    colors.mainHeading = document.getElementById("main-head-font-color").value;
    colors.closeColor = document.getElementById("close-font-color").value;
    colors.subHeading = document.getElementById("sub-head-font-color").value;
    colors.subHeadingH3 = document.getElementById("sub-head-font-color").value;
    console.log("current color palette", { colors });
    var enableDbClick = document.getElementById("enable-db-click").checked;
    // console.log("db click or not", enableDbClick);
    chrome.storage.sync.set({
        "colors": colors,
        "isDbClick": enableDbClick
    }, function() {
        // Update status to let user know options were saved.
        // console.log("just trhying for", a);
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function() {
            status.textContent = '';
        }, 750);
    });
}

// Restores input values stored in chrome.storage.
function restore_options() {
    console.log("restore called");
    // chrome.storage.sync.clear();
    chrome.storage.sync.get([ "colors", "isDbClick" ], function(items) {
        console.log( {items} );
        if(items.colors) {
            document.getElementById("bg-color").value = items.colors.bgColor;
            document.getElementById("para-font-color").value = items.colors.paraColor;
            document.getElementById("main-head-font-color").value = items.colors.mainHeading;
            document.getElementById("close-font-color").value = items.colors.closeColor;
            document.getElementById("sub-head-font-color").value = items.colors.subHeading;
            document.getElementById("enable-db-click").checked = items.isDbClick;
        }
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save-color-scheme').addEventListener('click', save_scheme);
document.getElementById('save-each-color').addEventListener('click', save_colors);
