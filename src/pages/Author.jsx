import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";

const Author = () => {
  // Reads the ID from the URL: /author/:authorId
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);
  // Starts unfollowed on every page load (nothing is saved)
  const [isFollowing, setIsFollowing] = useState(false);

  function toggleFollow(event) {
    event.preventDefault(); // stop the Link from navigating
    setIsFollowing((prev) => !prev);
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsFollowing(false); // reset when switching to a different author

    async function getAuthor() {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://us-central1-nft-cloud-functions.cloudfunctions.net/authors?author=${authorId}`
        );
        setAuthor(data);
      } catch (error) {
        console.error("Could not load author:", error);
        setAuthor(null);
      } finally {
        setLoading(false);
      }
    }

    getAuthor();
  }, [authorId]); // Re-fetch if the ID in the URL changes

  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            {loading ? (
              <div className="text-center">
                <h2>Loading...</h2>
              </div>
            ) : !author ? (
              <div className="text-center">
                <h2>Author not found</h2>
              </div>
            ) : (
              <div className="row">
                <div className="col-md-12">
                  <div className="d_profile de-flex">
                    <div className="de-flex-col">
                      <div className="profile_avatar">
                        <img src={author.authorImage} alt={author.authorName} />

                        <i className="fa fa-check"></i>
                        <div className="profile_name">
                          <h4>
                            {author.authorName}
                            <span className="profile_username">@{author.tag}</span>
                            <span id="wallet" className="profile_wallet">
                              {author.address}
                            </span>
                            <button
                              id="btn_copy"
                              title="Copy Text"
                              onClick={() => navigator.clipboard.writeText(author.address)}
                            >
                              Copy
                            </button>
                          </h4>
                        </div>
                      </div>
                    </div>
                    <div className="profile_follow de-flex">
                      <div className="de-flex-col">
                        <div className="profile_follower">
                          {author.followers + (isFollowing ? 1 : 0)} followers
                        </div>
                        <Link to="#" className="btn-main" onClick={toggleFollow}>
                          {isFollowing ? "Unfollow" : "Follow"}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-12">
                  <div className="de_tab tab_simple">
                    {/* Gives AuthorItems this author's NFTs and picture */}
                    <AuthorItems
                      nftCollection={author.nftCollection}
                      authorImage={author.authorImage}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;