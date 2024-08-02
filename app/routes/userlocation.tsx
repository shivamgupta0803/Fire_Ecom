import { useEffect, useState } from "react";

const apiEndpoint = "https://api.opencagedata.com/geocode/v1/json";
const apiKey = "f9c716176b314c70817cc133191eb466";

async function getUserCurrentAddress(latitude: number, longitude: number) {
  const query = `${latitude},${longitude}`;
  const apiUrl = `${apiEndpoint}?key=${apiKey}&q=${query}&pretty=1`;
  const res = await fetch(apiUrl);
  const data = await res.json();
  return data;
}

const UserLocation = () => {
  const [ipAddress, setIpAddress] = useState("");
  const [geoInfo, setGeoInfo] = useState<any>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [gpsLatitude, setGpsLatitude] = useState<number | null>(null);
  const [gpsLongitude, setGpsLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState<any>(null);
  const [gpsAddress, setGpsAddress] = useState<any>(null);

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
          setGpsAddress(addressData.results[0].components);
        },
        (error) => {
          console.log("Geolocation error:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setGpsLatitude(latitude);
          setGpsLongitude(longitude);
          const addressData = await getUserCurrentAddress(latitude, longitude);
          setGpsAddress(addressData.results[0].components);
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
    return `${address.road || "Unnamed road"}, ${
      address.neighbourhood || ""
    }, ${address.suburb || ""}, ${
      address.city || address.city_district || address._normalized_city || ""
    }, ${address.state || ""}, ${address.postcode || ""}, ${
      address.country || ""
    }`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6 md:p-12">
      <h1 className="text-4xl font-extrabold mb-8 text-indigo-600">
        IP & GPS Location Info
      </h1>
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">IP Location</h2>
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
          className="w-full bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition duration-200"
        >
          Get Info
        </button>
        {geoInfo && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-indigo-600 mb-4">IP Address Details</h3>
            <div className="space-y-4">
              <div>
                <strong className="block text-gray-700">Country:</strong>
                <span className="text-gray-900">{geoInfo.country} ({geoInfo.countryCode})</span>
              </div>
              <div>
                <strong className="block text-gray-700">Region:</strong>
                <span className="text-gray-900">{geoInfo.regionName}</span>
              </div>
              <div>
                <strong className="block text-gray-700">City:</strong>
                <span className="text-gray-900">{geoInfo.city}</span>
              </div>
              <div>
                <strong className="block text-gray-700">ZIP:</strong>
                <span className="text-gray-900">{geoInfo.zip}</span>
              </div>
              <div>
                <strong className="block text-gray-700">Latitude:</strong>
                <span className="text-gray-900">{geoInfo.lat}</span>
              </div>
              <div>
                <strong className="block text-gray-700">Longitude:</strong>
                <span className="text-gray-900">{geoInfo.lon}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {(latitude !== null && longitude !== null) && (
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Current Coordinates</h2>
          <div className="space-y-4">
            <div>
              <strong className="block text-gray-700">Latitude:</strong>
              <span className="text-gray-900">{latitude}</span>
            </div>
            <div>
              <strong className="block text-gray-700">Longitude:</strong>
              <span className="text-gray-900">{longitude}</span>
            </div>
            {address && (
              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">Address Details</h3>
                <strong className="block text-gray-700">Formatted Address:</strong>
                <span className="text-gray-900">{formatAddress(address)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {(gpsLatitude !== null && gpsLongitude !== null) && (
        <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">GPS Coordinates</h2>
          <div className="space-y-4">
            <div>
              <strong className="block text-gray-700">Latitude:</strong>
              <span className="text-gray-900">{gpsLatitude}</span>
            </div>
            <div>
              <strong className="block text-gray-700">Longitude:</strong>
              <span className="text-gray-900">{gpsLongitude}</span>
            </div>
            {gpsAddress && (
              <div>
                <h3 className="text-xl font-semibold text-indigo-600 mb-2">GPS Address Details</h3>
                <strong className="block text-gray-700">Formatted Address:</strong>
                <span className="text-gray-900">{formatAddress(gpsAddress)}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserLocation;
