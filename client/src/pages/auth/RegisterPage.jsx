import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Link } from "react-router-dom";
import { registerUser } from "../../api/auth/authApi";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState("customer");
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data, role
      }

      delete payload.confirmPassword;

      const res = await registerUser(payload);

      toast.success(res.message)

      alert(`your otp : ${res.otp}`)
      navigate("/otp", {
        state: {
          phone: payload.phone
        }
      })
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      )
    }

  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <h1 className="text-center text-3xl font-bold text-white">
        Create Account
      </h1>

      <p className="mt-2 text-center text-sm text-gray-400">
        Join our car rental platform
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
      >
        {/* Name */}

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Full Name
          </label>

          <input
            {...register("name", {
              required: "Name is required",
            })}
            className="w-full rounded-xl border border-gray-700 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            placeholder="John Doe"
          />

          <p className="mt-1 text-sm text-red-400">
            {errors.name?.message}
          </p>
        </div>

        {/* Email */}

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Email
          </label>

          <input
            type="email"
            {...register("email", {
              required: "Email is required",
            })}
            className="w-full rounded-xl border border-gray-700 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            placeholder="demo@gmail.com"
          />

          <p className="mt-1 text-sm text-red-400">
            {errors.email?.message}
          </p>
        </div>

        {/* Phone */}

        <div>
          <label className="mb-2 block text-sm text-gray-300">
           NID
          </label>

          <input
            {...register("nid", {
              required: "nid is required",
            })}
            className="w-full rounded-xl border border-gray-700 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            placeholder="xxxxxxxxxx"
          />

          <p className="mt-1 text-sm text-red-400">
            {errors.nid?.message}
          </p>
        </div>
        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Phone
          </label>

          <input
            {...register("phone", {
              required: "Phone is required",
            })}
            className="w-full rounded-xl border border-gray-700 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            placeholder="017xxxxxxxx"
          />

          <p className="mt-1 text-sm text-red-400">
            {errors.phone?.message}
          </p>
        </div>

        {/* Password */}

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Password
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password required",
                minLength: 8,
              })}
              className="w-full rounded-xl border border-gray-700 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-white"
            >
              {showPassword ? (
                <HiOutlineEyeOff />
              ) : (
                <HiOutlineEye />
              )}
            </button>
          </div>
        </div>

        {/* Confirm */}

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Confirm Password
          </label>

          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword", {
                validate: (value) =>
                  value === password ||
                  "Password doesn't match",
              })}
              className="w-full rounded-xl border border-gray-700 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-4 text-white"
            >
              {showConfirm ? (
                <HiOutlineEyeOff />
              ) : (
                <HiOutlineEye />
              )}
            </button>
          </div>

          <p className="mt-1 text-sm text-red-400">
            {errors.confirmPassword?.message}
          </p>
        </div>

        {/* Role */}

        <div>
          <label className="mb-3 block text-sm text-gray-300">
            Choose Account Type
          </label>

          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`rounded-xl border p-4 transition ${role === "customer"
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-700 text-gray-300"
                }`}
            >
              Customer
            </button>

            <button
              type="button"
              onClick={() => setRole("owner")}
              className={`rounded-xl border p-4 transition ${role === "owner"
                  ? "border-blue-500 bg-blue-500 text-white"
                  : "border-gray-700 text-gray-300"
                }`}
            >
              Owner
            </button>

          </div>
        </div>

        {/* Submit */}

        <button
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Create Account
        </button>

      </form>

      <p className="mt-6 text-center text-gray-400">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-blue-500"
        >
          Login
        </Link>
      </p>

    </div>
  );
};

export default RegisterPage;