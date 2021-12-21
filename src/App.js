import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import Table from 'react-bootstrap/Table';
import Bootbox from 'bootbox-react';
import Modal from 'react-modal';
import './App.css';

export default function App() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);
  const [showAlert, setShowAlert] = useState(false)
  const [itemInfo, setItemInfo] = useState([]);
  const [itemInfoisLoaded, setitemInfoisLoaded] = useState(false);
  const [modal, setModal] = useState([]);
  const [showModal, setShowModal] = useState(false);

  async function fetchCountries() {
    setIsLoaded(false);
    var pof = await fetch("https://restcountries.com/v3.1/all");
    var pof_json = await pof.json();
    var pof_json_trimmed = pof_json.map((item) => (
      {
        name: item.name,
        capital: item.capital,
        region: item.region,
        languages: item.languages,
        population: item.population,
        flags: item.flags
      }));
    setItems(pof_json_trimmed);
    setIsLoaded(true);
  }

  async function fetchCountryDetails(country){
      setitemInfoisLoaded(false);
      var countryDetails = await fetch(" https://en.wikipedia.org/api/rest_v1/page/summary/" + country);
      var countryDetailsJson = await countryDetails.json();
      var countryDetailsExtractHtml = countryDetailsJson['extract_html']
      setItemInfo(countryDetailsExtractHtml);
      setitemInfoisLoaded(true);
      setShowAlert(true);
  }

  function modalHandler(languages) {
    setShowModal(true)
    setModal(
      languages.map(item => {return (<div>{item}</div>)})
      )
  }

  function modalClose() {
    setShowModal(false)
    setShowAlert(false)
  }

  useEffect(fetchCountries, [])
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div class="px-5">
          <Bootbox
            show={showAlert & itemInfoisLoaded & !showModal}
            type={'alert'}
            message={itemInfo ? itemInfo : <p>No information recieved for this country</p>}
            onClose={() => (setShowAlert(false))}
          />
          <Modal
            isOpen={showModal}
            contentLabel="Language Modal"
            onRequestClose={  modalClose}
            shouldCloseOnOverlayClick={true}
          >
            {modal}
          </Modal>
          <Table stripped bordered hover variant="dark" size="sm">
            <thead>
              <tr >
                <th>Flag</th>
                <th>Official Name</th>
                <th>Capital</th>
                <th>Region</th>
                <th>Language</th>
                <th>Population</th>
              </tr>
            </thead>
            <tbody>
              {isLoaded &&
                items.sort((first, second) => first.name.official.localeCompare(second.name.official)).map(item => {
                  return (
                    <tr onClick={() => fetchCountryDetails(item.name.official)}>
                      <td><img class='flag-img' src={item.flags["png"]} height='auto' alt="..."></img></td>
                      <td>{item.name.official}</td>
                      <td>{item.capital ? (item.capital) : '-'}</td>
                      <td>{item.region}</td>
                      <td>{item.languages ? <button type="button" class="btn btn-link" onClick={() => modalHandler(item.languages)}>Languages</button> : '-'}</td>
                      <td class="text-end">{item.population}</td>
                    </tr>
                  )
                }
                )
              }
            </tbody>
          </Table>
        </div>
      </header>
    </div>
  );
}

