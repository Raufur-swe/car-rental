import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loginUser } from "../../api/auth/authApi";

const LoginPage = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const res = await loginUser(data);

      toast.success(res.message);

      const role = res.user.role;

      if (role === "customer") {
        navigate("/customer/dashboard");
      }

      if (role === "owner") {
        navigate("/owner/dashboard");
      }

      if (role === "admin") {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">

      <h1 className="text-center text-3xl font-bold text-white">
        Welcome Back
      </h1>

      <p className="mt-2 text-center text-gray-400">
        Login to your account
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-5"
      >
        {/* Email */}

        <div>
          <label className="mb-2 block text-sm text-gray-300">
            Phone
          </label>

          <input
            type="phone"
            placeholder="017XXXXXXX"
            {...register("phone", {
              required: "phone number is required",
            })}
            className="w-full rounded-xl border border-gray-700 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-blue-500"
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
                required: "Password is required",
              })}
              className="w-full rounded-xl border border-gray-700 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-blue-500"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-4 text-white"
            >
              {showPassword ? (
                <HiOutlineEyeOff size={20} />
              ) : (
                <HiOutlineEye size={20} />
              )}
            </button>

          </div>

          <p className="mt-1 text-sm text-red-400">
            {errors.password?.message}
          </p>

        </div>

        {/* Remember */}

        <div className="flex items-center justify-between">

          <label className="flex items-center gap-2 text-sm text-gray-300">

            <input
              type="checkbox"
              className="accent-blue-600"
            />

            Remember Me

          </label>

          <button
            type="button"
            className="text-sm text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>

        </div>

        {/* Login */}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Logging In..." : "Login"}
        </button>

      </form>

      <p className="mt-6 text-center text-gray-400">

        Don't have an account?{" "}

        <Link
          to="/register"
          className="font-semibold text-blue-500"
        >
          Register
        </Link>

      </p>

    </div>
  );
};

export default LoginPage;