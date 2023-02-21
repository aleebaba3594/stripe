import "./App.css";
import StripeCheckout from "react-stripe-checkout";
import React, { useState } from "react";
import axios from "axios";

function App() {
  const publishableKey =
    "pk_test_51McS3iCt7GL5xFUxxy88iXkyqLtlHDrkEi7Znr5F7FmXP62rAnxf1fTpJ63MkxcTeByXr102MXvI5ZPaBRuaEL7i00y4kxYQAj";
  const [product, setProduct] = useState({
    name: "Headphone",
    price: 5,
  });
  const [searchInput, setSearchInput] = useState(false);
  const [trackinId, setTrackinId] = useState();
  const [result, setResult] = useState(false);
  const [transactionValue, setTransactionValue] = useState([]);
  const [globalErrors, setGlobalErrors] = useState([]);
  const priceForStripe = product.price * 100;
  const payNow = async (token) => {
    try {
      const response = await axios({
        url: "http://localhost:8000/payment",
        method: "post",
        data: {
          amount: product.price * 100,
          token,
        },
      });
      if (response.status === 200) {
        console.log(response.data.dataReturned);
        if (response.data.dataReturned.status === "succeeded") {
          setSearchInput(true);
          localStorage.setItem("shopId", response.data.dataReturned.id);
        }
      }
    } catch (error) {
      setGlobalErrors(error.message);
      console.log(error);
    }
  };
  const handleSearch = async () => {
    await axios
      .post("http://localhost:8000/track-transaction", { trackinId })
      .then((res) => {
        setTrackinId(null);
        if (res.data.status === "not found") {
          setResult(true);
        } else {
          setTransactionValue(res.data);
          setResult(false);
        }
      })
      .catch((error) => {
        setGlobalErrors(error);
        console.log(error);
      });
  };
  return (
    <div className="container">
      {globalErrors.length > 0 && (
        <div>Some thing went wriong in network request</div>
      )}
      <h2>React , Express , MongoDb and Stripe Challenge</h2>
      <p>
        <span>Product: </span>
        {product.name}
      </p>
      <p>
        <span>Price: </span>${product.price}
      </p>
      <StripeCheckout
        stripeKey={publishableKey}
        label="Pay Now"
        name="Pay With Credit Card"
        billingAddress
        shippingAddress
        amount={priceForStripe}
        description={`Your total is $${product.price}`}
        token={payNow}
      >
        <button className="btn">Buy Headphones</button>
      </StripeCheckout>
      {searchInput && (
        <div style={{ color: "blue" }}>
          <p>your transaction was successfull</p>
          <p>search your transaction by id available in local storage </p>
          <input
            onChange={(e) => {
              setTrackinId(e.target.value);
            }}
          />
          <span style={{ marginLeft: "10px" }}>
            <button onClick={handleSearch}>search</button>
          </span>
        </div>
      )}
      {result ? (
        <div>transaction not found</div>
      ) : (
        transactionValue.map((ele, index) => {
          return (
            <div key={index}>
              <p>amount paid : $ {ele.amount}</p>
              <p>transaction status : {ele.status}</p>
              <p>shopping ID: {ele.shopId}</p>
            </div>
          );
        })
      )}
    </div>
  );
}

export default App;
