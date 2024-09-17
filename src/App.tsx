import React from "react";
import Block from "./components/Block";
import Header from "./components/Header";
import "./scss/index.scss";

function App() {
  const [popupOpen, setPopupOpen] = React.useState<boolean[]>([false, false]);
  const [fromCurrency, setFromCurrency] = React.useState<string>("USD");
  const [toCurrency, setToCurrency] = React.useState<string>("UAH");
  const [fromPrice, setFromPrice] = React.useState<number>(1);
  const [toPrice, setToPrice] = React.useState<number>(0);
  const [rates, setRates] = React.useState<{ [key: string]: number }>({});
  const [uahRates, setUahRates] = React.useState<{ USD: number; EUR: number }>({
    USD: 0,
    EUR: 0,
  });

  React.useEffect(() => {
    fetch("https://www.cbr-xml-daily.ru/latest.js")
      .then((res) => res.json())
      .then((json) => {
        const rubToUah = 0.41602; // Приблизний курс рубля до гривні
        const usdToUah = json.rates.USD * (rubToUah * 10000);
        const eurToUah = json.rates.EUR * (rubToUah * 10000);

        setRates(json.rates);
        setUahRates({
          USD: Number(eurToUah.toFixed(3)),
          EUR: Number(usdToUah.toFixed(3)),
        });
        onChangeFromPrice(1);
      })
      .catch((err) => {
        console.warn(err);
        alert("Не вдалося отримати інформацію");
      });
  }, []);

  const onChangeFromPrice = (value: number) => {
    const price = value / rates[fromCurrency];
    const result = price * rates[toCurrency];
    setToPrice(Number(result.toFixed(3)));
    setFromPrice(value);
  };

  const onChangeToPrice = (value: number) => {
    const result = (rates[fromCurrency] / rates[toCurrency]) * value;
    setFromPrice(Number(result.toFixed(3)));
    setToPrice(value);
  };

  React.useEffect(() => {
    onChangeFromPrice(fromPrice);
  }, [fromCurrency]);

  React.useEffect(() => {
    onChangeToPrice(toPrice);
  }, [toCurrency]);

  const togglePopup = (index: number) => {
    setPopupOpen((prevStates) => {
      const newStates = [...prevStates];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  return (
    <div className="wrapper">
      <Header usdRate={uahRates.USD} eurRate={uahRates.EUR} />
      <div className="App">
        <Block
          value={fromPrice}
          currency={fromCurrency}
          onChangeValue={onChangeFromPrice}
          onChangeCurrency={setFromCurrency}
          togglePopup={() => togglePopup(0)}
          isPopupOpen={popupOpen[0]}
        />
        <Block
          value={toPrice}
          currency={toCurrency}
          onChangeValue={onChangeToPrice}
          onChangeCurrency={setToCurrency}
          togglePopup={() => togglePopup(1)}
          isPopupOpen={popupOpen[1]}
        />
      </div>
    </div>
  );
}

export default App;
