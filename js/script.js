let currentOrderDetails = {}; // Global variable to store order details
let generatedOrderNumbers = new Set(); // To track unique Order Numbers


// Generate Unique ID and Order Number
function generateUniqueIdAndOrderNumber() {
    const uniqueId = 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });

    let orderNumber;
    do {
        orderNumber = Math.random().toString(36).substring(2, 6).toUpperCase();
    } while (generatedOrderNumbers.has(orderNumber)); // Ensure no duplicates

    generatedOrderNumbers.add(orderNumber); // Store unique Order Number
    return { uniqueId, orderNumber };

}


// Generate a unique session ID
        function generateSessionID() {
            return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function (c) {
                const r = (Math.random() * 16) | 0;
                const v = c === 'x' ? r : (r & 0x3) | 0x8;
                return v.toString(16);
            });
        }

        // Store the session ID in localStorage
        const sessionID = localStorage.getItem('sessionID') || generateSessionID();
        localStorage.setItem('sessionID', sessionID);

        // Periodically log activity to the backend
        // setInterval(() => {
        //     fetch('http://192.168.136.246/verleihsystem_bwm/log_activity.json', {
        //         method: 'POST',
        //         headers: { 'Content-Type': 'application/json' },
        //         body: JSON.stringify({ sessionID }),
        //     })
        //         .then(response => response.json())
        //         .then(data => console.log(data.message))
        //         .catch(error => console.error('Error logging activity:', error));
        // }, 30000); // Log every 30 seconds


// Address Modal
document.addEventListener('DOMContentLoaded', () => {
    const addressInput = document.getElementById('adresse');
    const addressModal = document.getElementById('addressModal');
    const overlay = document.getElementById('overlay');
    const addressModalClose = document.getElementById('addressModalClose');
    const saveAddressButton = document.getElementById('saveAddress');

    // Modal fields
    const streetInput = document.getElementById('strasse');
    const postalCodeInput = document.getElementById('postleizahl');
    const cityInput = document.getElementById('ort');

    // Open the address modal
    addressInput.addEventListener('click', () => {
        addressModal.style.display = 'block';
        overlay.style.display = 'block';
    });

    // Close the modal
    function closeModal() {
        addressModal.style.display = 'none';
        overlay.style.display = 'none';
    }
    addressModalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    // Save the entered address and update the main address input
    saveAddressButton.addEventListener('click', () => {
        const street = streetInput.value.trim();
        const postalCode = postalCodeInput.value.trim();
        const city = cityInput.value.trim();

        if (!street || !postalCode || !city) {
            alert('Bitte füllen Sie alle Felder aus!');
            return;
        }

        addressInput.value = `${street}, ${postalCode}, ${city}`;
        closeModal();
    });
});




