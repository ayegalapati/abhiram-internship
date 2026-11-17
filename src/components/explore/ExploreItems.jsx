import React, {useState, useEffect} from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const INITIAL_COUNT = 8;
const LOAD_STEP = 4;
const MAX_COUNT = 16;

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

const ExploreItems = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  async function getUsers() {
    const { data } = await axios.get(
      "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore"
    );
    setUsers(data);
  }

  useEffect(() => {
    getUsers();
  }, []);

  function filterItems(event) {
    setFilter(event.target.value)
  }

  function loadMore(event) {
    event.preventDefault(); // stop the Link from navigating
    setVisibleCount((prev) => Math.min(prev + LOAD_STEP, MAX_COUNT));
  }

  const sortedUsers = [...users];
  
  if (filter === "price_low_to_high") {
    sortedUsers.sort((a,b) => Number(a.price) - Number(b.price));
  }
  if (filter === "price_high_to_low") {
    sortedUsers.sort((a,b) => Number(b.price) - Number(a.price));
  }
  if (filter === "likes_high_to_low") {
    sortedUsers.sort((a,b) => Number(b.likes) - Number(a.likes));
  }

  // Only render the first `visibleCount` items
  const visibleUsers = sortedUsers.slice(0, visibleCount);

  // Hide the button at 16, or earlier if the API returned fewer items
  const showLoadMore =
    visibleUsers.length < Math.min(MAX_COUNT, sortedUsers.length);

  return (
    <>
      <div>
        <select id="filter-items" value={filter} onChange={filterItems}>
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      {visibleUsers.map((user) => (
        <div
          key={user.id}
          className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
          style={{ display: "block", backgroundSize: "cover" }}
        >
          <div className="nft__item">
            <div className="author_list_pp">
              <Link
                to={`/author/${user.authorId}`}
                data-bs-toggle="tooltip"
                data-bs-placement="top"
              >
                <img className="lazy" src={user.authorImage} alt="" />
                <i className="fa fa-check"></i>
              </Link>
            </div>

            <Countdown expiryDate={user.expiryDate} />

            <div className="nft__item_wrap">
              <div className="nft__item_extra">
                <div className="nft__item_buttons">
                  <button>Buy Now</button>
                  <div className="nft__item_share">
                    <h4>Share</h4>
                    <a href="/" target="_blank" rel="noreferrer">
                      <i className="fa fa-facebook fa-lg"></i>
                    </a>
                    <a href="/" target="_blank" rel="noreferrer">
                      <i className="fa fa-twitter fa-lg"></i>
                    </a>
                    <a href="/">
                      <i className="fa fa-envelope fa-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
              <Link to={`/item-details/${user.nftId}`}>
                <img src={user.nftImage} className="lazy nft__item_preview" alt="" />
              </Link>
            </div>
            <div className="nft__item_info">
              <Link to={`/item-details/${user.nftId}`}>
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
      {showLoadMore && (
        <div className="col-md-12 text-center">
          <Link to="" id="loadmore" className="btn-main lead" onClick={loadMore}>
            Load more
          </Link>
        </div>
      )}
    </>
  );
};

export default ExploreItems;