import RoomCard from "./components/RoomCard";
import { useState } from 'react'

function App() {
  const fakeRooms = [
    { number: 101, type: "Deluxe", price: 180, capacity: 2 },

    { number: 102, type: "Deluxe", price: 250, capacity: 3 },
    { number: 103, type: "Regular", price: 180, capacity: 2 },
    { number: 104, type: "Deluxe", price: 150, capacity: 1 },
  ];

  const [selectedRoomNumber, setSelectedRoomNumber] = useState(null)

  const selectedRoom = fakeRooms.find((room) => room.number === selectedRoomNumber)

  return (
    <>
      {fakeRooms.map((room) => {
        return <RoomCard key={room.number} room={room} clickRoom={setSelectedRoomNumber} />;
      })}

      {selectedRoom && (
        <div>
          <h2>Selected Room: {selectedRoom.number}</h2>
          <p>Type: {selectedRoom.type}</p>
          <p>Price: {selectedRoom.price}</p>
          <p>Capacity: {selectedRoom.capacity}</p>
        </div>
      )}
    </>
  );
}

export default App;