// Populate Schuhgröße Table
document.addEventListener('DOMContentLoaded', () => {
    const anzahlErwachseneInput = document.getElementById('anzahlErwachsene');
    const anzahlKinderInput = document.getElementById('anzahlKinder');
    const schuhgroesseErwContainer = document.querySelector('.schuhgroesseErw');
    const schuhgroesseKindContainer = document.querySelector('.schuhgroesseKind');

    const incrementErwachsene = document.getElementById('incrementErwachsene');
    const decrementErwachsene = document.getElementById('decrementErwachsene');
    const incrementKinder = document.getElementById('incrementKinder');
    const decrementKinder = document.getElementById('decrementKinder');

    const mietdauerInput = document.getElementById('mietdauer');
    const kautionText = document.querySelector('.kaution-text');
    const eintrittText = document.querySelector('.eintritt-text');
    const mietbeginnField = document.getElementById('mietbeginn'); // Field to display current time

    // Function to update current time in "Mietbeginn" field
    function updateMietbeginn() {
        const now = new Date();
        mietbeginnField.value = now.toLocaleString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    }
    // Update the field every second
    setInterval(updateMietbeginn, 1000);

    function createSchuhgroesseDropdown(type, count) {
        const select = document.createElement('select');
        select.name = `schuhgroesse_${type}_${count}`;
        select.id = `schuhgroesse_${type}_${count}`;
        select.required = true;

        const sizes = type === 'Erwachsene'
            ? Array.from({ length: 21 }, (_, i) => 30 + i)
            : Array.from({ length: 16 }, (_, i) => 25 + i);

        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Größe';
        defaultOption.disabled = true;
        defaultOption.selected = true;
        select.appendChild(defaultOption);

        sizes.forEach(size => {
            const option = document.createElement('option');
            option.value = size;
            option.textContent = size;
            select.appendChild(option);
        });

        return select;
    }

    function addSchuhgroesseBlock(container, count, type) {
        const inputDiv = document.createElement('div');
        inputDiv.className = 'schuhgroesse-field';
        inputDiv.id = `${type}-field-${count}`;

        const label = document.createElement('label');
        label.textContent = `Schuhgröße ${type} ${count}:`;
        label.setAttribute('for', `schuhgroesse_${type}_${count}`);

        const select = createSchuhgroesseDropdown(type, count);

        inputDiv.appendChild(label);
        inputDiv.appendChild(select);
        container.appendChild(inputDiv);
    }

    function removeSchuhgroesseBlock(container, count, type) {
        const blockToRemove = document.getElementById(`${type}-field-${count}`);
        if (blockToRemove) {
            container.removeChild(blockToRemove);
        }
    }

    incrementErwachsene.addEventListener('click', () => {
        let count = parseInt(anzahlErwachseneInput.value) || 0;
        count++;
        anzahlErwachseneInput.value = count;
        addSchuhgroesseBlock(schuhgroesseErwContainer, count, 'Erwachsene');
    });

    decrementErwachsene.addEventListener('click', () => {
        let count = parseInt(anzahlErwachseneInput.value) || 0;
        if (count > 0) {
            removeSchuhgroesseBlock(schuhgroesseErwContainer, count, 'Erwachsene');
            count--;
            anzahlErwachseneInput.value = count;
        }
    });

    incrementKinder.addEventListener('click', () => {
        let count = parseInt(anzahlKinderInput.value) || 0;
        count++;
        anzahlKinderInput.value = count;
        addSchuhgroesseBlock(schuhgroesseKindContainer, count, 'Kinder');
    });

    decrementKinder.addEventListener('click', () => {
        let count = parseInt(anzahlKinderInput.value) || 0;
        if (count > 0) {
            removeSchuhgroesseBlock(schuhgroesseKindContainer, count, 'Kinder');
            count--;
            anzahlKinderInput.value = count;
        }
    });

    const pricePerHourAdults = 5;
    const pricePerHourKids = 2.5;
    const kautionPrice = 15;

    function updateSums() {
        const anzahlErwachsene = parseInt(anzahlErwachseneInput.value) || 0;
        const anzahlKinder = parseInt(anzahlKinderInput.value) || 0;
        const mietdauer = parseFloat(mietdauerInput.value) || 0;

        const totalPairs = anzahlErwachsene + anzahlKinder;
        const kaution = totalPairs * kautionPrice;

        const eintrittAdults = anzahlErwachsene * pricePerHourAdults * mietdauer;
        const eintrittKids = anzahlKinder * pricePerHourKids * mietdauer;
        const eintritt = eintrittAdults + eintrittKids;

        kautionText.textContent = `Kaution: ${kaution.toFixed(2)} €`;
        eintrittText.textContent = `Eintritt: ${eintritt.toFixed(2)} €`;
    }

    incrementErwachsene.addEventListener('click', updateSums);
    decrementErwachsene.addEventListener('click', updateSums);
    incrementKinder.addEventListener('click', updateSums);
    decrementKinder.addEventListener('click', updateSums);
    mietdauerInput.addEventListener('input', updateSums);

    updateSums();
});

