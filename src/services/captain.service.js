import captainModel from "../models/captain.model.js";

export default async function createCaptain({
  firstname,
  lastname,
  email,
  password,
  color,
  plate,
  capacity,
  vehicleType,
}) {
  if (
    !firstname ||
    !email ||
    !password ||
    !plate ||
    !capacity ||
    !color ||
    !vehicleType
  ) {
    throw new Error("all fields are required");
  }
  try {
    const captain = await captainModel.create({
      fullname: {
        firstname,
        lastname,
      },
      email,
      password,
      vehicle: {
        color,
        plate,
        capacity,
        vehicleType,
      },
    });
    return captain;
  } catch (error) {
    throw new Error(`error: ${error?.message}`);
  }
}
