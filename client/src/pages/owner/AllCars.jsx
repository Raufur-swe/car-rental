import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMyCars } from "../../redux/car/carSlice.js";

const AllCars = () => {
  const dispatch = useDispatch();

  const { cars, loading } = useSelector((state) => state.car);

  useEffect(() => {
    dispatch(getMyCars());
  }, []);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div>
      {cars.map((car) => (
        <h2 key={car._id}>{car.title}</h2>
      ))}
    </div>
  );
};

export default AllCars;