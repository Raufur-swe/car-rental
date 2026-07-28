import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ImageUploader from "./ImageUploader";

import { addCar } from "../../redux/car/carSlice.js";

import {
  brands,
  categories,
  transmissions,
  fuelTypes,
  seats,
} from "../../mock/carOptions.js";

// পরে import করবে
// import { addCar } from "../../redux/carSlice";

const AddCarForm = () => {
  const dispatch = useDispatch();

  const [images, setImages] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    model: "",
    category: "",
    rentPerDay: "",
    transmission: "",
    fuelType: "",
    seat: "",
    location: "",
    description: "",
  });

  const {loading} = useSelector((state)=>state.car)

  // input change
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // submit
  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    ...formData,
    images: images.map((img) => img.preview),
  };

  const result = await dispatch(addCar(payload));

  if (addCar.fulfilled.match(result)) {
    alert("Car Added Successfully ✅");

    setFormData({
      title: "",
      brand: "",
      model: "",
      category: "",
      rentPerDay: "",
      transmission: "",
      fuelType: "",
      seat: "",
      location: "",
      description: "",
    });

    setImages([]);
  } else {
    alert(result.payload);
  }
};

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-3xl bg-white p-6 shadow-sm"
    >
      {/* Images */}

      <ImageUploader images={images} setImages={setImages} />

      {/* Form */}

      <div className="grid gap-6 md:grid-cols-2">

        {/* Title */}

        <Input
          label="Car Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />

        {/* Model */}

        <Input
          label="Model"
          name="model"
          value={formData.model}
          onChange={handleChange}
        />

        {/* Brand */}

        <Select
          label="Brand"
          name="brand"
          value={formData.brand}
          onChange={handleChange}
          options={brands}
        />

        {/* Category */}

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={categories}
        />

        {/* Rent */}

        <Input
          label="Rent Per Day"
          name="rentPerDay"
          type="number"
          value={formData.rentPerDay}
          onChange={handleChange}
        />

        {/* Fuel */}

        <Select
          label="Fuel Type"
          name="fuelType"
          value={formData.fuelType}
          onChange={handleChange}
          options={fuelTypes}
        />

        {/* Transmission */}

        <Select
          label="Transmission"
          name="transmission"
          value={formData.transmission}
          onChange={handleChange}
          options={transmissions}
        />

        {/* Seat */}

        <Select
          label="Seats"
          name="seat"
          value={formData.seat}
          onChange={handleChange}
          options={seats}
        />

        {/* Location */}

        <Input
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
        />

      </div>

      {/* Description */}

      <div>

        <label className="mb-2 block text-sm font-semibold">
          Description
        </label>

        <textarea
          rows={5}
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full rounded-xl border border-slate-300 p-4 outline-none focus:border-blue-500"
        />

      </div>

      {/* Button */}

      <div className="flex justify-end">
<button
  type="submit"
  disabled={loading}
  className="rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
>
  {loading ? "Adding..." : "Add Car"}
</button>

      </div>
    </form>
  );
};

export default AddCarForm;





function Input({
  label,
  ...props
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <input
        {...props}
        className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
      />

    </div>
  );
}






function Select({
  label,
  options,
  ...props
}) {
  return (
    <div>

      <label className="mb-2 block text-sm font-semibold">
        {label}
      </label>

      <select
        {...props}
        className="w-full rounded-xl border border-slate-300 p-3 outline-none focus:border-blue-500"
      >
        <option value="">
          Select {label}
        </option>

        {options.map((item) => (
          <option
            key={item}
            value={item}
          >
            {item}
          </option>
        ))}

      </select>

    </div>
  );
}