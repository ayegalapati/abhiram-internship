import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Slider from "react-slick"; 
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 

const Countdown = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    // If there is no expiry date, don't run the timer
    if (!expiryDate) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = expiryDate - now;

      if (distance < 0) {
        clearInterval(interval);
        setTimeLeft("EXPIRED");
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [expiryDate]);

  // If there's no time left or no expiry date, hide the badge or show default text
  if (!timeLeft) return null;

  return <div className="de_countdown">{timeLeft}</div>;
};

const NewItems = () => {
  const [users, setUsers] = useState([]);
  
  async function getUsers() {
    const { data } = await axios.get("https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems");
    setUsers(data);
  }
  
  useEffect(() => {
    getUsers();
  }, []);
  
  // Updated carousel settings
  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4, 
    slidesToScroll: 1,
    autoplay: false, // Changed to false: Stops automatic movement
    arrows: true,    // Keeps the left and right arrows active
    responsive: [
      {
        breakpoint: 992,
        settings: { slidesToShow: 3 }
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2 }
      },
      {
        breakpoint: 576,
        settings: { slidesToShow: 1 }
      }
    ]
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <Slider {...sliderSettings}>
              {users.map((user) => (
                <div className="px-3" key={user.id}>
                  <div className="nft__item">
                    <div className="author_list_pp">
                      <Link
                        to="/author"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Creator: Monica Lucas"
                      >
                        <img className="lazy" src={user.authorImage} alt="" />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>
                
                    {/* REPLACED THE STATIC DIV WITH THE COMPONENT */}
                    {/* Note: Check your API data to see what the exact property name is for the expiration date (e.g., user.expiryDate) */}
                    <Countdown expiryDate={user.expiryDate} />

                    <div className="nft__item_wrap">
                      <div className="nft__item_extra">
                        <div className="nft__item_buttons">
                          <button>Buy Now</button>
                          <div className="nft__item_share">
                            <h4>Share</h4>
                            <a href="" target="_blank" rel="noreferrer">
                              <i className="fa fa-facebook fa-lg"></i>
                            </a>
                            <a href="" target="_blank" rel="noreferrer">
                              <i className="fa fa-twitter fa-lg"></i>
                            </a>
                            <a href="">
                              <i className="fa fa-envelope fa-lg"></i>
                            </a>
                          </div>
                        </div>
                      </div>

                      <Link to="/item-details">
                        <img
                          src={user.nftImage}
                          className="lazy nft__item_preview"
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="nft__item_info">
                      <Link to="/item-details">
                        <h4>{user.title}</h4>
                      </Link>
                      <div className="nft__item_price">{user.price} ETH</div>
                      <div className="nft__item_like">
                        <i className="fa fa-heart"></i>
                        <span>{user.likes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;
