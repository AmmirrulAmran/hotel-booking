

function RoomCard({ room, clickRoom }) {

  return (

    <>
    <div onClick={() => clickRoom(room.number)}>

          <h1>Room Name {room.number}</h1>
          <h2>Room type {room.type}</h2>
          <p>Price {room.price}</p>
          <p>Capacity {room.capacity}</p>
        </div>
</>
  );
}

export default RoomCard
