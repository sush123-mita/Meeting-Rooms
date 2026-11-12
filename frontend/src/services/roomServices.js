import api from "./api";

export const getRooms = async () => {
  const response = await api.get("rooms/");
  return response.data;
};

export const checkRoomAvailability = async (
  roomId,
  startDatetime,
  endDatetime
) => {
  const response = await api.get("rooms/available/", {
    params: {
      room_id: roomId,
      start_datetime: startDatetime,
      end_datetime: endDatetime,
    },
  });

  return response.data;
};