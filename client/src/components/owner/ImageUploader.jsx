import { FaTrash } from "react-icons/fa";

const ImageUploader = ({ images, setImages }) => {
  const handleImage = (e) => {
    const files = Array.from(e.target.files);

    const previews = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...previews]);
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-slate-700">
        Car Images
      </label>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImage}
        className="block w-full rounded-xl border border-slate-300 p-3"
      />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative overflow-hidden rounded-xl border"
          >
            <img
              src={img.preview}
              alt=""
              className="h-32 w-full object-cover"
            />

            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-2 text-white"
            >
              <FaTrash size={12} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploader;