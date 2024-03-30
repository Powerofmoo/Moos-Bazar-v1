import React, { useState, useEffect } from 'react';
import { hello_backend } from 'declarations/hello_backend';

import ProcessingModal from './Modal';
import NewEntryModal from './NewModal'; // Import the modal component

function App() {
  const [isProcessing, setIsProcessing] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    refreshOffers();
    setIsProcessing(false);

  }, []);

  async function handleSubmit(event) {
    event.preventDefault();

    setIsProcessing(true);
    refreshOffers();
    setIsProcessing(false);

    return false;
  }

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  }
  
  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsProcessing(true);
    refreshOffers();
    setIsProcessing(false);
  }

  // call function on backend
  async function doAction(offernr)
  {
    setIsProcessing(true);
    await hello_backend.acquireOffer(offernr);
    refreshOffers();
    setIsProcessing(false);
  }

  // Assuming you have a function to call the getOpenOffers method
  function refreshOffers () {
    hello_backend.getOpenOffers().then(offers => {
      // Create table
      let table = document.createElement('table');
      table.className = 'table-community'; 

      // Create table header
      let thead = document.createElement('thead');
      let headerRow = document.createElement('tr');
      ['Gift', 'Offered By', '', 'Description', 'Exchange', ''].forEach(headerText => {
          let th = document.createElement('th');
          th.appendChild(document.createTextNode(headerText));
          headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Create table body
      let tbody = document.createElement('tbody');
      offers.forEach(offer => {
          let row = document.createElement('tr');
          let img ="";
          if (offer.url != "") img = '<img class="img-in-table" src="' + offer.url + '">';
          [offer.number, offer.offeredBy, img, offer.description ].forEach(text => {
              let td = document.createElement('td');
              td.innerHTML = text;
              row.appendChild(td);
          });

          // add price
          let tdPrice = document.createElement('td');
          var text = "<table cellspacing=5><tr>";
          if (offer.orangePrice) {
            text += "<td>" + offer.orangePrice + '</td><td><img src="/orange button x 42.jpg"></td>'; 
          }
          if (offer.greenPrice) {
            if (offer.orangePrice) text += "<td>+</td>";
            text += "<td>" + offer.greenPrice + '</td><td><img src="/green button x 42.jpg"></td>'; 

          }
          text += "</tr></table>";
          tdPrice.innerHTML = text;
          row.appendChild(tdPrice);

          // add button
          let tdButton = document.createElement('td');
          let button = document.createElement('button');
          button.className = 'button-community'; // Sets the class
          button.innerHTML = 'Accept'; // Add the text you want on the button
          button.onclick = function() {
            doAction(offer.number);
          };
          tdButton.appendChild(button);
          row.appendChild(tdButton);

          // row ready
          tbody.appendChild(row);
      });
      table.appendChild(tbody);

      let divElement = document.getElementById('offers');
      divElement.innerHTML = "";
      divElement.appendChild (table);

    }).catch(error => {
      console.error('Error retrieving offers:', error);
    });
  }

  return (
    <main>
      <table  class="full-width-table"><tr>
      <td><button onClick={openModal} class="button-community">Announce&nbsp;Offer</button></td>
      <td><img src="/moos bazar banner.jpg" alt="Moos Bazar Banner" class="full-width-image"/></td>
      <td><form action="#" onSubmit={handleSubmit}><button type="submit" class="button-community">Refresh</button></form></td>
      </tr></table>

      <div id="offers"></div>

      <NewEntryModal isOpen={isModalOpen} onClose={closeModal} />
      {isProcessing && <ProcessingModal></ProcessingModal>}
    </main>
  );
}

export default App;