// // Form Submission and Modal Logic
        document.addEventListener('DOMContentLoaded', () => {
            const ausleihenButton = document.getElementById('ausleihenButton');
            const confirmationModal = document.getElementById('confirmationModal');
            const overlay = document.getElementById('overlay');
            const confirmButton = document.getElementById('confirmButton');
            const cancelButton = document.getElementById('cancelButton');
            const confirmationDetails = document.getElementById('confirmationDetails');

            fully.print()
            
            // Open confirmation modal
            ausleihenButton.addEventListener('click', () => {
                if (!validateForm()) return; // Ensure form validation

                const formData = gatherFormData();
                confirmationDetails.innerHTML = `
                    <h3>Bestellübersicht</h3>
                    ${formData}
                `;


           
                confirmationModal.style.display = 'block';
                overlay.style.display = 'block';
            });

            // Close confirmation modal
            cancelButton.addEventListener('click', () => {
                confirmationModal.style.display = 'none';
                overlay.style.display = 'none';
            });


            confirmButton.addEventListener('click', () => {
                console.log('Confirm button clicked');
            
                // Hide confirmation modal
                confirmationModal.style.display = 'none';
                overlay.style.display = 'none';
            
                // Gather order details
                const orderDetails = {
                    uniqueID: currentOrderDetails.uniqueId,
                    orderNumber: currentOrderDetails.orderNumber,
                    customerName: `${document.getElementById('vorname').value} ${document.getElementById('name').value}`,
                    address: document.getElementById('adresse').value,
                    rentalDuration: document.getElementById('mietdauer').value,
                    startTime: document.getElementById('mietbeginn').value,
                    adults: document.getElementById('anzahlErwachsene').value,
                    kids: document.getElementById('anzahlKinder').value,
                    shoeSizes: gatherShoeSizes(),
                    kaution: document.querySelector('.kaution-text').textContent,
                    eintritt: document.querySelector('.eintritt-text').textContent,
                };
            
                // Send order to print
                sendOrderToPrint(orderDetails);
            
                // Save the order
                const saveOrderUrl = `${window.location.origin}/verleihsystem/save_order.php`;
                fetch(saveOrderUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderDetails),
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.status === 'success') {
                            console.log('Order saved successfully:', data.message);
                            showSuccessModal();
                        } else {
                            console.error('Saving order failed:', data.message);
                            alert('Error: ' + data.message);
                        }
                    })
                    .catch(error => {
                        console.error('Error saving order:', error);
                        alert('Error communicating with the server.');
                    });
            });
            

                
                
                  
            });

          
            

            function showSuccessModal() {
                const successModal = document.getElementById('successModal');
                const overlaySuccess = document.getElementById('overlay-success');
            
                // Display the success modal and overlay
                successModal.style.display = 'block';
                overlaySuccess.style.display = 'block';
            
                // Add event listener to reset the form when "OK" is clicked
                const resetFormButton = document.getElementById('resetFormButton');
                resetFormButton.addEventListener('click', () => {
                    // Hide the modal
                    successModal.style.display = 'none';
                    overlaySuccess.style.display = 'none';
            
                    // Reset the form
                    const rentalForm = document.getElementById('rentalForm');
                    rentalForm.reset();
            
                    // Clear dynamically generated elements
                    document.querySelector('.schuhgroesseErw').innerHTML = '';
                    document.querySelector('.schuhgroesseKind').innerHTML = '';
            
                    // Reset displayed sums to "0,00 €"
                    document.querySelector('.kaution-text').textContent = 'Kaution: 0,00 €';
                    document.querySelector('.eintritt-text').textContent = 'Eintritt: 0,00 €';
            
                    // Reset kiosk to start page
                    resetToStartPage();
                });
            }
                        

        
        
    function gatherFormData() {
        const vorname = document.getElementById('vorname').value;
        const name = document.getElementById('name').value;
        const address = document.getElementById('adresse').value;
        const mietdauer = document.getElementById('mietdauer').value;
        const adults = document.getElementById('anzahlErwachsene').value;
        const kids = document.getElementById('anzahlKinder').value;
        const kaution = document.querySelector('.kaution-text').textContent;
        const eintritt = document.querySelector('.eintritt-text').textContent;
        const mietbeginn = document.getElementById('mietbeginn').value;

        const shoeSizes = gatherShoeSizes()
            .map(item => `${item.type} ${item.index}: Größe ${item.size}`)
            .join('<br>');

        return `
            <p><strong>Bestellung Nr.:</strong> ${currentOrderDetails.orderNumber}</p>
            <p><strong>Name:</strong> ${vorname} ${name}</p>
            <p><strong>Adresse:</strong> ${address}</p>
            <p><strong>Mietdauer:</strong> ${mietdauer} Stunden</p>
            <p><strong>Mietbeginn:</strong> ${mietbeginn}</p>
            <p><strong>Anzahl Erwachsene:</strong> ${adults}</p>
            <p><strong>Anzahl Kinder:</strong> ${kids}</p>
            <p><strong>${kaution}</strong></p>
            <p><strong>${eintritt}</strong></p>
            <p><strong>Schuhgrößen:</strong><br>${shoeSizes}</p>
        `;
    }

    function gatherShoeSizes() {
        const adultSizes = Array.from(document.querySelectorAll('.schuhgroesseErw select')).map((select, index) => ({
            type: 'Erwachsene',
            index: index + 1,
            size: select.value,
        }));

        const childSizes = Array.from(document.querySelectorAll('.schuhgroesseKind select')).map((select, index) => ({
            type: 'Kinder',
            index: index + 1,
            size: select.value,
        }));

        return [...adultSizes, ...childSizes];
    }

    function validateForm() {
        const requiredFields = document.querySelectorAll('#rentalForm input[required], #rentalForm select[required]');
        for (let field of requiredFields) {
            if (!field.value) {
                alert(`Bitte füllen Sie das Feld "${field.name}" aus.`);
                return false;
            }
        }
        if (!currentOrderDetails.uniqueId || !currentOrderDetails.orderNumber) {
            currentOrderDetails = generateUniqueIdAndOrderNumber();
        }
        return true;
    }

