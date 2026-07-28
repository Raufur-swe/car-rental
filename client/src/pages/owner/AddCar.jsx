import AddCarForm from "../../components/owner/AddCarForm";


const AddCar = () => {
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Add New Car
        </h1>

        <p className="mt-2 text-slate-500">
          Fill in the details below to add a new car.
        </p>
      </div>

      <AddCarForm />
    </section>
  );
};

export default AddCar;