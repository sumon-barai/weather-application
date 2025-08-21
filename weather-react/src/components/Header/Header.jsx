import { useState } from "react";
import logo from "../../assets/images/logo.png";
import useFavoriteData from "../../hooks/useFavoriteData";
import { useLocationData } from "../../hooks";

function Header() {
  const [show, setShow] = useState(false);
  const { favoriteList } = useFavoriteData();
  const { setLocation } = useLocationData();
  const [inputLocation, setInputLocation] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?city=${inputLocation}&format=json`
      );

      if (!response.ok) {
        const message = "invalid city";
        throw new Error(message);
      }

      const result = await response.json();

      if (result.length > 0) {
        const { lat, lon, name } = result[0];

        setLocation({
          city: name,
          latitude: lat,
          longitude: lon,
        });
        setInputLocation("");
      } else {
        setLocation({
          city: "",
          latitude: "",
          longitude: "",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <header>
      <nav>
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="action">
          <form onSubmit={handleSubmit}>
            <input
              id="input-text"
              type="search"
              placeholder="Type any valid city name"
              onChange={(e) => setInputLocation(e.target.value)}
              value={inputLocation}
            />
          </form>
          <div id="fav-list">
            <button id="fav-list-btn" onClick={() => setShow(!show)}>
              Favorite List
            </button>
            {show && (
              <ul>
                {favoriteList.length > 0 ? (
                  favoriteList.map((item) => (
                    <li
                      onClick={() =>
                        setLocation({
                          city: item.city,
                          latitude: item.latitude,
                          longitude: item.longitude,
                        })
                      }
                      key={item.city}
                    >
                      {item.city}
                    </li>
                  ))
                ) : (
                  <li>No Favorite list</li>
                )}
              </ul>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
