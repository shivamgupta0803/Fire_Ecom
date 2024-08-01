import { useEffect, useState } from "react";

const apiEndpoint = "https://api.opencagedata.com/geocode/v1/json";
const apiKey = "f9c716176b314c70817cc133191eb466";

async function getUserCurrentAddress(latitude: number, longitude: number) {
  let query = `${latitude},${longitude}`;
  let apiUrl = `${apiEndpoint}?key=${apiKey}&q=${query}&pretty=1`;

  const res = await fetch(apiUrl);
  const data = await res.json();
  return data;
}

const UserLocation = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [geoInfo, setGeoInfo] = useState<any>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState<any>(null);

  useEffect(() => {
    getVisitorsIp();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLatitude(latitude);
          setLongitude(longitude);
          const addressData = await getUserCurrentAddress(latitude, longitude);
          setAddress(addressData.results[0].components);
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  async function getVisitorsIp() {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      setIpAddress(data.ip);
    } catch (error) {
      console.log("Failed to fetch IP:", error);
    }
  }

  async function handleInputChange(e: any) {
    setIpAddress(e.target.value);
  }

  async function fetchIpInfo() {
    try {
      const response = await fetch(`http://ip-api.com/json/${ipAddress}`);
      const data = await response.json();
      setGeoInfo(data);
    } catch (error) {
      console.log("Failed to fetch IP info:", error);
    }
  }

  const formatAddress = (address: any) => {
    return `${address.road || "Unnamed road"}, ${address.neighbourhood || ""}, ${address.suburb || ""}, ${address.city || address.city_district || address._normalized_city || ""}, ${address.state || ""}, ${address.postcode || ""}, ${address.country || ""}`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-600">
        IP Location Info
      </h1>
      <div className="form-area w-full max-w-md mb-8 p-6 bg-white rounded-lg shadow-md">
        <label className="block mb-2 text-lg font-medium text-gray-700">
          Enter IP Address
        </label>
        <input
          type="text"
          className="border border-gray-300 rounded-lg px-4 py-2 mb-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={ipAddress}
          onChange={handleInputChange}
        />
        <button
          onClick={fetchIpInfo}
          className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition duration-200"
        >
          Get Info
        </button>
      </div>
      {geoInfo && (
        <div className="result w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
            Location Details
          </h2>
          <div className="mb-4">
            <strong className="block text-gray-700">Country:</strong>
            <span className="text-gray-900">
              {geoInfo.country} ({geoInfo.countryCode})
            </span>
          </div>
          <div className="mb-4">
            <strong className="block text-gray-700">Region:</strong>
            <span className="text-gray-900">{geoInfo.regionName}</span>
          </div>
          <div className="mb-4">
            <strong className="block text-gray-700">City:</strong>
            <span className="text-gray-900">{geoInfo.city}</span>
          </div>
          <div className="mb-4">
            <strong className="block text-gray-700">ZIP:</strong>
            <span className="text-gray-900">{geoInfo.zip}</span>
          </div>
          <div className="mb-4">
            <strong className="block text-gray-700">Latitude:</strong>
            <span className="text-gray-900">{geoInfo.lat}</span>
          </div>
          <div className="mb-4">
            <strong className="block text-gray-700">Longitude:</strong>
            <span className="text-gray-900">{geoInfo.lon}</span>
          </div>
        </div>
      )}
      {latitude !== null && longitude !== null && (
        <div className="result w-full max-w-md bg-white p-6 mt-4 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-indigo-600">
            Your Coordinates
          </h2>
          <div className="mb-4">
            <strong className="block text-gray-700">Latitude:</strong>
            <span className="text-gray-900">{latitude}</span>
          </div>
          <div className="mb-4">
            <strong className="block text-gray-700">Longitude:</strong>
            <span className="text-gray-900">{longitude}</span>
          </div>
          {address && (
            <div className="mt-4">
              <h2 className="text-xl font-semibold mb-2 text-indigo-600">
                Address Details
              </h2>
              <div className="mb-4">
                <strong className="block text-gray-700">Formatted Address:</strong>
                <span className="text-gray-900">{formatAddress(address)}</span>
              </div>
              <div className="mb-4">
                <strong className="block text-gray-700">Country:</strong>
                <span className="text-gray-900">{address.country}</span>
              </div>
              <div className="mb-4">
                <strong className="block text-gray-700">State:</strong>
                <span className="text-gray-900">{address.state}</span>
              </div>
              <div className="mb-4">
                <strong className="block text-gray-700">City:</strong>
                <span className="text-gray-900">
                  {address.city || address.city_district || address._normalized_city}
                </span>
              </div>
              <div className="mb-4">
                <strong className="block text-gray-700">Postcode:</strong>
                <span className="text-gray-900">{address.postcode}</span>
              </div>
              <div className="mb-4">
                <strong className="block text-gray-700">Neighbourhood:</strong>
                <span className="text-gray-900">{address.neighbourhood}</span>
              </div>
              <div className="mb-4">
                <strong className="block text-gray-700">Road:</strong>
                <span className="text-gray-900">{address.road}</span>
              </div>
              <div className="mb-4">
                <strong className="block text-gray-700">Suburb:</strong>
                <span className="text-gray-900">{address.suburb}</span>
              </div>
              <div className="mb-4">
                <strong className="block text-gray-700">Continent:</strong>
                <span className="text-gray-900">{address.continent}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserLocation;
