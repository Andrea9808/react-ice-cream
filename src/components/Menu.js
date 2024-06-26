import React, { useState } from "react"; // Importazione di React e del hook useState
import Gelato from "./Gelato"; // Importazione del componente Gelato
import axios from "axios"; // Importazione di axios per il data fetching
// import data from "../fakeData"; // Commentato, non utilizzato

const url = "https://react--course-api.herokuapp.com/api/v1/data/gelateria"; // URL dell'API da cui ottenere i dati

const Menu = () => {
  // Settaggio di State
  const [isLoading, setIsLoading] = useState(true); // Stato per monitorare il caricamento

  // Monitoro Errori dal data fetching
  const [isError, setIsError] = useState(false); // Stato per monitorare eventuali errori nel caricamento

  // Tutti i prodotti che otterrò dalla mia api
  const [prodotti, setProdotti] = React.useState(); // Stato per memorizzare i prodotti ottenuti dall'API

  // Prodotti filtrati: Non altero mai lo state di product
  const [filterProducts, setFilterProducts] = useState(); // Stato per memorizzare i prodotti filtrati

  // Il Primo valore di Categorie sarà 'all'
  const [selceted, setSelected] = useState(0); // Stato per monitorare la categoria selezionata

  // Categorie di prodotti che potrò offire
  const [categorie, setCategorie] = useState([]); // Stato per memorizzare le categorie dei prodotti

  // Filtro prodotti e modifico valore di selected
  const filtraProdotti = (categoria, index) => {
    setSelected(index); // Imposta la categoria selezionata

    // Se indico all ripristino allo stato iniziale
    if (categoria === "all") {
      setFilterProducts(prodotti); // Mostra tutti i prodotti se la categoria è "all"
    } 
    // Se no uso filter Method
    else {
      const prodottiFiltrati = prodotti.filter((el) =>
        el.categoria === categoria ? el : ""
      ); // Filtra i prodotti in base alla categoria selezionata
      setFilterProducts(prodottiFiltrati); // Imposta i prodotti filtrati
    }
  };

  // Effetto per il data fetching
  React.useEffect(() => {
    // Funzione Invocata Immediatamente
    (async () => {
      // Reimposto valori allo stato inziale prima di incominciare data fetching
      setIsLoading(true);
      setIsError(false);
      try {
        const response = await axios.get(url); // Richiesta API per ottenere i dati
        setProdotti(response.data.data); // Memorizza i dati dei prodotti
        setFilterProducts(response.data.data); // Inizialmente mostra tutti i prodotti

        // Ottengo Array di elementi non ripetibili
        const nuoveCategorie = Array.from(
          new Set(response.data.data.map((el) => el.categoria))
        );

        // Aggiungo all'inizio termine all
        nuoveCategorie.unshift("tutti");
        setCategorie(nuoveCategorie); // Imposta le categorie

        // Termino Caricamento
        setIsLoading(false);
      } catch (error) {
        // Errore
        setIsError(true);
        setIsLoading(false);
        console.log(error); // Log dell'errore
      }
    })();
  }, []); // Effettua il data fetching al montaggio del componente

  return (
    <div className="container">
      <h4 style={{ textAlign: "center", textTransform: "uppercase" }}>
        Le Nostre Scelte
      </h4>
      {
        // Se non sto caricando e non ci sono Errori
        !isLoading && !isError ? (
          <>
            <div className="lista-categorie">
              {categorie.map((categoria, index) => (
                <button
                  className={`btn btn-selector ${
                    selceted === index && "active"
                  }`} // Aggiunge la classe "active" se la categoria è selezionata
                  key={index}
                  data-categoria={categoria}
                  onClick={() => filtraProdotti(categoria, index)} // Imposta il filtro dei prodotti
                >
                  {categoria}
                </button>
              ))}
            </div>
            <hr />
            <div className="vetrina">
              {filterProducts.map((el) => (
                <Gelato key={el.id} {...el} /> // Renderizza il componente Gelato per ogni prodotto filtrato
              ))}
            </div>
          </>
        ) : // Se non sto caricando ma sono presenti errori
        !isLoading && isError ? (
          <h4
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Errore...
          </h4>
        ) : (
          <h4
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            Caricamento...
          </h4>
        )
      }
    </div>
  );
};

export default Menu; // Esportazione del componente Menu