// setInterval(() => {
//     fetch('keep_alive.php')
//         .then(response => response.json())
//         .then(() => console.log('Server kept alive'))
//         .catch(error => console.error('Error:', error));
// }, 30000); // Every 30 seconds

function sendOrderToPrint(orderDetails) {
    if (typeof fully !== 'undefined') {
        // Save current page to PDF automatically
        const pdfFileName = `order_${orderDetails.orderNumber}.pdf`;
        console.log('Fully Kiosk detected. Generating PDF...');
        fully.print2Pdf(pdfFileName);

        // Optional: If you need to print directly
        fully.print();
    } else {
        console.warn('Fully Kiosk API not available. Using fallback.');
        // Fallback to server-side print endpoint
        const printUrl = `${window.location.origin}/verleihsystem/print_order.php`;
        fetch(printUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderDetails),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    console.log('Order printed successfully:', data.message);
                } else {
                    console.error('Printing failed:', data.message);
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error sending order to print:', error);
                alert('Error communicating with the server.');
            });
    }
}

// function sendOrderToPrint(orderDetails) {
//     fetch('http://localhost/verleihsystem_bwm/print_order.php', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(orderDetails),
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             if (data.status === 'success') {
//                 console.log('Order printed successfully:', data.message);
//                 alert('Order printed successfully! PDF sent to printer.');
//             } else {
//                 console.error('Printing failed:', data.message);
//                 alert('Error: ' + data.message);
//             }
//         })
//         .catch(error => {
//             console.error('Error sending order to print:', error);
//             alert('Error communicating with the server. Please try again.');
//         });
// }
